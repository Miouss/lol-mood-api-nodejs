import { ItemDetails, ParticipantStatsType } from ".";
import { ParticipantInfosFiltered } from "../types";
import { arrayToKeyedObj } from "../../utils";

export async function mergeInfosAndStats(
  participantsInfos: ParticipantInfosFiltered[],
  participantsStats: ParticipantStatsType[]
) {
  let participantsMatchData: any = {};

  participantsStats.forEach((participantStats) => {
    const startItems = filterItems(participantStats.items, "starting");

    const completedItems = filterItems(participantStats.items, "completed");

    const participantInfosKey = participantsInfos.findIndex(
      (participantInfo) => participantInfo.puuid === participantStats.puuid
    );

    const startItemsIds = arrayToKeyedObj(startItems, "startItemId");
    const completedItemsIds = arrayToKeyedObj(
      completedItems,
      "completedItemId"
    );

    const participantInfo = participantsInfos[participantInfosKey];

    delete participantInfo.puuid;

    const participantMatchData = {
      ...participantInfo,
      ...startItemsIds,
      ...completedItemsIds,
      evolvesOrder: participantStats.evolvesOrder,
      skillsOrder: participantStats.skillsOrder,
    };

    participantsMatchData[participantInfosKey] = participantMatchData;
  });

  return participantsMatchData;
}

function filterItems(items: ItemDetails[], typeFiltered: string) {
  return items
    .filter((item) => item.type === typeFiltered)
    .map((item) => item.itemId);
}
