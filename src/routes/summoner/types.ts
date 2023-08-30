import { StoredAccount } from "../../database/models";
import { Account } from "../../riot-api/types";

export interface AccountLocals {
  host: string;
  region: string;
  upToDateAccount: PartialAccount;
  upToDateAccountWithRank: AccountWithRank;
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
