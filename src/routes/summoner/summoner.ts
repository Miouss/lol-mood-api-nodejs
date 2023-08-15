import { Router } from "express";

import {
  verifParams,
  convertRegion,
  retrieveUpdatedAccount,
  retrieveUpdatedRank,
  getStoredAccount,
  updateAccount,
  returnStoredAccount,
  returnMatches,
  updateGame,
  retrieveMatchInfo,
  retrieveMatches,
  extractMatchesInfos,
  retrieveMatchesStats,
  extractMatchesStats,
} from "./middlewares";

const summoner = Router();

summoner.get(
  "/account/:regionCode/:summonerName",
  verifParams,
  convertRegion,
  retrieveUpdatedAccount,
  retrieveUpdatedRank,
  getStoredAccount,
  updateAccount,
  getStoredAccount,
  returnStoredAccount
);

summoner.get(
  "/matches/:regionCode/:puuid",
  convertRegion,
  retrieveMatches,
  updateGame,
  retrieveMatchInfo,
  extractMatchesInfos,
  retrieveMatchesStats,
  extractMatchesStats,
  returnMatches
);

export { summoner };
