import { Response, NextFunction } from "express";

export function sendResponse(_: any, res: Response, next: NextFunction) {
  try {
    const { updatedAccount, updatedRank, storedAccount } = res.locals;
    const response = {
      ...updatedAccount,
      ...updatedRank,
      storedAccount,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
}
