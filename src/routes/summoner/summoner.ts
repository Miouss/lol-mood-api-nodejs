import { Router } from "express";
import { checkParams, convertRegion } from "../middlewares";
import { retrieveAccount, retrieveMatchesData } from "./middlewares";

const summoner = Router();

summoner.get(
  "/:regionCode/:summonerName",
  checkParams,
  convertRegion,
  retrieveAccount,
  retrieveMatchesData
);

export { summoner };
