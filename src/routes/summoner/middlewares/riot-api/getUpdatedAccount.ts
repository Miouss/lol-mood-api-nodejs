import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import { AccountLocals } from "../../../types";

export async function getUpdatedAccount(
  req: Request,
  res: Response<any, AccountLocals>,
  next: NextFunction
) {
  try {
    const { summonerName } = req.params;
    const { host } = res.locals;

    const updatedAccount = await riot(host).getSummonerByName(summonerName);

    delete updatedAccount.revisionDate;
    delete updatedAccount.accountId;

    res.locals.updatedAccount = updatedAccount;

    next();
  } catch (err) {
    next(err);
  }
}
