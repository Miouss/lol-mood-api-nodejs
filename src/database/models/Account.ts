import { insertInto, updateSetWhere } from "../helpers";
import { executeQuery, getRowId, isStored } from "../utils";

export class Account {
  private table = "account";

  public async create(data: AccountType) {
    const query = insertInto(
      this.table,
      data as unknown as Record<string, string | number>
    );

    await executeQuery(query, "create account");
  }

  public async updateRank(data: RankType, puuid: string) {
    const query = updateSetWhere(
      this.table,
      data as unknown as Record<string, string | number>,
      { puuid }
    );

    await executeQuery(query, "setRank");
  }

  public async getId(puuid: string) {
    return await getRowId(this.table, { puuid });
  }

  public async exists(puuid: string) {
    return await isStored(this.table, { puuid });
  }

  public async update(data: AccountType) {
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
