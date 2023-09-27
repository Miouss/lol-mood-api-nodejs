import itemJSON from "../../../assets/item.json" assert { type: "json" };
import {
  MatchTimeline,
  MatchTimelineInfoFrameEvent,
} from "../../../riot-api/types";

export async function extractParticipantsStats(matchTimeline: MatchTimeline) {
  const participantsStats = createParticipantsStats(
    matchTimeline.info.participants!
  );

  for (const frame of matchTimeline.info.frames) {
    for (const event of frame.events) {
      if (!isEventTypeHandled(event.type)) continue;

      const { type, participantId } = event;

      const id = participantId! - 1;

      participant(participantsStats[id]).event(event)[type as EventType]();
    }
  }

  return participantsStats;
}

function participant(participantStats: ParticipantStatsType) {
  const handleItemPurchased = (event: MatchTimelineInfoFrameEvent) => {
    const { itemId, timestamp } = event as {
      itemId: number;
      timestamp: number;
    };

    const { total, purchasable } = (itemJSON as any).data[itemId].gold;

    const isItem = purchasable && total > 0;

    if (!isItem) return;

    const { description, into } = (itemJSON as any).data[itemId];

    const isNearBeginningOfGame = timestamp < 60000;

    const isMythicItem = description.includes("Mythic Passive");
    const isLegendaryItem = !isMythicItem && !into && total > 1000;

    const isStartingItem = total <= 500 && isNearBeginningOfGame;
    const isCompletedItem = isMythicItem || isLegendaryItem;

    if (!isStartingItem && !isCompletedItem) return;

    participantStats.items.push({
      itemId,
      type: isStartingItem ? "starting" : "completed",
    });
  };

  const handleSkillLevelUp = (event: MatchTimelineInfoFrameEvent) => {
    const { skillSlot, levelUpType } = event;

    const handleLevelUpType: Record<SubEventType, Function> = {
      [SubEventType.NormalLevelUp]: () =>
        (participantStats.skillsOrder += skillSlot),
      [SubEventType.EvolveLevelUp]: () =>
        (participantStats.evolvesOrder += skillSlot),
    };

    handleLevelUpType[levelUpType as SubEventType]();
  };

  const handleItemUndo = () => {
    participantStats.items.pop();
  };

  return {
    event: (event: MatchTimelineInfoFrameEvent) => ({
      [EventType.ItemPurchased]: () => handleItemPurchased(event),
      [EventType.SkillLevelUp]: () => handleSkillLevelUp(event),
      [EventType.ItemUndo]: handleItemUndo,
    }),
  };
}

export function createParticipantsStats(
  participants: ParticipantsWithPuuidAndIdType[]
): ParticipantStatsType[] {
  return Array(10)
    .fill([])
    .map(
      (_, i): ParticipantStatsType => ({
        items: [],
        skillsOrder: "",
        evolvesOrder: "",
        puuid: participants[i].puuid,
      })
    );
}

export function isEventTypeHandled(type: MatchTimelineInfoFrameEvent["type"]) {
  return Object.values(EventType).includes(type as EventType);
}

interface ParticipantsWithPuuidAndIdType {
  puuid: string;
  participantId: number;
}

export interface ItemDetails {
  itemId: number;
  type: "starting" | "completed";
}

export interface ParticipantStatsType {
  items: ItemDetails[];
  skillsOrder: string;
  evolvesOrder: string;
  puuid: string;
}

export enum EventType {
  ItemPurchased = "ITEM_PURCHASED",
  SkillLevelUp = "SKILL_LEVEL_UP",
  ItemUndo = "ITEM_UNDO",
}

enum SubEventType {
  NormalLevelUp = "NORMAL",
  EvolveLevelUp = "EVOLVE",
}
