import { Response, NextFunction } from "express";

export function sendStoredAccount(_: any, res: Response, next: NextFunction) {
  try {
    const { storedAccount } = res.locals;
    
    res.status(200).json(storedAccount);
  } catch (err) {
    console.error(err);
    next(err);
  }
}
