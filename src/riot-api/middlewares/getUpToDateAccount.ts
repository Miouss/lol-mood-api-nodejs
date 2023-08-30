import { Request, Response, NextFunction } from "express";
import { riot } from "../utils";

export async function getUpToDateAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { summonerName } = req.params;
    const { host } = res.locals;

    const upToDateAccount = await riot(host).getSummonerByName(summonerName);

    delete upToDateAccount.revisionDate;
    delete upToDateAccount.accountId;

    res.locals.upToDateAccount = upToDateAccount;

    next();
  } catch (err) {
    next(err);
  }
}
