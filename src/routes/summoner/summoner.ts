import { Router } from "express";

import {
  verifParams,
  convertRegion,
  getUpdatedAccount,
  getUpdatedRank,
  getStoredAccount,
  updateAccountInDB,
  returnStoredAccount,
  returnMatches,
  updateGameInDB,
  retrieveMatchInfo,
  getMatches,
  collectMatchInfoData,
  collectMatchStats,
} from "./middlewares";

const summoner = Router();

summoner.get(
  "/account/:regionCode/:summonerName",
  verifParams,
  convertRegion,
  getUpdatedAccount,
  getUpdatedRank,
  getStoredAccount,
  updateAccountInDB,
  getStoredAccount,
  returnStoredAccount
);

summoner.get(
  "/matches/:regionCode/:puuid",
  convertRegion,
  getMatches,
  updateGameInDB,
  retrieveMatchInfo,
  collectMatchInfoData,
  collectMatchStats,
  returnMatches
);

export { summoner };
