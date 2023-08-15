import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import {
  createParticipantsStats,
  isEventTypeHandled,
  participant,
  EventType,
} from "../../utils";

export async function retrieveMatchesStats(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { region, matchesInfosSortedByMatch } = res.locals;

    let matchesStats = [];

    for (const matchId of Object.keys(matchesInfosSortedByMatch)) {
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
