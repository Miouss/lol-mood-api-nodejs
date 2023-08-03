import { RowDataPacket } from "mysql2/promise";
import { insertInto, selectFromWhere, updateSetWhere } from "../helpers";
import { executeQuery, getRowId } from "../utils";

export class Account {
  private table = "account";

  async create(data: AccountType) {
    const query = insertInto(
      this.table,
      data as unknown as Record<string, string | number>
    );

    await executeQuery(query, "create account");
  }

  async updateRank(data: RankType, puuid: string) {
    const query = updateSetWhere(
      this.table,
      data as unknown as Record<string, string | number>,
      { puuid }
    );

    await executeQuery(query, "setRank");
  }

  async getId(puuid: string) {
    return await getRowId(this.table, { puuid });
  }

  async exists(puuid: string) {
    const cols = ["puuid"];

    const query = selectFromWhere(this.table, cols, { puuid });

    const rows = await executeQuery(query, "isStored");

    if (rows) {
      console.log("Account found");
      return true;
    }

    console.log("Account not found");

    return false;
  }

  async update(data: AccountType) {
    const setData = {
      name: data.name,
      level: data.level,
      profile_icon_id: data.profile_icon_id,
    };

    const query = updateSetWhere(this.table, setData, { puuid: data.puuid });

    await executeQuery(query, "updateAccount");
  }
}

interface AccountType {
  puuid: string;
  name: string;
  level: number;
  profile_icon_id: number;
}

interface RankType {
  "`rank`": string;
  tier: string;
  lp: number;
  games: number;
  wins: number;
}
