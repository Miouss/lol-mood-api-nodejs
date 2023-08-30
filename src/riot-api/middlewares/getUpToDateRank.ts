import { Response, NextFunction } from "express";
import { riot } from "../utils";
import { Rank, RankedSoloQueue, SortedRank } from "../types";

export async function getUpToDateRank(
  _: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { host, upToDateAccount } = res.locals;

    const upToDateRank = await riot(host).getSummonerRankById(upToDateAccount.id);

    const { tier, rank, leaguePoints, wins, losses } = findRankedSoloQueue(
      upToDateRank
    ) as RankedSoloQueue;

    const sortedRank: SortedRank = {
      rank: tier,
      tier: rank,
      lp: leaguePoints,
      games: wins + losses,
      wins,
    };

    res.locals.upToDateAccountWithRank = {
      ...upToDateAccount,
      ...sortedRank,
    };

    next();
  } catch (err) {
    next(err);
  }
}

function findRankedSoloQueue(upToDateRank: Rank[]) {
  const rankedSoloQueue = upToDateRank.find(
    ({ queueType }) => queueType === "RANKED_SOLO_5x5"
  );

  if (!rankedSoloQueue)
    throw new Error("No ranked solo queue found for this summoner");

  return rankedSoloQueue;
}
