import { Router } from "express";
import { checkParams } from "../middlewares";
import { getChampGames, getStats, sendStats } from "./middlewares";

const champ = Router();

champ.get("/:champName", checkParams, getChampGames, getStats, sendStats);

export { champ };
