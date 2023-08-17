import { Request, Response, NextFunction } from "express";
import { Game } from "../../../../database/models";
import { MatchesLocals, MatchesNotStoredByMatch } from "../../../types";

export async function updateGame(
  _: Request,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    if (!matches) throw new Error("No matches found for this account");

    let matchesNotStoredByMatch: MatchesNotStoredByMatch = {};

    for (const matchId of matches) {
      const isMatchStored = await Game.exists(matchId);

      if (!isMatchStored) {
        //await Game.set(matchId);
        matchesNotStoredByMatch[matchId] = [];
      }
    }

    res.locals.matchesNotStoredByMatch = matchesNotStoredByMatch;

    next();
  } catch (err) {
    next(err);
  }
}
