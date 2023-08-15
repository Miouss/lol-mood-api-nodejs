import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";

export async function retrieveUpdatedAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { summonerName } = req.params as any;
    const { host } = res.locals;

    const updatedAccount: any = await riot(host).getSummonerByName(
      summonerName
    );

    delete updatedAccount.accountId;
    delete updatedAccount.revisionDate;

    res.locals.updatedAccount = updatedAccount;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
