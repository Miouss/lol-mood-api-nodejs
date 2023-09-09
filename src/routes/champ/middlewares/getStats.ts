import { Request, Response, NextFunction } from "express";
import { Locals } from "../types";
import { ParticipantMatchDataResponse } from "../../../database/models";
import { twoDecimalsNumByPercent } from "../../utils";

export function getStats(
  req: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { games } = res.locals;

    const startItemsStats = getStartItemsStatsList(games);
    const completedItemsStats = getCompletedItemsList(games);
    const mostPlayedStatsMods = getMostPlayedStatsMods(games);
    const fullRunesStats = getRunesStatsList(games);

    const items = {
      starting: {
        mostPlayed: getSorted(startItemsStats).ByMostPlayed(),
        mostWinrate: getSorted(startItemsStats).ByMostWinrate(),
      },
      completed: {
        mostPlayed: completedItemsStats.map((stats) =>
          getSorted(stats.items).ByMostPlayed()
        ),
        mostWinrate: completedItemsStats.map((stats) =>
          getSorted(stats.items).ByMostWinrate()
        ),
      },
    };

    res.locals.items = items;
    res.locals.mostPlayedStatsMods = mostPlayedStatsMods;
    res.locals.runesStats = fullRunesStats;

    next();
  } catch (err) {
    next(err);
  }
}

function getRunesStatsList(games: ParticipantMatchDataResponse[]) {
  const totalPlayed = games.length;

  const primaryRunesStats: RunesStats[] = [];
  const secondaryRunesStats: RunesStats[] = [];
  const stylesStats: StylesStats[] = [];

  const handleRunesStats = (
    runesStats: RunesStats[],
    runesIds: number[],
    win: boolean
  ) => {
    const index = runesStats.findIndex((runeStats) =>
      runeStats.runesIds.every((runeId, i) => runeId === runesIds[i])
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      pushDefaultStats(runesStats, { runesIds });
    }

    const j = getRightIndex(runesStats, index);

    runesStats[j].played++;
    runesStats[j].wins += Number(win);
  };

  games.forEach(
    ({ runes: runesIds, win, primaryStyleId, subStyleId, perkId }) => {
      const runesids = {
        primary: [runesIds[0], runesIds[1], runesIds[2]],
        secondary: [runesIds[3], runesIds[4]],
      };

      handleRunesStats(primaryRunesStats, runesids.primary, win);
      handleRunesStats(secondaryRunesStats, runesids.secondary, win);

      const stylesIds = {
        primaryId: primaryStyleId,
        subId: subStyleId,
        perkId,
      };

      const index = stylesStats.findIndex(
        (styleStats) =>
          styleStats.perkId === perkId &&
          styleStats.subId === subStyleId &&
          styleStats.primaryId === primaryStyleId
      );

      const hasFoundIndex = index >= 0;

      if (!hasFoundIndex) {
        pushDefaultStats(stylesStats, stylesIds);
      }

      const j = getRightIndex(stylesStats, index);

      stylesStats[j].played++;
      stylesStats[j].wins += Number(win);
    }
  );

  primaryRunesStats.forEach((primaryRunes) => {
    calculatePlayrate(primaryRunes, totalPlayed);
    calculateWinrate(primaryRunes);
  });

  secondaryRunesStats.forEach((secondaryRunes) => {
    calculatePlayrate(secondaryRunes, totalPlayed);
    calculateWinrate(secondaryRunes);
  });

  stylesStats.forEach((styleStats) => {
    calculatePlayrate(styleStats, totalPlayed);
    calculateWinrate(styleStats);
  });

  return { primaryRunesStats, secondaryRunesStats, stylesStats };
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

      const j = getRightIndex(statsModsStats, index);

      statsModsStats[j].played++;
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

function getStartItemsStatsList(games: ParticipantMatchDataResponse[]) {
  const startItemsStatsList: StartItemsStats[] = [];
  const totalPlayed = games.length;

  games.forEach(({ startItems, win }) => {
    const index = startItemsStatsList.findIndex(({ items }) =>
      items.every((item, i) => item === startItems[i])
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      pushDefaultStats(startItemsStatsList, { items: startItems });
    }

    const j = getRightIndex(startItemsStatsList, index);

    startItemsStatsList[j].played++;
    startItemsStatsList[j].wins += Number(win);
  });

  startItemsStatsList.forEach((stats) => {
    calculatePlayrate(stats, totalPlayed);
    calculateWinrate(stats);
  });

  return startItemsStatsList;
}

function getCompletedItemsList(games: ParticipantMatchDataResponse[]) {
  const NUM_COMPLETED_ITEMS = 5;
  const defaultItemsStats = { items: [], totalPlayed: 0 };

  const completedItemsStatsList: CompletedItemsStatsList[] =
    createArrayOfSameObj(defaultItemsStats, NUM_COMPLETED_ITEMS);

  games.forEach((game) => {
    game.completedItems.every((itemId, i) => {
      if (!itemId) return false;

      const items = completedItemsStatsList[i].items;

      const index = items.findIndex((currItem) => itemId === currItem.itemId);
      const hasFoundIndex = index >= 0;

      if (!hasFoundIndex) {
        pushDefaultStats(items, { itemId });
      }

      const j = getRightIndex(items, index);

      items[j].played++;
      items[j].wins += Number(game.win);

      completedItemsStatsList[i].totalPlayed++;

      return true;
    });
  });

  completedItemsStatsList.forEach((stats) => {
    stats.items.forEach((itemStats: CompletedItemsStats | number) => {
      const isTotalPlayedProp = typeof itemStats === "number";

      if (!isTotalPlayedProp) {
        calculatePlayrate(itemStats, stats.totalPlayed);
        calculateWinrate(itemStats);
      }
    });
  });

  return completedItemsStatsList;
}

function pushDefaultStats<T extends Stats>(
  statsList: T[],
  stats: Omit<T, "played" | "wins" | "winrate" | "playrate">
) {
  const defaultStats: Stats = {
    played: 0,
    wins: 0,
    playrate: 0,
    winrate: 0,
  };

  statsList.push({ ...defaultStats, ...stats } as T);
}

function getRightIndex(arr: unknown[], index: number) {
  return index >= 0 ? index : arr.length - 1;
}

function createArrayOfSameObj<T>(obj: T, length: number) {
  return Array.from({ length }).map((_) => JSON.parse(JSON.stringify(obj)));
}

function calculateWinrate<T extends Stats>(stats: T) {
  stats.winrate = twoDecimalsNumByPercent(stats.wins / stats.played);
}

function calculatePlayrate<T extends Stats>(stats: T, totalPlayed: number) {
  stats.playrate = twoDecimalsNumByPercent(stats.played / totalPlayed);
}

function sortByMostPlayed<T extends { played: number }>(statsList: T[]) {
  statsList.sort((a, b) => b.played - a.played);
}

function getSorted<T extends Stats>(arr: T[]) {
  return {
    ByMostPlayed: () => arr.sort((a, b) => b.played - a.played),
    ByMostWinrate: () => arr.sort((a, b) => b.winrate - a.winrate),
  };
}

interface StatsModStats {
  statMod: number;
  played: number;
}

interface CompletedItemsStatsList {
  items: CompletedItemsStats[];
  totalPlayed: number;
}

export interface CompletedItemsStats extends Stats {
  itemId: number;
}

export interface StartItemsStats extends Stats {
  items: number[];
}

export interface RunesStatsList {
  primaryRunesStats: RunesStats[];
  secondaryRunesStats: RunesStats[];
  stylesStats: StylesStats[];
}

interface RunesStats extends Stats {
  runesIds: number[];
}

interface StylesStats extends Stats {
  primaryId: number;
  subId: number;
  perkId: number;
}

interface Stats {
  played: number;
  wins: number;
  playrate: number;
  winrate: number;
}
