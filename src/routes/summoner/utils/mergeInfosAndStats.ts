import { ItemDetails, ParticipantStatsType } from ".";
import { ParticipantInfosFiltered } from "../types";
import { arrayToKeyedObj } from "../../utils";
import { GameInfo, ParticipantMatchData } from "../../../database/models";

export async function mergeInfosAndStats(
  participantsInfos: ParticipantInfosFiltered[],
  participantsStats: ParticipantStatsType[]
) {
  for (const participantStats of participantsStats) {
    const startItems = filterItems(participantStats.items, "starting");

    const completedItems = filterItems(participantStats.items, "completed");

    const participantInfosKey = participantsInfos.findIndex(
      (participantInfo) => participantInfo.puuid === participantStats.puuid
    );

    const startItemsIds = arrayToKeyedObj(
      startItems,
      "startItemId"
    ) as StartItemsIds;
    const completedItemsIds = arrayToKeyedObj(
      completedItems,
      "completedItemId"
    ) as CompletedItemsIds;

    const participantInfo = participantsInfos[participantInfosKey];

    delete participantInfo.puuid;

    const participantMatchData: ParticipantMatchData = {
      ...participantInfo,
      ...startItemsIds,
      ...completedItemsIds,
      evolvesOrder: participantStats.evolvesOrder,
      skillsOrder: participantStats.skillsOrder,
    };

    await GameInfo.create(participantMatchData);
  }
}

function filterItems(items: ItemDetails[], typeFiltered: string) {
  return items
    .filter((item) => item.type === typeFiltered)
    .map((item) => item.itemId);
}

interface StartItemsIds {
  startItemId0?: number;
  startItemId1?: number;
  startItemId2?: number;
  startItemId3?: number;
  startItemId4?: number;
  startItemId5?: number;
}

interface CompletedItemsIds {
  completedItemId0?: number;
  completedItemId1?: number;
  completedItemId2?: number;
  completedItemId3?: number;
  completedItemId4?: number;
  completedItemId5?: number;
}
