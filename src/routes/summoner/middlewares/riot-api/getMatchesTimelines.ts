import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import { MatchesLocals } from "../../../types";

export async function getMatchesTimelines(
  _: Request,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { region, participantsInfosByMatch } = res.locals;

    let matchesTimelines = [];

    for (const matchId of Object.keys(participantsInfosByMatch)) {
      const matchTimeline = await riot(region).getMatchTimelineByMatchId(
        matchId
      );

      matchesTimelines.push(matchTimeline);
    }

    res.locals.matchesTimelines = matchesTimelines;
    res.locals.test = matchesTimelines;

    next();
  } catch (err) {
    next(err);
  }
}
