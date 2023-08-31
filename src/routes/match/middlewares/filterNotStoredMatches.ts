import { Request, Response, NextFunction } from "express";
import { Game } from "../../../database/models";

export async function filterNotStoredMatches(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matchesOfAccount } = res.locals as { matchesOfAccount: string[] };

    if (!matchesOfAccount) throw new Error("No matches found for this account");

    let matches: Matches = {
      new: [],
      stored: [],
    };

    for (const matchId of matchesOfAccount) {
      const isMatchStored = await Game.exists(matchId);

      const key = isMatchStored ? "stored" : "new";

      matches[key].push(matchId);
    }

    res.locals.matches = matches;

    next();
  } catch (err) {
    next(err);
  }
}

interface Matches {
  new: string[];
  stored: string[];
}
