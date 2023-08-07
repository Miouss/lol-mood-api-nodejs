import { Router } from "express";

import { convertRegion, getUpdatedAccount, getUpdatedRank, sendResponse } from "./middlewares";

const summoner = Router();

summoner.get("/", convertRegion, getUpdatedAccount, getUpdatedRank, sendResponse);

export { summoner };
