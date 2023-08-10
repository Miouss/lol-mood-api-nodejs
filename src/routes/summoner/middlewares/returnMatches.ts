import { Response, NextFunction } from "express";

export function returnMatches(_: any, res: Response, next: NextFunction) {
  try {
    const { matches } = res.locals;

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    next(err);
  }
}
