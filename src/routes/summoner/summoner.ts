import { Router } from "express";

import {
  checkParams,
  convertRegion,
  mergeInfosWithStats,
  extractMatchesInfos,
  extractMatchesStats,
  retrieveUpdatedAccount,
  retrieveUpdatedRank,
  retrieveMatchesInfos,
  retrieveMatches,
  getStoredAccount,
  updateAccount,
  updateGame,
  sendStoredAccount,
  sendMatches,
  retrieveMatchesStats,
} from "./middlewares";

const summoner = Router();

summoner.get(
  "/account/:regionCode/:summonerName",
  checkParams,
  convertRegion,
  retrieveUpdatedAccount,
  retrieveUpdatedRank,
  getStoredAccount,
  updateAccount,
  getStoredAccount,
  sendStoredAccount
);

summoner.get(
  "/matches/:regionCode/:puuid",
  checkParams,
  convertRegion,
  retrieveMatches,
  updateGame,
  retrieveMatchesInfos,
  extractMatchesInfos,
  retrieveMatchesStats,
  extractMatchesStats,
  mergeInfosWithStats,
  sendMatches
);

export { summoner };
