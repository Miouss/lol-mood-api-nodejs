import { Response, NextFunction } from "express";
import { ItemDetails, ParticipantStatsType } from "../utils";
import { arrayToKeyedObj } from "../../utils";
import { Locals } from "../types";


export async function mergeInfosWithStats(
  _: any,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { participantsInfos, participantsStats } = res.locals;
    
    let participantsInfosMergedWithStats: any = {};

    participantsStats.forEach((participantStats: ParticipantStatsType) => {
      const startItems = filterItems(participantStats.items, "starting");

      const completedItems = filterItems(participantStats.items, "completed");

      const participantInfosKey = participantsInfos.findIndex(
        (participantInfo) =>
          participantInfo.puuid === participantStats.puuid
      );

      const startItemsIds = arrayToKeyedObj(startItems, "startItemId");
      const completedItemsIds = arrayToKeyedObj(
        completedItems,
        "completedItemId"
      );

      const participantInfo =
        participantsInfos[participantInfosKey];

      participantInfo.assets = {
        ...participantInfo.assets,
        ...startItemsIds,
        ...completedItemsIds,
      };

      const participantInfosMergedWithStats = {
        ...participantInfo,
        evolvesOrder: participantStats.evolvesOrder,
        skillsOrder: participantStats.skillsOrder,
      };

      participantsInfosMergedWithStats[participantInfosKey] =
        participantInfosMergedWithStats;
    });

    res.locals.participantsInfosMergedWithStats =
    participantsInfosMergedWithStats;

    next();
  } catch (err) {
    next(err);
  }
}

function filterItems(items: ItemDetails[], typeFiltered: string) {
  return items
    .filter((item) => item.type === typeFiltered)
    .map((item) => item.itemId);
}
