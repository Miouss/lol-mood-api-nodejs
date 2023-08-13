import { insertInto, select } from "../helpers";
import { convertAllRepetitivesFields, executeQuery } from "../utils";

export class GameInfo {
  private static table = "game_info";

  private static tables = {
    game: "game",
    champ: "champ",
    positioning: "positioning",
    asset: "asset",
    account: "account",
  };

  public static async get(gameInfoId: string) {
    const query = select("*").from(this.table).where({ gameId: gameInfoId });

    const result = await executeQuery(query, "getGameInfo");

    convertAllRepetitivesFields(result);

    return result;
  }

  public static async set(data: MatchData) {
    const query = insertInto(this.table).values(
      data as unknown as Record<string, string | number>
    );

    await executeQuery(query, "setGameInfo");
  }

  public static async getChampStats(champName: string) {
    const query = select("*")
      .from(this.table)
      .innerJoin(
        `${this.tables.champ} ON ${this.table}.champ_id = ${this.tables.champ}.id`
      )
      .where({ [`${this.tables.champ}.name`]: champName });

    const result = await executeQuery(query, "getChampStats");
    if (!result) return;

    convertAllRepetitivesFields(result);
  }
}

export interface MatchData {
  gameId: number;
  accountId: number;
  champId: number;
  positioningId: number;

  win: boolean;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  multikills: boolean | null;
  skillsOrder: string | null;
  evolvesOrder: string | null;

  primaryStyleId: number;
  subStyleId: number;
  perkId: number;

  runeId0: number;
  runeId1: number;
  runeId2: number;
  runeId3: number;
  runeId4: number;

  statsModId0: number;
  statsModId1: number;
  statsModId2: number;

  summonerId0: number;
  summonerId1: number;

  itemId0: number | null;
  itemId1: number | null;
  itemId2: number | null;
  itemId3: number | null;
  itemId4: number | null;
  itemId5: number | null;

  startItemId0: number | null;
  startItemId1: number | null;
  startItemId2: number | null;
  startItemId3: number | null;
  startItemId4: number | null;
  startItemId5: number | null;
  startItemId6: number | null;

  completedItemId0: number | null;
  completedItemId1: number | null;
  completedItemId2: number | null;
  completedItemId3: number | null;
  completedItemId4: number | null;
  completedItemId5: number | null;
}
