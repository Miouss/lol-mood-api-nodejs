import { Request, Response, NextFunction } from "express";
import { riot } from "../utils";

export async function getMatchTimeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { region } = res.locals;
    const { matchId } = req.params;

    res.locals.matchTimeline = await riot(region).getMatchTimelineByMatchId(
      matchId
    );

    next();
  } catch (err) {
    next(err);
  }
}
