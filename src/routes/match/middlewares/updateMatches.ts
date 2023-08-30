import { Request, Response, NextFunction } from "express";
import { Game } from "../../../database/models";

export async function updateGame(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    if (!matches) throw new Error("No matches found for this account");

    let matchesNotStored = [];

    for (const matchId of matches) {
      const isMatchStored = await Game.exists(matchId);

      if (!isMatchStored) {
        //await Game.set(matchId);
        matchesNotStored.push(matchId);
      }
    }

    res.locals.matchesNotStored = matchesNotStored;

    next();
  } catch (err) {
    next(err);
  }
}
