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
} from "./middlewares";
import { getMatches } from "./middlewares/getMatches";

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

summoner.get("/matches/:regionCode/:puuid", convertRegion, getMatches, returnMatches);

export { summoner };
