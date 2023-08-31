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

export interface ParticipantInfosFiltered {
  puuid: string;
  lane: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  
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
