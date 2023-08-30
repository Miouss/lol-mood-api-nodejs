import { Request, Response, NextFunction } from "express";
import { riot } from "../utils";

export async function getMatchInfos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { region } = res.locals;
    const { matchId } = req.params;

    res.locals.matchInfos = await riot(region).getMatchInfosByMatchId(matchId);

    next();
  } catch (err) {
    next(err);
  }
}
