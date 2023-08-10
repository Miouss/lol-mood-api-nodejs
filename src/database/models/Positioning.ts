import { insertInto } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Positioning {
  private static table = "positioning";

  public static async getId(position: string) {
    return await getRowId(this.table, { lane: position });
  }

  public static async set(position: string) {
    const query = insertInto(this.table).values({ lane: position });

    await executeQuery(query, "setPositioning");
  }
}
