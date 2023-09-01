import { Game, Champ, Account } from "../../../database/models";
import { MatchInfo, ParticipantInfos } from "../../../riot-api/types";
import { ParticipantInfosFiltered, AssetIdsByPuuid } from "../types";
import { arrayToKeyedObj } from "../../utils";

export async function extractParticipantsInfos(matchInfos: MatchInfo) {
  const participantsInfos: ParticipantInfosFiltered[] = [];
  const assetsIds: any = {};
  const matchId = matchInfos.metadata.matchId;

  const gameId = await retrieveGameId(matchId);

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

  const accountId = await retrieveAccountId(puuid);
  const champId = await retrieveChampId(championName);

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

async function retrieveGameId(gameId: string) {
  await Game.create(gameId);

  return await Game.getId(gameId);
}

async function retrieveChampId(championName: string) {
  const isChampExists = await Champ.exists(championName);

  if (!isChampExists) await Champ.create(championName);

  return await Champ.getId(championName);
}

async function retrieveAccountId(puuid: string) {
  const isAccountExists = await Account.exists(puuid);

  if (!isAccountExists) await Account.createUnknownAccount(puuid);

  return await Account.getId(puuid);
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
