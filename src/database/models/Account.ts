import { insertInto, updateSetWhere, select } from "../helpers";
import { executeQuery, getRowId, isStored } from "../utils";

export class Account {
  private static table = "account";

  public static async create(data: AccountType) {
    const query = insertInto(this.table).values(
      convertDataForDB(data) as unknown as Record<string, string | number>
    );

    await executeQuery(query, "create account");
  }

  public static async get(puuid: string) {
    const query = select("*").from(this.table).where({ puuid });

    return await executeQuery(query, "getAccount");
  }

  public static async getId(puuid: string) {
    return await getRowId(this.table, { puuid });
  }

  public static async exists(puuid: string) {
    return await isStored(this.table, { puuid });
  }

  public static async update(data: AccountType) {
    const query = updateSetWhere(this.table, convertDataForDB(data), {
      puuid: data.puuid,
    });

    await executeQuery(query, "updateAccount");
  }
}

export interface AccountType {
  puuid: string;
  name: string;
  summonerLevel: number;
  profileIconId: number;
  rank: string;
  tier: string;
  lp: number;
  games: number;
  wins: number;
}

export interface AccountTypeDB {
  puuid: string;
  name: string;
  level: number;
  profile_icon_id: number;
  grade: string;
  tier: string;
  lp: number;
  games: number;
  wins: number;
}

function convertDataForDB(data: AccountType) {
  return {
    puuid: data.puuid,
    name: data.name,
    level: data.summonerLevel,
    profile_icon_id: data.profileIconId,
    grade: data.rank,
    tier: data.tier,
    lp: data.lp,
    games: data.games,
    wins: data.wins,
  };
}
