import { MatchInfo, MatchTimeline } from "..";
import { ParticipantStatsType } from "../../summoner/utils";

export interface MatchesLocals {
  region: string;
  puuid: string;
  matches: string[];
  matchesNotStoredByMatch: MatchesNotStoredByMatch;
  matchesInfosByMatch: MatchesInfosByMatch;
  matchesTimelines: MatchTimeline[];
  participantsInfosByMatch: ParticipantInfosByMatch;
  assetIdsByMatch: AssetIdsByMatch;
  participantsStatsByMatch: ParticipantStatsTypeByMatch;
  test: any;
}

export interface MatchesNotStoredByMatch {
  [matchId: string]: [];
}

export interface MatchesInfosByMatch {
  [matchId: string]: MatchInfo;
}

export interface ParticipantStatsTypeByMatch {
    [matchId: string]: ParticipantStatsType[];
}

export interface AssetIdsByMatch {
  [matchId: string]: ParticipantAssetIds[];
}

export interface ParticipantAssetIds {
  puuid: string;
  assets: AssetObj[];
}

export interface AssetObj {
  data: number | string;
  field: string;
}

export interface ParticipantInfosByMatch {
  [matchId: string]: ParticipantInfos[];
}

export interface ParticipantInfos {
  puuid: string;
  lane: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
}
