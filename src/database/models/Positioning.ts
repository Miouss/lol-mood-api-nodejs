import { insertInto } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Positioning {
  private table = "positioning";

  public async getId(position: string) {
    return await getRowId(this.table, { lane: position });
  }

  public async set(position: string) {
    const query = insertInto(this.table, { lane: position });

    await executeQuery(query, "setPositioning");
  }
}
