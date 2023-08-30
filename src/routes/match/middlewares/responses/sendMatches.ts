import { Response, NextFunction } from "express";

export function sendMatches(
  _: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    res.status(200).json(matches);
  } catch (err) {
    next(err);
  }
}
