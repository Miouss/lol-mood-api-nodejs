import express from "express";
import { Account, Positioning } from "./database/models";

const app = express();
const PORT = 3000;

app.get("/summoner", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log("Server is running on port 3000\n");

  // await testAccount();
  // await testPositioning();
});

async function testPositioning() {
  const positioning = new Positioning();

  await positioning.set("mid");

  await positioning.getId("top");
}

async function testAccount() {
  const account = new Account();

  const dataCreate = {
    name: "testName",
    puuid: "testPuuid",
    level: 1,
    profile_icon_id: 100,
  };

  await account.create(dataCreate);

  await account.getId("testPuuid");

  await account.exists("testPuuid");

  const dataUpdate = {
    name: "testName2",
    puuid: "testPuuid",
    level: 33,
    profile_icon_id: 220,
  };

  await account.update(dataUpdate);

  const dataRank = {
    "`rank`": "testRank",
    tier: "dia",
    lp: 192,
    games: 293,
    wins: 53,
  };

  await account.updateRank(dataRank, dataUpdate.puuid);
}

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
