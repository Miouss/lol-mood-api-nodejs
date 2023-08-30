import { Router } from "express";

import {
  getStoredAccount,
  updateAccount,
  sendStoredAccount,
  errorHandler,
} from "./middlewares";

import {
  getUpToDateAccount,
  getUpToDateRank,
} from "../../riot-api/middlewares";

import { convertRegion, checkParams } from "../middlewares";

const summoner = Router();

summoner.get(
  "/account/:regionCode/:summonerName",
  checkParams,
  convertRegion,
  getUpToDateAccount,
  getUpToDateRank,
  getStoredAccount,
  updateAccount,
  getStoredAccount,
  sendStoredAccount,
  errorHandler
);

export { summoner };
