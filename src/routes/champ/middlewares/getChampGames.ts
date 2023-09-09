import { Request, Response, NextFunction } from "express";
import { GameInfo } from "../../../database/models";

export async function getChampGames(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { champName } = req.params;

    const games = await GameInfo.getByChamp(champName);

    res.locals.games = games;

    next();
  } catch (err) {
    next(err);
  }
}
