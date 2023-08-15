import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";

export async function retrieveMatchInfo(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matchesNotStored, region } = res.locals;

    if (!matchesNotStored) return next();

    let matches: any = {};

    for (const matchId in matchesNotStored) {
      const gameInfo = await riot(region).getMatchInfoByMatchId(matchId);

      matches[matchId] = gameInfo;
    }
    
    res.locals.matches = matches;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
