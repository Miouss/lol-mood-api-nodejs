import { insertInto } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Champ {
  private table = "champ";

  public async getId(champ: string) {
    return await getRowId(this.table, { name: champ });
  }

  public async set(champ: string) {
    const query = insertInto(this.table, { name: champ });

    await executeQuery(query, "setChamp");
  }
}
