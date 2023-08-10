import { Router } from "express";

import {
  verifParams,
  convertRegion,
  getUpdatedAccount,
  getUpdatedRank,
  getStoredAccount,
  updateAccountInDB,
  sendResponse,
} from "./middlewares";

const summoner = Router();

summoner.get(
  "/",
  verifParams,
  convertRegion,
  getUpdatedAccount,
  getUpdatedRank,
  getStoredAccount,
  updateAccountInDB,
  sendResponse
);

export { summoner };
