import { Response, NextFunction } from "express";

export function sendMatches(_: any, res: Response, next: NextFunction) {
  try {
    const { participantsInfosByMatch } = res.locals;

    res.status(200).json({participantsInfosByMatch});
  } catch (err) {
    console.error(err);
    next(err);
  }
}
