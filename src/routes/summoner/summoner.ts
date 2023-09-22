import { Router } from "express";
import { checkParams, convertRegion } from "../middlewares";
import {
  retrieveAccount,
  retrieveMatchesData,
  retrieveTopChamps,
  sendSummonerDetails,
} from "./middlewares";

const summoner = Router();

summoner.get(
  "/:regionCode/:summonerName/games/:count?",
  checkParams,
  convertRegion,
  retrieveAccount,
  retrieveMatchesData,
  retrieveTopChamps,
  sendSummonerDetails
);

export { summoner };
