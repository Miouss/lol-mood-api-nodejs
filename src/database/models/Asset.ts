import { insertInto } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Asset {
  private static table = "asset";

  public static async getId(assetId: string) {
    return await getRowId(this.table, { identifier: assetId });
  }

  public static async set(assetId: string) {
    const query = insertInto(this.table, { identifier: assetId });

    await executeQuery(query, "setAsset");
  }
}
