import { insertInto } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Positioning {
  private table = "positioning";

  async getId(position: string) {
    return await getRowId(this.table, { lane: position });
  }

  async set(position: string) {
    const query = insertInto(this.table, { lane: position });

    await executeQuery(query, "setPositioning");
  }
}
