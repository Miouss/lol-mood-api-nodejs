import { Game, Champ, Account } from "../../../database/models";
import { MatchInfo, ParticipantInfos } from "../../../riot-api/types";
import { ParticipantInfosFiltered, AssetIdsByPuuid } from "../types";
import { arrayToKeyedObj } from "../../utils";

export async function extractParticipantsInfos(matchInfos: MatchInfo) {
  const participantsInfos: ParticipantInfosFiltered[] = [];
  const assetsIds: any = {};
  const matchId = matchInfos.metadata.matchId;

  const gameId = await getId(matchId, Game);

  for (const participant of matchInfos.info.participants) {
    const repetitiveFields = extractRepetitiveFieldsObj(participant);

    fillAssetIds(participant, assetsIds, repetitiveFields);
    await fillParticipantsInfos(
      participant,
      participantsInfos,
      assetsIds,
      gameId
    );
  }

  return participantsInfos;
}

async function fillParticipantsInfos(
  participant: ParticipantInfos,
  participantInfos: ParticipantInfosFiltered[],
  assetsIds: AssetIdsByPuuid,
  gameId: number
) {
  const {
    puuid,
    individualPosition,
    win,
    kills,
    deaths,
    assists,
    championName,
  } = participant;

  const accountId = await getId(puuid, Account);
  const champId = await getId(championName, Champ);

  participantInfos.push({
    accountId,
    gameId,
    champId,
    puuid,
    lane: individualPosition,
    win,
    kills,
    deaths,
    assists,
    ...assetsIds[puuid],
  });
}

async function getId<T extends Table>(condition: string, table: T) {
  const isFound = await table.exists(condition);

  if (!isFound) await table.create(condition);

  return await table.getId(condition);
}

interface Table {
  exists: (condition: string) => Promise<boolean>;
  create: (condition: string) => Promise<void>;
  getId: (condition: string) => Promise<number>;
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
    primaryStyleId: primaryStyle.style,
    subStyleId: subStyle.style,
    perkId: primaryStyle.selections[0].perk,
  };
}

function extractRepetitiveFieldsObj(
  participant: ParticipantInfos
): RepetitiveFieldObj[] {
  const createObj = (data: any, prefix: string) => ({
    data,
    prefix,
  });

  const extractRunes = () => {
    const [primaryStyle, subStyle] = participant.perks.styles;
    const runesTree = primaryStyle.selections.concat(subStyle.selections);
    runesTree.shift();

    return createObj(
      runesTree.map((rune) => rune.perk),
      "runeId"
    );
  };

  const extractItems = () => {
    const data = createArrayFrom(participant)
      .ofRepetitiveFieldsStartingWith("item")
      .endingWith()
      .withStartId(0);

    if (data.length > 6) data.splice(6, 1);

    return createObj(data, "itemId");
  };

  const extractSummoners = () =>
    createObj(
      createArrayFrom(participant)
        .ofRepetitiveFieldsStartingWith("summoner")
        .endingWith("Id")
        .withStartId(1),
      "summonerId"
    );

  const extractStatsMods = () =>
    createObj(Object.values(participant.perks.statPerks), "statsModId");

  return [
    extractItems(),
    extractStatsMods(),
    extractSummoners(),
    extractRunes(),
  ];
}

const createArrayFrom = (origin: any) => ({
  ofRepetitiveFieldsStartingWith: (prefix: string) => ({
    endingWith: (suffix: string = "") => ({
      withStartId: (startId: number) => {
        const fields: number[] = [];

        const currentField = (i: number) => origin[`${prefix}${i}${suffix}`];

        for (let i = startId; currentField(i); i++) {
          fields.push(currentField(i));
        }

        return fields;
      },
    }),
  }),
});

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
