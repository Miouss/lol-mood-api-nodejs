import { Request, Response, NextFunction } from "express";
import { Game, GameInfo } from "../../../database/models";

export async function updateGameInDB(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    if (!matches) throw new Error("No matches found for this account");

    let matchesNotStored: any = [];

    for (const matchId of matches) {
      const isMatchStored = await Game.exists(matchId);

      if (!isMatchStored) {
        //await Game.set(matchId);
        matchesNotStored[matchId] = [];
      }
    }

    res.locals.matchesNotStored = matchesNotStored;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
