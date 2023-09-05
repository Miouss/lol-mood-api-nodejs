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
    if (!games) throw new Error("No games found for this champion");

    const completedItemsStats = getCompleteditemsList(games);

    const startItemsStats = getStartItemsStats(games);

    res.json({ startItemsStats, completedItemsStats });
  } catch (err) {
    next(err);
  }
}

function getStartItemsStats(games: ParticipantMatchDataResponse[]) {
  const startItemsStats: StartItemsStats[] = [];
  const totalPlayed = games.length;

  games.forEach((game) => {
    const index = startItemsStats.findIndex((startItems) =>
      startItems.items.every((item, i) => item === game.startItems[i])
    );

    const startItems: StartItemsStats =
      startItemsStats[index] ??
      ({
        items: game.startItems,
        played: 0,
        wins: 0,
      } as StartItemsStats);

    startItems.played++;
    startItems.wins += Number(game.win);

    const hasFoundIndex = index >= 0;

    if (hasFoundIndex) startItemsStats[index] = startItems;
    else startItemsStats.push(startItems);
  });

  startItemsStats.forEach((startItems) => {
    startItems.playrate = twoDecimalsNumByPercent(
      startItems.played / totalPlayed
    );
    startItems.winrate = twoDecimalsNumByPercent(
      startItems.wins / startItems.played
    );
  });

  return startItemsStats;
}

function getCompleteditemsList(games: ParticipantMatchDataResponse[]) {
  const completedItemsStatsList: CompletedItemsStatsList[] = [
    { totalPlayed: 0 },
    { totalPlayed: 0 },
    { totalPlayed: 0 },
    { totalPlayed: 0 },
    { totalPlayed: 0 },
  ];

  games.forEach((game) => {
    game.completedItems.every((itemId, i) => {
      console.log(itemId, i);
      if (!itemId) return false;

      const itemStats: CompletedItemsStats =
        completedItemsStatsList[i][itemId] ??
        ({
          itemId,
          played: 0,
          wins: 0,
          playrate: 0,
          winrate: 0,
        } as CompletedItemsStats);

      itemStats.played++;
      itemStats.wins += Number(game.win);
      itemStats.winrate = twoDecimalsNumByPercent(
        itemStats.wins / itemStats.played
      );

      completedItemsStatsList[i].totalPlayed++;

      completedItemsStatsList[i][itemId] = itemStats;

      return true;
    });
  });

  completedItemsStatsList.forEach((completedItemsStats) => {
    Object.values(completedItemsStats).forEach(
      (itemStats: CompletedItemsStats | number) => {
        const isTotalPlayedProp = typeof itemStats === "number";

        if (isTotalPlayedProp) return;

        itemStats.playrate = twoDecimalsNumByPercent(
          itemStats.played / completedItemsStats.totalPlayed
        );
      }
    );
  });

  return completedItemsStatsList;
}

interface CompletedItemsStatsList {
  [key: number]: CompletedItemsStats;
  totalPlayed: number;
}

interface CompletedItemsStats {
  itemId: number;
  played: number;
  wins: number;
  playrate: number;
  winrate: number;
}

interface StartItemsStats {
  items: number[];
  played: number;
  wins: number;
  winrate: number;
  playrate: number;
}
