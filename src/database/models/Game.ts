import { Query } from "../helpers";
import { executeQuery, getRowId, isStored } from "../utils";

export class Game {
  private static table = "game";

  public static async getId(gameId: string) {
    return await getRowId(this.table, { identifier: gameId });
  }

  public static async create(gameId: string) {
    const query = new Query().insertInto(this.table).values({
      identifier: gameId,
    });

    await executeQuery(query, "setGame");
  }

  public static async exists(gameId: string) {
    return await isStored(this.table, { identifier: gameId });
  }
}
