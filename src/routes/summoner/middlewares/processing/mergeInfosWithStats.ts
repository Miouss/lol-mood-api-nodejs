import { Response, NextFunction } from "express";
import {
  ParticipantStatsType,
  ItemDetails,
  arrayToKeyedObject,
} from "../../utils";

export async function mergeInfosWithStats(
  _: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { participantsInfosByMatch, participantsStatsByMatch } = res.locals;

    for (const matchId in participantsStatsByMatch) {
      participantsStatsByMatch[matchId].forEach(
        (participantStats: ParticipantStatsType) => {
          const startItems = filterItems(participantStats.items, "starting");

          const completedItems = filterItems(
            participantStats.items,
            "completed"
          );

          const participantInfosKey = participantsInfosByMatch[
            matchId
          ].findIndex(
            (participantInfo: any) =>
              participantInfo.puuid === participantStats.puuid
          );

          const startItemsIds = arrayToKeyedObject(startItems, "startItemId");
          const completedItemsIds = arrayToKeyedObject(
            completedItems,
            "completedItemId"
          );

          const participantInfo =
            participantsInfosByMatch[matchId][participantInfosKey];

          participantsInfosByMatch[matchId][participantInfosKey] = {
            ...participantInfo,
            ...startItemsIds,
            ...completedItemsIds,
          };
        }
      );
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

function filterItems(items: ItemDetails[], type: string) {
  return items
    .filter((item: ItemDetails) => item.type === type)
    .map((item: ItemDetails) => item.itemId);
}
