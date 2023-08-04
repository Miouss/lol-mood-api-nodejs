import express from "express";
import {
  Account,
  Positioning,
  Champ,
  Game,
  Asset,
  GameInfo,
} from "./database/models";

const app = express();
const PORT = 3000;

app.get("/summoner", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log("Server is running on port 3000\n");

  await testAccount();
  await testPositioning();
  await testChamp();
  await testGame();
  await testAsset();
  await testGameInfo();
});

async function testGameInfo() {
  const gameInfo = new GameInfo();

  const data = {
    game_id: 1,
    account_id: 1,
    champ_id: 1,
    positioning_id: 1,
  
    win: true,
    kills: 5,
    deaths: null,
    assists: 10,
    multikills: null,
    skills_order: 'QWER',
    evolves_order: null,
  
    primary_style_id: 1,
    sub_style_id: 1,
    perk_id: 1,
  
    rune0_id: 1,
    rune1_id: 1,
    rune2_id: 1,
    rune3_id: 1,
    rune4_id: 1,
  
    stats_mod0_id: 1,
    stats_mod1_id: 1,
    stats_mod2_id: 1,
  
    summoner1_id: 1,
    summoner2_id: 1,
  
    item0_id: null,
    item1_id: 1,
    item2_id: null,
    item3_id: 1,
    item4_id: 1,
    item5_id: null,
  
    start_item0_id: 1,
    start_item1_id: null,
    start_item2_id: 1,
    start_item3_id: null,
    start_item4_id: 1,
    start_item5_id: 1,
    start_item6_id: null,
  
    completed_item0_id: 1,
    completed_item1_id: 1,
    completed_item2_id: null,
    completed_item3_id: 1,
    completed_item4_id: null,
    completed_item5_id: 1,
  };

  await gameInfo.set(data);
}

async function testGame() {
  const game = new Game();

  await game.set("testGame", "11.1", "30");
  await game.getId("testGame");
  await game.exists("testGame");
}

async function testAsset() {
  const asset = new Asset();

  await asset.set("12");
  await asset.getId("203");
}

async function testChamp() {
  const champ = new Champ();

  await champ.set("testChamp");

  await champ.getId("testChamp");
}

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
