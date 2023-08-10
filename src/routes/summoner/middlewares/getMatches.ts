import { Response, NextFunction } from "express";
import { riot } from "../../utils/requests";

export async function getMatches(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { puuid } = req.params;
    const { region } = res.locals;

    const matches = await riot(region).getMatchListByPuuid(puuid);

    res.locals.matches = matches;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
