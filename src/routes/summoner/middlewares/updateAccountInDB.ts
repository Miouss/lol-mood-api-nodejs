import { Request, Response, NextFunction } from "express";
import { Account, AccountType, AccountTypeDB } from "../../../database/models";

export async function updateAccountInDB(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { updatedAccount, storedAccount } = res.locals;
    const isAccountFound = storedAccount || updatedAccount;
    const isAccountStored = !!storedAccount;
    const hasRankedGames = updatedAccount.rank;

    if (!isAccountFound)
      throw new Error("No account found for this summoner name");
    if (!hasRankedGames)
      throw new Error("No ranked games found for this account");

    if (isAccountStored) {
      const hasAtLeastOneChange = checkChanges(updatedAccount, storedAccount);

      if (hasAtLeastOneChange) {
        await Account.update(updatedAccount);
      }
    } else {
      await Account.create(updatedAccount);
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

function checkChanges(
  updatedAccount: AccountType,
  storedAccount: AccountTypeDB
) {
  const { name, profileIconId, summonerLevel, tier, rank, lp, games } =
    updatedAccount;
  const {
    name: storedName,
    profile_icon_id: storedProfileIconId,
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
