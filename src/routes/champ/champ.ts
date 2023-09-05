import { Router } from "express";
import { checkParams } from "../middlewares";
import { getChampGames } from "./middlewares";

const champ = Router();

champ.get("/:champName", checkParams, getChampGames);

export { champ };
