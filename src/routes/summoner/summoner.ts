import { Router } from "express";

import {
  checkParams,
  convertRegion,
  mergeInfosWithStats,
  extractMatchesInfos,
  extractMatchesTimelines,
  getUpdatedAccount,
  getUpdatedRank,
  getMatchesInfos,
  getMatches,
  getMatchesTimelines,
  getStoredAccount,
  updateAccount,
  updateGame,
  sendStoredAccount,
  sendMatches,
  errorHandler,
} from "./middlewares";

const summoner = Router();

summoner.get(
  "/account/:regionCode/:summonerName",
  checkParams,
  convertRegion,
  getUpdatedAccount,
  getUpdatedRank,
  getStoredAccount,
  updateAccount,
  getStoredAccount,
  sendStoredAccount,
  errorHandler
);

summoner.get(
  "/matches/:regionCode/:puuid",
  checkParams,
  convertRegion,
  getMatches,
  updateGame,
  getMatchesInfos,
  extractMatchesInfos,
  getMatchesTimelines,
  extractMatchesTimelines,
  mergeInfosWithStats,
  sendMatches,
  errorHandler
);

export { summoner };
