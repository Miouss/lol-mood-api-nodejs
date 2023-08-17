import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import { MatchesLocals } from "../../../types";

export async function getMatches(
  req: Request,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { puuid } = req.params;
    const { region } = res.locals;

    res.locals.matches = await riot(region).getMatchListByPuuid(puuid);

    next();
  } catch (err) {
    next(err);
  }
}
