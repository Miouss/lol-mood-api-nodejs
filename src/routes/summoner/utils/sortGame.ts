type GameKey = "rune" | "statsMod" | "startItem" | "completedItem" | "item";

export function sortGame(singleGame: any, isGameHistory = true) {
  if (isGameHistory) {
    const itemsEndGame = filterArray(singleGame, "item");
    singleGame["items"] = itemsEndGame;
  }

  singleGame["runes"] = filterArray(singleGame, "rune");
  singleGame["statsMods"] = filterArray(singleGame, "statsMod");
  singleGame["startItems"] = filterArray(singleGame, "startItem");
  singleGame["completedItems"] = filterArray(singleGame, "completedItem");
}

function filterArray(array: any, filterKey: GameKey) {
  const uncleanedArray = Object.fromEntries(
    Object.entries(array).filter(([key]) => key.startsWith(filterKey))
  );

  const cleanedArray = [];

  for (const key in uncleanedArray) {
    delete array[key];
    if (uncleanedArray[key] != null) {
      cleanedArray.push(uncleanedArray[key]);
    }
  }

  return cleanedArray;
}
