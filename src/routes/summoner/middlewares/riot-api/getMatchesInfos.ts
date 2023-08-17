import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import { MatchesInfosByMatch, MatchesLocals } from "../../../types";

export async function getMatchesInfos(
  _: Request,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { matchesNotStoredByMatch, region } = res.locals;

    if (!matchesNotStoredByMatch) return next();

    let matchesInfosByMatch: MatchesInfosByMatch = {};

    for (const matchId in matchesNotStoredByMatch) {
      matchesInfosByMatch[matchId] = await riot(region).getMatchInfosByMatchId(
        matchId
      );
    }

    res.locals.matchesInfosByMatch = matchesInfosByMatch;

    next();
  } catch (err) {
    next(err);
  }
}
