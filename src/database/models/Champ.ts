import { insertInto } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Champ {
  private static table = "champ";

  public static async getId(champ: string) {
    return await getRowId(this.table, { name: champ });
  }

  public static async set(champ: string) {
    const query = insertInto(this.table).values({ name: champ });

    await executeQuery(query, "setChamp");
  }
}
