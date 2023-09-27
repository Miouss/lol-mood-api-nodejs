import { StoredAccount, Account } from "../../../database/models";
import { AccountWithRank } from "../../../riot-api/types";

export async function updateAccount(
  upToDateAccountWithRank: AccountWithRank,
  storedAccount?: StoredAccount
) {
  const isAccountFound =
    Boolean(storedAccount) || Boolean(upToDateAccountWithRank);
  const isAccountStored = !!storedAccount;
  const hasRankedGames = !!upToDateAccountWithRank.rank;

  if (!isAccountFound)
    throw new Error("No account found for this summoner name");

  if (!hasRankedGames)
    throw new Error("No ranked games found for this account");

  if (isAccountStored) {
    const hasAtLeastOneChange = checkChanges(
      upToDateAccountWithRank,
      storedAccount
    );

    if (hasAtLeastOneChange) {
      await Account.update(upToDateAccountWithRank);
    }
  } else {
    await Account.add(upToDateAccountWithRank);
  }
}

function checkChanges(
  upToDateAccountWithRank: AccountWithRank,
  storedAccount: StoredAccount
) {
  const { name, profileIconId, summonerLevel, tier, rank, lp, games } =
    upToDateAccountWithRank;
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
