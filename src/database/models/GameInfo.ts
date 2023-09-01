import { insertInto, select } from "../helpers";
import { convertAllRepetitivesFields, executeQuery } from "../utils";

export class GameInfo {
  private static table = "game_info";

  private static tables = {
    game: "game",
    champ: "champ",
    account: "account",
  };

  public static async get(gameInfoId: string) {
    const query = select("*").from(this.table).where({ gameId: gameInfoId });

    const result = await executeQuery(query, "getGameInfo");

    convertAllRepetitivesFields(result);

    return result;
  }

  public static async create(data: ParticipantMatchData) {
    const query = insertInto(this.table).values(
      data as unknown as Record<string, string | number>
    );

    await executeQuery(query, "setGameInfo");
  }

  public static async getGameStatsByPuuid(gameId: string, puuid: string) {
    const query = select(
      `${this.tables.game}.identifier as matchId`,
      `${this.tables.champ}.name as champName`,
      `${this.table}.*`
    )
      .from(this.table)
      .innerJoin(this.tables.game, this.tables.champ, this.tables.account)
      .where({ identifier: gameId, puuid });

    const result = await executeQuery(query, "getGameStatsByPuuid");

    convertAllRepetitivesFields(result);

    return (result as ParticipantMatchData[])[0];
  }

  public static async getChampStats(champName: string) {
    const query = select(`${this.table}.*`)
      .from(this.table)
      .innerJoin(this.tables.champ)
      .where({ [`${this.tables.champ}.name`]: champName });

    const result = await executeQuery(query, "getChampStats");
    if (!result) return;

    convertAllRepetitivesFields(result);
  }
}

export interface ParticipantMatchData {
  accountId: number;
  gameId: number;
  champId: number;

  skillsOrder: string;
  evolvesOrder: string;
  lane: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;

  itemId0?: number;
  itemId1?: number;
  itemId2?: number;
  itemId3?: number;
  itemId4?: number;
  itemId5?: number;
  itemId6?: number;

  statsModId0: number;
  statsModId1: number;
  statsModId2: number;

  summonerId0: number;
  summonerId1: number;

  primaryStyleId: number;
  subStyleId: number;
  perkId: number;

  runeId0: number;
  runeId1: number;
  runeId2: number;
  runeId3: number;
  runeId4: number;
}
