import { Request, Response, NextFunction } from "express";
import { arrayToKeyedObj } from "../../utils";
import { ParticipantInfos } from "../../../riot-api/types";
import { AssetIdsByPuuid, Locals, ParticipantInfosFiltered } from "../types";

export async function extractMatchInfos(
  _: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { matchInfos } = res.locals;

    const participantsInfos: ParticipantInfosFiltered[] = [];
    const assetsIds: any = {};
    const champsNames: string[] = [];

    matchInfos.info.participants.forEach((participant, i) => {
      const repetitiveFields = extractRepetitiveFieldsObj(participant);

      filterUniqueChampionsNames(champsNames, participant.championName);
      fillAssetIds(participant, assetsIds, repetitiveFields);
      fillParticipantsInfos(participant, participantsInfos, assetsIds);
    });

    res.locals.participantsInfos = participantsInfos;
    res.locals.assetsIds = assetsIds;
    res.locals.champsNames = champsNames;

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

function fillParticipantsInfos(
  participant: ParticipantInfos,
  participantInfos: ParticipantInfosFiltered[],
  assetsIds: AssetIdsByPuuid,
) {
  const { puuid, lane, win, kills, deaths, assists } = participant;

  participantInfos.push({
    puuid,
    lane,
    win,
    kills,
    deaths,
    assists,
    assets: assetsIds[puuid],
  });
}

function fillAssetIds(
  participant: ParticipantInfos,
  assetIds: any,
  repetitiveFields: any
) {
  const { puuid, perks } = participant;
  const [primaryStyle, subStyle] = perks.styles;
  const repetitiveAssetIds = convertRepetitiveFieldsForDB(repetitiveFields);

  assetIds[puuid] = {
    ...repetitiveAssetIds,
  };

  assetIds[puuid];
  assetIds[puuid]["primaryStyleId"] = primaryStyle.style;
  assetIds[puuid]["subStyleId"] = subStyle.style;
  assetIds[puuid]["perkId"] = primaryStyle.selections[0].perk;
}

function extractRepetitiveFieldsObj(
  participant: ParticipantInfos
): RepetitiveFieldObj[] {
  const createData = (data: any, prefix: string) => ({
    data,
    prefix,
  });

  const extractRunes = () => {
    const [primaryStyle, subStyle] = participant.perks.styles;
    const runesTree = primaryStyle.selections.concat(subStyle.selections);
    runesTree.shift();

    return createData(
      runesTree.map((rune) => rune.perk),
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
    createData(Object.values(participant.perks.statPerks), "statsModId");

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
      ...arrayToKeyedObj(field.data, field.prefix),
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
