import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";

export async function retrieveMatchesInfos(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matchesNotStored, region } = res.locals;

    if (!matchesNotStored) return next();

    let matchesInfos: any = {};

    for (const matchId in matchesNotStored) {
      const gameInfo = await riot(region).getMatchInfoByMatchId(matchId);

      matchesInfos[matchId] = gameInfo;
    }
    
    res.locals.matchesInfos = matchesInfos;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
