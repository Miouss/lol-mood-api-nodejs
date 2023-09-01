import { riot } from "../utils";
import { Rank, RankedSoloQueue, SortedRank } from "../types";

export async function getUpToDateRank(host: string, id: string) {
  const upToDateRank = await riot(host).getSummonerRankById(id);

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

  return sortedRank;
}

function findRankedSoloQueue(upToDateRank: Rank[]) {
  const rankedSoloQueue = upToDateRank.find(
    ({ queueType }) => queueType === "RANKED_SOLO_5x5"
  );

  if (!rankedSoloQueue)
    throw new Error("No ranked solo queue found for this summoner");

  return rankedSoloQueue;
}
