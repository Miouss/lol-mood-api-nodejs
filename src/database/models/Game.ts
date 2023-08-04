import { insertInto } from "../helpers";
import { executeQuery, getRowId, isStored } from "../utils";

export class Game {
  private table = "game";

  public async getId(gameId: string) {
    return await getRowId(this.table, { identifier: gameId });
  }

  public async set(gameId: string, patch: string, duration: string) {
    const values = {
      identifier: gameId,
      patch,
      duration,
    };

    const query = insertInto(this.table, values);

    await executeQuery(query, "setGame");
  }

  public async exists(gameId: string) {
    return await isStored(this.table, { identifier: gameId });
  }
}
