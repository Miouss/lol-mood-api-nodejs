import { Response, NextFunction } from "express";
import { MatchesLocals } from "../../../types";

export function sendMatches(
  _: any,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { matches, test, assetIdsByMatch } = res.locals;

    res.status(200).json({ test, matches, assetIdsByMatch });
  } catch (err) {
    next(err);
  }
}
