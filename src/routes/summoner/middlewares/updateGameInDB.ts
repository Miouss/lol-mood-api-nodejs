import { Request, Response, NextFunction } from "express";
import { Game, GameInfo } from "../../../database/models";

export async function updateGameInDB(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    const gameHistory: any[] = [];

    if (!matches) throw new Error("No matches found for this account");
    matches.push("test");

    for (const match of matches) {
      const isGameStored = await Game.exists(match);

      if (!isGameStored) {
        await Game.set(match);
      }
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
