import { ParticipantMatchDataResponse } from "../../database/models";
import { AccountWithRank } from "../../riot-api/types";

export interface Locals {
  region: string;
  host: string;
  account: AccountWithRank;
  matchesData: ParticipantMatchDataResponse[];
  topChampsByMostPlayed: [string, ChampStats][];
}

export interface ChampStats {
  wins: number;
  played: number;
  winrate: number;
  kills: number;
  deaths: number;
  assists: number;
  killsAvg: number;
  deathsAvg: number;
  assistsAvg: number;
}

export interface ParticipantInfosFiltered extends AssetsIds {
  puuid?: string;
  accountId: number;
  gameId: number;
  champId: number;
  lane: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
}

export interface AssetIdsByPuuid {
  [puuid: string]: AssetsIds;
}

export interface AssetsIds {
  itemId0?: number;
  itemId1?: number;
  itemId2?: number;
  itemId3?: number;
  itemId4?: number;
  itemId5?: number;
  itemId6?: number;

  statsModId0: number;
  statsModId1: number;
  statsModId2: number;

  summonerId0: number;
  summonerId1: number;

  primaryStyleId: number;
  subStyleId: number;
  perkId: number;

  runeId0: number;
  runeId1: number;
  runeId2: number;
  runeId3: number;
  runeId4: number;
}
