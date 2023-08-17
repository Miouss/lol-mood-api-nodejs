import { Account, Rank } from "..";
import { StoredAccount } from "../../../database/models";

export interface AccountLocals {
  host: string;
  region: string;
  updatedAccount: PartialAccount;
  updatedAccountWithRank: AccountWithRank;
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

export type RankedSoloQueue = Required<Omit<Rank, "miniSeries">>;
