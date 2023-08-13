import { Response, NextFunction } from "express";

export function returnMatches(_: any, res: Response, next: NextFunction) {
  try {
    const { matchesInfosSortedByMatch, participantsStatsByMatch } = res.locals;

    res.status(200).json({participantsStatsByMatch, matchesInfosSortedByMatch});
  } catch (err) {
    console.error(err);
    next(err);
  }
}
