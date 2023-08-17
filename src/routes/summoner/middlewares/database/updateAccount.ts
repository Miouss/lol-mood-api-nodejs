import { Request, Response, NextFunction } from "express";
import { Account, StoredAccount } from "../../../../database/models";
import { AccountLocals, AccountWithRank } from "../../../types";

export async function updateAccount(
  _: Request,
  res: Response<any, AccountLocals>,
  next: NextFunction
) {
  try {
    const { updatedAccountWithRank, storedAccount } = res.locals;
    const isAccountFound = storedAccount || updatedAccountWithRank;
    const isAccountStored = !!storedAccount;
    const hasRankedGames = updatedAccountWithRank.rank;

    if (!isAccountFound)
      throw new Error("No account found for this summoner name");

    if (!hasRankedGames)
      throw new Error("No ranked games found for this account");

    if (isAccountStored) {
      const hasAtLeastOneChange = checkChanges(
        updatedAccountWithRank,
        storedAccount
      );

      if (hasAtLeastOneChange) {
        await Account.update(updatedAccountWithRank);
      }
    } else {
      await Account.create(updatedAccountWithRank);
    }

    next();
  } catch (err) {
    next(err);
  }
}

function checkChanges(
  updatedAccountWithRank: AccountWithRank,
  storedAccount: StoredAccount
) {
  const { name, profileIconId, summonerLevel, tier, rank, lp, games } =
    updatedAccountWithRank;
  const {
    name: storedName,
    profileIconId: storedProfileIconId,
    level: storedLevel,
    grade: storedGrade,
    tier: storedTier,
    lp: storedLP,
    games: storedGames,
  } = storedAccount;

  const hasChangedName = name != storedName;
  const hasChangedProfileIcon = profileIconId != storedProfileIconId;
  const hasChangedLevel = summonerLevel != storedLevel;
  const hasChangedRank = rank != storedGrade;
  const hasChangedTier = tier != storedTier;
  const hasChangedLP = lp != storedLP;
  const hasChangedGames = games != storedGames;

  const hasAtLeastOneChange =
    hasChangedName ||
    hasChangedProfileIcon ||
    hasChangedLevel ||
    hasChangedRank ||
    hasChangedTier ||
    hasChangedLP ||
    hasChangedGames;

  return hasAtLeastOneChange;
}
