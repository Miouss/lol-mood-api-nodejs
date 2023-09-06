import { Request, Response, NextFunction } from "express";
import {
  GameInfo,
  ParticipantMatchDataResponse,
} from "../../../database/models";
import { twoDecimalsNumByPercent } from "../../utils";

export async function getChampGames(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { champName } = req.params;

    const games = await GameInfo.getByChamp(champName);

    const startItemsStats = getStartItemsStats(games);

    const completedItemsStats = getCompleteditemsList(games);

    const mostPlayedStatsMods = getMostPlayedStatsMods(games);

    res.json({ startItemsStats });
  } catch (err) {
    next(err);
  }
}

function getMostPlayedStatsMods(games: ParticipantMatchDataResponse[]) {
  const statsModsStatsList: StatsModStats[][] = [[], [], []];
  const defaultStats: StatsModStats = { statMod: 0, played: 0 };

  games.forEach((game) => {
    game.statsMods.forEach((statMod, i) => {
      const statsModsStats = statsModsStatsList[i];

      const index = statsModsStats.findIndex(
        (currStatMod) => statMod === currStatMod.statMod
      );

      const hasFoundIndex = index >= 0;

      if (!hasFoundIndex) {
        statsModsStats.push({ ...defaultStats, statMod });
      }

      statsModsStats[hasFoundIndex ? index : statsModsStats.length - 1]
        .played++;
    });
  });

  statsModsStatsList.forEach((statsMods) => {
    sortByMostPlayed(statsMods);
  });

  const mostPlayedStatsMods = statsModsStatsList.map(
    (statsMods) => statsMods[0].statMod
  );

  return mostPlayedStatsMods;
}

function getStartItemsStats(games: ParticipantMatchDataResponse[]) {
  const startItemsStats: StartItemsStats[] = [];
  const totalPlayed = games.length;

  const defaultItemStats: StartItemsStats = {
    items: [],
    played: 0,
    wins: 0,
    playrate: 0,
    winrate: 0,
  };

  games.forEach((game) => {
    const index = startItemsStats.findIndex((startItems) =>
      startItems.items.every((item, i) => item === game.startItems[i])
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      startItemsStats.push({ ...defaultItemStats, items: game.startItems });
    }

    const stats =
      startItemsStats[hasFoundIndex ? index : startItemsStats.length - 1];
    stats.played++;
    stats.wins += Number(game.win);
  });

  startItemsStats.forEach((stats) => {
    calculateWinAndPlayrate(stats, totalPlayed);
  });

  return startItemsStats;
}

function getCompleteditemsList(games: ParticipantMatchDataResponse[]) {
  const NUM_COMPLETED_ITEMS = 5;
  const defaultItemsStats = { items: [], totalPlayed: 0 };

  const completedItemsStatsList: CompletedItemsStatsList[] =
    createArrayOfSameObj(defaultItemsStats, NUM_COMPLETED_ITEMS);

  const defaultItem: CompletedItemsStats = {
    itemId: 0,
    played: 0,
    wins: 0,
    playrate: 0,
    winrate: 0,
  };

  games.forEach((game) => {
    game.completedItems.every((itemId, i) => {
      if (!itemId) return false;

      const items = completedItemsStatsList[i].items;

      const index = items.findIndex((currItem) => itemId === currItem.itemId);
      const hasFoundIndex = index >= 0;

      if (!hasFoundIndex) {
        items.push({ ...defaultItem, itemId });
      }

      const item = items[hasFoundIndex ? index : items.length - 1];

      item.played++;
      item.wins += Number(game.win);

      completedItemsStatsList[i].totalPlayed++;

      return true;
    });
  });

  completedItemsStatsList.forEach((itemsStats) => {
    itemsStats.items.forEach((stats: CompletedItemsStats | number) => {
      const isTotalPlayedProp = typeof stats === "number";

      if (!isTotalPlayedProp)
        calculateWinAndPlayrate(stats, itemsStats.totalPlayed);
    });
  });

  return completedItemsStatsList;
}

function createArrayOfSameObj<T>(obj: T, length: number) {
  return Array.from({ length }).map((_) => JSON.parse(JSON.stringify(obj)));
}

function calculateWinAndPlayrate<T extends Stats>(
  stats: T,
  totalPlayed: number
) {
  stats.playrate = twoDecimalsNumByPercent(stats.played / totalPlayed);
  stats.winrate = twoDecimalsNumByPercent(stats.wins / stats.played);
}

function sortByMostPlayed<T extends { played: number }>(statsList: T[]) {
  statsList.sort((a, b) => b.played - a.played);
}

interface StatsModStats {
  statMod: number;
  played: number;
}

interface CompletedItemsStatsList {
  items: CompletedItemsStats[];
  totalPlayed: number;
}

interface CompletedItemsStats extends Stats {
  itemId: number;
}

interface StartItemsStats extends Stats {
  items: number[];
}

interface Stats {
  played: number;
  wins: number;
  playrate: number;
  winrate: number;
}
