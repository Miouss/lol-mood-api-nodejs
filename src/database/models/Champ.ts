import { Query } from "../helpers";
import { executeQuery, getRowId, isStored } from "../utils";

export class Champ {
  private static table = "champ";

  public static async getId(champ: string) {
    return await getRowId(this.table, { name: champ });
  }

  public static async create(champ: string) {
    const query = new Query().insertInto(this.table).values({ name: champ });

    await executeQuery(query, "setChamp");
  }

  public static async exists(champ: string) {
    return await isStored(this.table, { name: champ });
  }
}
