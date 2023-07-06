import express from "express";
import { config } from "dotenv";
config();

const app = express();
const { PORT } = process.env;

app.get("/summoner", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});


function sortData(singleGame: any, isGameHistory = true) {
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
}
