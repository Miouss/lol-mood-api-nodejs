import express from "express";

const app = express();
const PORT = 3000;

app.get("/summoner", (_, res) => {
  res.send("Hello World!");
});

import { connectToDatabase } from "./config";

app.listen(PORT, async () => {
  console.log("Server is running on port 3000");
  connectToDatabase();
});

/* function sortData(singleGame: any, isGameHistory = true) {
  if (isGameHistory) {
    const itemsEndGame = filterArray(singleGame, "item");
    singleGame["items"] = itemsEndGame;
  }

  singleGame["runes"] = filterArray(singleGame, "rune");
  singleGame["statsMods"] = filterArray(singleGame, "statsMod");
  singleGame["startItems"] = filterArray(singleGame, "startItem");
  singleGame["completedItems"] = filterArray(singleGame, "completedItem");
}

type DataKey = "rune" | "statsMod" | "startItem" | "completedItem" | "item";

function filterArray(array: any, filterKey: DataKey) {
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
} */
