import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";

export async function retrieveMatchesStats(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { region, participantsInfosByMatch } = res.locals;

    let matchesStats = [];

    for (const matchId of Object.keys(participantsInfosByMatch)) {
      const matchStats: any = await riot(region).getMatchStatsByMatchId(
        matchId
      );

      matchesStats.push(matchStats);
    }

    res.locals.matchesStats = matchesStats;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
