import { Router } from "express";
import {
  getMatchInfos,
  getMatchTimeline,
  getMatches,
} from "../../riot-api/middlewares";

import {
  extractMatchInfos,
  extractMatchStats,
  sendMatchInfos,
  sendMatches,
  mergeInfosWithStats,
  filterNotStoredMatches,
} from "./middlewares";

import { convertRegion } from "../middlewares";

const match = Router();

match.get("/list/:regionCode/:puuid", convertRegion, getMatches, filterNotStoredMatches, sendMatches);

match.get(
  "/data/:regionCode/:matchId",
  convertRegion,
  getMatchInfos,
  extractMatchInfos,
  getMatchTimeline,
  extractMatchStats,
  mergeInfosWithStats,
  sendMatchInfos
);

export { match };
