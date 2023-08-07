import { Response, NextFunction } from "express";

export function sendResponse(req: any, res: Response, next: NextFunction) {
  try {
    const { updatedAccount, updatedRank } = res.locals;
    const response = {
      ...updatedAccount,
      ...updatedRank,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
}
