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

    const sumsStats = getSummonerSpellsStats(games);
    const skillsOrderStats = getSkillsOrderStats(games);
    const evolvesOrderStats = getEvolvesPriorityStats(games);
    const startItemsStats = getStartItemsStatsList(games);
    const coreItemsStats = getCoreItemsStatsList(games);
    const nthCompletedItemsStats = getNthCompletedItemsList(games);
    const mostPlayedStatsMods = getMostPlayedStatsMods(games);
    const fullRunesStats = getRunesStatsList(games);

    const items = {
      starting: {
        mostPlayed: getSorted(startItemsStats).ByMostPlayed()[0],
        mostWinrate: getSorted(startItemsStats).ByMostWinrate()[0],
      },
      completed: {
        core: {
          mostPlayed: getSorted(coreItemsStats).ByMostPlayed()[0],
          mostWinrate: getSorted(coreItemsStats).ByMostWinrate()[0],
        },
        nth: {
          mostPlayed: nthCompletedItemsStats.map((stats) =>
            getSorted(stats.items).ByMostPlayed()
          ),
          mostWinrate: nthCompletedItemsStats.map((stats) =>
            getSorted(stats.items).ByMostWinrate()
          ),
        },
      },
    };

    res.locals.items = items;
    res.locals.mostPlayedStatsMods = mostPlayedStatsMods;
    res.locals.runes = fullRunesStats;
    res.locals.skillsOrder = skillsOrderStats;
    res.locals.evolvesOrder = evolvesOrderStats;
    res.locals.summoners = sumsStats;

    next();
  } catch (err) {
    next(err);
  }
}

function getSummonerSpellsStats(games: ParticipantMatchDataResponse[]) {
  const summonerSpellsStats: SummonerSpellsStats[] = [];
  const totalPlayed = games.length;

  games.forEach((game) => {
    const { summoners, win } = game;

    const index = summonerSpellsStats.findIndex(
      ({ sums }) => sums.includes(summoners[0]) && sums.includes(summoners[1])
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      pushDefaultStats(summonerSpellsStats, { sums: summoners });
    }

    const j = getRightIndex(summonerSpellsStats, index);

    summonerSpellsStats[j].played++;
    summonerSpellsStats[j].wins += Number(win);
  });

  summonerSpellsStats.forEach((stats) => {
    calculatePlayrate(stats, totalPlayed);
    calculateWinrate(stats);
  });

  return {
    mostPlayed: getSorted(summonerSpellsStats).ByMostPlayed()[0],
    mostWinrate: getSorted(summonerSpellsStats).ByMostWinrate()[0],
  };
}

function getEvolvesPriorityStats(games: ParticipantMatchDataResponse[]) {
  const evolvesOrderStats: EvolvesOrderStats[] = [];
  const totalPlayed = games.length;

  games.forEach((game) => {
    const evolvesOrder = game.evolvesOrder;

    if (!evolvesOrder) return;
    const index = evolvesOrderStats.findIndex(
      ({ order }) => order.slice(0, evolvesOrder.length) === evolvesOrder
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      pushDefaultStats(evolvesOrderStats, { order: evolvesOrder });
    }

    const j = getRightIndex(evolvesOrderStats, index);

    evolvesOrderStats[j].played++;
    evolvesOrderStats[j].wins += Number(game.win);
  });

  if (!evolvesOrderStats.length) return null;

  evolvesOrderStats.forEach((stats) => {
    calculatePlayrate(stats, totalPlayed);
    calculateWinrate(stats);
  });

  return {
    mostPlayed: getSorted(evolvesOrderStats).ByMostPlayed()[0],
    mostWinrate: getSorted(evolvesOrderStats).ByMostWinrate()[0],
  };
}

function getSkillsOrderStats(games: ParticipantMatchDataResponse[]) {
  const skillsOrderStats: SkillOrderStats[] = [];
  const totalPlayed = games.length;

  games.forEach((game) => {
    const skillsOrder = game.skillsOrder;

    const index = skillsOrderStats.findIndex(
      ({ order }) => order.slice(0, skillsOrder.length) === skillsOrder
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      pushDefaultStats(skillsOrderStats, { order: skillsOrder });
    }

    const j = getRightIndex(skillsOrderStats, index);

    skillsOrderStats[j].played++;
    skillsOrderStats[j].wins += Number(game.win);
  });

  skillsOrderStats.forEach((stats) => {
    calculatePlayrate(stats, totalPlayed);
    calculateWinrate(stats);
  });

  return {
    mostPlayed: getSorted(skillsOrderStats).ByMostPlayed()[0],
    mostWinrate: getSorted(skillsOrderStats).ByMostWinrate()[0],
  };
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

  const runes = {
    mostPlayed: {
      primary: getSorted(primaryRunesStats).ByMostPlayed()[0],
      secondary: getSorted(secondaryRunesStats).ByMostPlayed()[0],
      styles: getSorted(stylesStats).ByMostPlayed()[0],
    },

    mostWinrate: {
      primary: getSorted(primaryRunesStats).ByMostWinrate()[0],
      secondary: getSorted(secondaryRunesStats).ByMostWinrate()[0],
      styles: getSorted(stylesStats).ByMostWinrate()[0],
    },
  };

  return runes;
}

function getMostPlayedStatsMods(games: ParticipantMatchDataResponse[]) {
  const statsModsStatsList: StatsModStats[] = [];
  const defaultStats: StatsModStats = { mods: [], played: 0, playrate: 0 };

  games.forEach(({ statsMods }) => {
    const index = statsModsStatsList.findIndex(({ mods }) =>
      mods.every((currMod, i) => currMod === statsMods[i])
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      statsModsStatsList.push({ ...defaultStats, mods: statsMods });
    }

    const j = getRightIndex(statsModsStatsList, index);

    statsModsStatsList[j].played++;
  });

  statsModsStatsList.forEach((stats) => {
    calculatePlayrate(stats, games.length);
  });

  sortByMostPlayed(statsModsStatsList);

  return statsModsStatsList[0];
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

function getCoreItemsStatsList(games: ParticipantMatchDataResponse[]) {
  const coreItemsStatsList: CoreCompletedItemsStats[] = [];
  const totalPlayed = games.length;

  games.forEach((game) => {
    const coreItems = game.completedItems.slice(0, 3);

    const index = coreItemsStatsList.findIndex((currItemsStats) =>
      currItemsStats.items.every((currItem, i) => coreItems.includes(currItem))
    );

    const hasFoundIndex = index >= 0;

    if (!hasFoundIndex) {
      pushDefaultStats(coreItemsStatsList, { items: coreItems });
    }

    const j = getRightIndex(coreItemsStatsList, index);

    coreItemsStatsList[j].played++;
    coreItemsStatsList[j].wins += Number(game.win);
  });

  coreItemsStatsList.forEach((stats) => {
    calculatePlayrate(stats, totalPlayed);
    calculateWinrate(stats);
  });

  return coreItemsStatsList;
}

function getNthCompletedItemsList(games: ParticipantMatchDataResponse[]) {
  const NTH_COMPLETED_ITEMS_START_INDEX = 3;
  const defaultItemsStats = { items: [], totalPlayed: 0 };

  const completedItemsStatsList: NthCompletedItemsStatsList[] =
    createArrayOfSameObj(defaultItemsStats, NTH_COMPLETED_ITEMS_START_INDEX);

  games.forEach((game) => {
    const completeditems = game.completedItems.slice(
      NTH_COMPLETED_ITEMS_START_INDEX,
      5
    );

    completeditems.every((itemId, i) => {
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
    stats.items.forEach((itemStats: NthCompletedItemsStats | number) => {
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

function calculatePlayrate<T extends Pick<Stats, "played" | "playrate">>(
  stats: T,
  totalPlayed: number
) {
  stats.playrate = twoDecimalsNumByPercent(stats.played / totalPlayed);
}

function sortByMostPlayed<T extends { played: number }>(statsList: T[]) {
  statsList.sort((a, b) => b.played - a.played);
}

function getSorted<T extends Stats>(arr: T[]) {
  return {
    ByMostPlayed: () => arr.sort((a, b) => b.played - a.played),
    ByMostWinrate: () =>
      arr.sort((a, b) => {
        const minPlayrate = 10;
        const betterWinrate = b.winrate - a.winrate > 0;
        const aHasMinPlayrate = a.playrate >= minPlayrate;
        const bHasMinPlayrate = b.playrate >= minPlayrate;

        if (!aHasMinPlayrate && bHasMinPlayrate) return 1;
        else if (betterWinrate) return 1;
        return -1;
      }),
  };
}

interface StatsModStats {
  mods: number[];
  played: number;
  playrate: number;
}

interface EvolvesOrderStats extends Stats {
  order: string;
}

interface SkillOrderStats extends Stats {
  order: string;
}

interface NthCompletedItemsStatsList {
  items: NthCompletedItemsStats[];
  totalPlayed: number;
}

interface SummonerSpellsStats extends Stats {
  sums: number[];
}

export interface CoreCompletedItemsStats extends Stats {
  items: number[];
}

export interface NthCompletedItemsStats extends Stats {
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
