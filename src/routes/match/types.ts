import { MatchInfo, MatchTimeline } from "../../riot-api/types";
import { ParticipantStatsType } from "./utils";

export interface Locals {
  region: string;
  matchInfos: MatchInfo;
  participantsInfos: ParticipantInfosFiltered[];
  participantsStats: ParticipantStatsType[];
  participantsInfosMergedWithStats: ParticipantInfosMergedWithStats[];
  matchTimeline: MatchTimeline;
  assetsIds: AssetsIds;
  champsNames: string[];
  test: any;
}

export interface ParticipantInfosMergedWithStats {
    puuid: string;
    lane: string;
    win: boolean;

    kills: number;
    deaths: number;
    assists: number;

    evolvesOrder: string;
    skillsOrder: string;

    primaryStyleId: number;
    subStyleId: number;
    perkId: number;

    runeId0: number;
    runeId1: number;
    runeId2: number;
    runeId3: number;
    runeId4: number;

    statsModId0: number;
    statsModId1: number;
    statsModId2: number;

    summonerId0: number;
    summonerId1: number;

    startItemId0?: number;
    startItemId1?: number;
    startItemId2?: number;
    startItemId3?: number;
    startItemId4?: number;
    startItemId5?: number;

    completedItemId0?: number;
    completedItemId1?: number;
    completedItemId2?: number;
    completedItemId3?: number;
    completedItemId4?: number;
    completedItemId5?: number;
  }

export interface ParticipantInfosFiltered {
  puuid: string;
  lane: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  assets: AssetsIds;
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
