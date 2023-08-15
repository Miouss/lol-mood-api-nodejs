import { Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";

export async function retrieveUpdatedRank(
  _: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { host } = res.locals;
    const { id } = res.locals.updatedAccount;

    const updatedRank: any = await riot(host).getSummonerRankById(id);

    const rankedSolo = updatedRank.find(
      (element: any) => element["queueType"] === "RANKED_SOLO_5x5"
    );

    const { tier, rank, leaguePoints, wins, losses } = rankedSolo;

    const sortedRank = {
      rank: tier,
      tier: rank,
      lp: leaguePoints,
      games: wins + losses,
      wins,
    };

    res.locals.updatedAccount = {
      ...res.locals.updatedAccount,
      ...sortedRank,
    };

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
