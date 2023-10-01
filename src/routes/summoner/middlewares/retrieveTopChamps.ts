import { Request, Response, NextFunction } from "express";
import { ChampStats, Locals } from "../types";
import { twoDecimalsNum } from "../../utils";

export async function retrieveTopChamps(
  req: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { matchesData } = res.locals;

    const topChamps: TopChamps = {};

    matchesData.forEach(({ champName, win, kills, deaths, assists }) => {
      const getAvgOf = (stat: number) =>
        twoDecimalsNum(stat / champStats.played);

      const champStats = topChamps[champName] || {
        wins: 0,
        played: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        killsAvg: 0,
        deathsAvg: 0,
        assistsAvg: 0,
      };

      champStats.wins += win ? 1 : 0;
      champStats.played += 1;
      champStats.winrate = twoDecimalsNum(
        (champStats.wins / champStats.played) * 100
      );
      champStats.kills += kills;
      champStats.deaths += deaths;
      champStats.assists += assists;
      champStats.killsAvg = getAvgOf(champStats.kills);
      champStats.deathsAvg = getAvgOf(champStats.deaths);
      champStats.assistsAvg = getAvgOf(champStats.assists);

      topChamps[champName] = champStats;
    });

    const topChampsByMostPlayed = sortChampsByMostPlayed(topChamps);

    res.locals.topChampsByMostPlayed = topChampsByMostPlayed;

    next();
  } catch (err) {
    next(err);
  }
}

function sortChampsByMostPlayed(topChamps: TopChamps) {
  return Object.entries(topChamps).sort(([, a], [, b]) => {
    const hasPlayedMore = a.played > b.played;
    const hasPlayedEqually = a.played === b.played;
    const hasBetterWinrate = a.winrate > b.winrate;

    if (hasPlayedMore) return -1;
    if (hasPlayedEqually && hasBetterWinrate) return -1;

    return 1;
  });
}

interface TopChamps {
  [champName: string]: ChampStats;
}
