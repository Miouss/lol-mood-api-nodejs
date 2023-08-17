import { Request, Response, NextFunction } from "express";
import { arrayToKeyedObject } from "../../utils";
import {
  AssetIdsByMatch,
  AssetObj,
  MatchesLocals,
  ParticipantAssetIds,
  ParticipantInfos,
  ParticipantInfosByMatch,
} from "../../../types";

export async function extractMatchesInfos(
  _: Request,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { matchesInfosByMatch } = res.locals;

    if (!matchesInfosByMatch) return next();

    let participantsInfosByMatch: ParticipantInfosByMatch = {};
    let assetIdsByMatch: AssetIdsByMatch = {};
    const champsNames: string[] = [];
    const uniqueAssetIds: Array<string | number> = [];

    for (const [matchId, matchData] of Object.entries(matchesInfosByMatch)) {
      const participantInfos: ParticipantInfos[] = [];
      const assetIds: ParticipantAssetIds[] = [];

      ((matchData as any).info.participants as any[]).forEach(
        (participant: any, index) => {
          const repetitiveFields = repetitiveFieldsObj(participant);

          fillParticipantInfos(participant, participantInfos);
          filterUniqueChampionsNames(champsNames, participant.championName);
          fillAssetIds(participant, assetIds, repetitiveFields, index);
        }
      );

      participantsInfosByMatch[matchId] = participantInfos;
      assetIdsByMatch[matchId] = assetIds;

      filterUniqueAssetIds(assetIds, uniqueAssetIds);
    }

    res.locals.participantsInfosByMatch = participantsInfosByMatch;
    res.locals.assetIdsByMatch = assetIdsByMatch;

    next();
  } catch (err) {
    next(err);
  }
}

function filterUniqueChampionsNames(
  champsNames: string[],
  championName: string
) {
  const isChampNameUnknown = !champsNames.includes(championName);

  if (isChampNameUnknown) champsNames.push(championName);
}

function filterUniqueAssetIds(
  assetIds: ParticipantAssetIds[],
  uniqueAssetIds: Array<number | string>
) {
  assetIds.forEach(({ assets }) => {
    assets.forEach(({ data }) => {
      if (!uniqueAssetIds.includes(data)) uniqueAssetIds.push(data);
    });
  });
}

function fillParticipantInfos(participant: any, participantInfos: any) {
  const { puuid, lane, win, kills, deaths, assists } = participant;

  participantInfos.push({
    puuid,
    lane,
    win,
    kills,
    deaths,
    assists,
  });
}

function fillAssetIds(
  participant: any,
  assetIds: ParticipantAssetIds[],
  repetitiveFields: any,
  index: number
) {
  const { puuid, perks } = participant;
  const [primaryStyle, subStyle] = perks.styles;

  assetIds.push({
    puuid,
    assets: [],
  });

  assetIds[index].assets.push(
    assetObj(primaryStyle.style, "primaryStyleId"),
    assetObj(subStyle.style, "subStyleId"),
    assetObj(primaryStyle.selections[0].perk, "perkId")
  );

  const repetitiveAssetIds = convertRepetitiveFieldsForDB(repetitiveFields);

  Object.entries(repetitiveAssetIds).forEach(([field, data]) => {
    assetIds[index].assets.push(assetObj(data, field));
  });
}

function assetObj(data: number | string, field: string): AssetObj {
  return {
    data,
    field,
  };
}

function repetitiveFieldsObj(participant: any): RepetitiveFieldObj[] {
  const createData = (data: any, prefix: string) => ({
    data,
    prefix,
  });

  const extractRunes = () => {
    const [primaryStyle, subStyle] = participant.perks.styles;
    const runesTree = primaryStyle.selections.concat(subStyle.selections);
    runesTree.shift();

    return createData(
      runesTree.map((rune: any) => rune.perk),
      "runeId"
    );
  };

  const extractItems = () =>
    createData(convertRepetitivesFields(participant, 0, "item"), "itemId");

  const extractSummoners = () =>
    createData(
      convertRepetitivesFields(participant, 1, "summoner", "Id"),
      "summonerId"
    );

  const extractStatsMods = () =>
    createData(Object.keys(participant.perks.statPerks), "statsModId");

  return [
    extractItems(),
    extractStatsMods(),
    extractSummoners(),
    extractRunes(),
  ];
}

function convertRepetitivesFields(
  origin: any,
  startId: number,
  prefix: string,
  suffix: string = ""
): number[] {
  let fields: number[] = [];

  const itinerateField = (i: number) => origin[`${prefix}${i}${suffix}`];

  for (let i = startId; itinerateField(i); i++) {
    fields.push(itinerateField(i));
  }

  return fields;
}

function convertRepetitiveFieldsForDB(
  repetitiveFields: RepetitiveFieldObj[]
): RepetitiveFieldsForDB {
  let dataObj: any = {};

  repetitiveFields.forEach((field) => {
    dataObj = {
      ...dataObj,
      ...arrayToKeyedObject(field.data, field.prefix),
    };
  });

  return dataObj;
}

interface RepetitiveFieldObj {
  data: number[] | StatMod[];
  prefix: string;
}

type StatMod = "defense" | "flex" | "offense";

interface RepetitiveFieldsForDB {
  itemId0?: number;
  itemId1?: number;
  itemId2?: number;
  itemId3?: number;
  itemId4?: number;
  itemId5?: number;
  itemId6?: number;
  statsModId0: StatMod;
  statsModId1: StatMod;
  statsModId2: StatMod;
  summonerId0: number;
  summonerId1: number;
  runeId0: number;
  runeId1: number;
  runeId2: number;
  runeId3: number;
  runeId4: number;
}
