import { Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import {
  AccountLocals,
  Rank,
  RankedSoloQueue,
  SortedRank,
} from "../../../types";

export async function getUpdatedRank(
  _: any,
  res: Response<any, AccountLocals>,
  next: NextFunction
) {
  try {
    const { host, updatedAccount } = res.locals;
    const { id } = res.locals.updatedAccount;

    const updatedRank = await riot(host).getSummonerRankById(id);

    const { tier, rank, leaguePoints, wins, losses } = findRankedSoloQueue(
      updatedRank
    ) as RankedSoloQueue;

    const sortedRank: SortedRank = {
      rank: tier,
      tier: rank,
      lp: leaguePoints,
      games: wins + losses,
      wins,
    };

    res.locals.updatedAccountWithRank = {
      ...updatedAccount,
      ...sortedRank,
    };

    res.locals.test = updatedRank;

    next();
  } catch (err) {
    next(err);
  }
}

function findRankedSoloQueue(updatedRank: Rank[]) {
  const rankedSoloQueue = updatedRank.find(
    ({ queueType }) => queueType === "RANKED_SOLO_5x5"
  );

  if (!rankedSoloQueue)
    throw new Error("No ranked solo queue found for the summoner");

  return rankedSoloQueue;
}
