import itemJSON from "../../../assets/item.json" assert { type: "json" };

export function participant(participantStats: ParticipantStatsType) {
  const handleItemPurchased = (event: any) => {
    const { total, purchasable } = (itemJSON as any).data[event.itemId].gold;

    const isItem = purchasable && total > 0;

    if (!isItem) return;

    const { name, description, into } = (itemJSON as any).data[event.itemId];

    const isNearBeginningOfGame = event.timestamp < 60000;

    const isMythicItem = description.includes("Mythic Passive");
    const isLegendaryItem = !isMythicItem && !into && total > 1000;

    const isStartingItem = total <= 500 && isNearBeginningOfGame;
    const isCompletedItem = isMythicItem || isLegendaryItem;
    
    if(!isStartingItem && !isCompletedItem) return;

    participantStats.items.push({
      name,
      itemId: event.itemId,
      type: isStartingItem ? "starting" : "completed",
    });
  };

  const handleSkillLevelUp = (event: any) => {
    const { skillSlot, levelUpType } = event;

    const levelUpTypeLookup: Record<SubEventType, Function> = {
      [SubEventType.NormalLevelUp]: () =>
        (participantStats.skillsOrder += skillSlot),
      [SubEventType.EvolveLevelUp]: () =>
        (participantStats.evolvesOrder += skillSlot),
    };

    levelUpTypeLookup[levelUpType as SubEventType]();
  };

  const handleItemUndo = () => {
    participantStats.items.pop();
  };

  return {
    event: (event: any) => ({
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
      (_, index): ParticipantStatsType => ({
        items: [],
        skillsOrder: "",
        evolvesOrder: "",
        puuid: participants[index].puuid,
      })
    );
}

export function isEventTypeHandled(type: any) {
  return Object.values(EventType).includes(type);
}

interface ParticipantsWithPuuidAndIdType {
  puuid: string;
  participantId: number;
}

interface ItemDetails {
  name: string;
  itemId: number;
  type: "starting" | "completed";
}

interface ParticipantStatsType {
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