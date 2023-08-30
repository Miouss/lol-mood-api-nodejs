import { StoredAccount } from "../../database/models";
import { components } from "./schema";

export type Account = components["schemas"]["summoner-v4.SummonerDTO"];
export type Rank = components["schemas"]["league-v4.LeagueEntryDTO"];
export type MatchInfo = components["schemas"]["match-v5.MatchDto"];
export type ParticipantInfos = components["schemas"]["match-v5.ParticipantDto"];
export type Perks = components["schemas"]["match-v5.PerksDto"];
export type PerkStyle = components["schemas"]["match-v5.PerkStyleDto"];
export type PerkStats = components["schemas"]["match-v5.PerkStatsDto"];
export type MatchTimeline = components["schemas"]["match-v5.MatchTimelineDto"];

export interface AccountWithRank extends PartialAccount, SortedRank {}

export interface PartialAccount
  extends Omit<Account, "revisionDate" | "accountId"> {
  accountId?: string;
  revisionDate?: number;
}

export interface SortedRank {
  rank: string;
  tier: string;
  lp: number;
  games: number;
  wins: number;
}

export type RankedSoloQueue = Required<Omit<Rank, "miniSeries">>;

export interface AccountLocals {
  host: string;
  region: string;
  upToDateAccount: PartialAccount;
  accountWithRank: AccountWithRank;
  storedAccount: StoredAccount;
  test: any;
}

export interface AccountWithRank extends PartialAccount, SortedRank {}

export interface PartialAccount
  extends Omit<Account, "revisionDate" | "accountId"> {
  accountId?: string;
  revisionDate?: number;
}

export interface SortedRank {
  rank: string;
  tier: string;
  lp: number;
  games: number;
  wins: number;
}
