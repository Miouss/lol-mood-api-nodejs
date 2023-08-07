import { insertInto } from "../helpers";
import { convertAllRepetitivesFields, executeQuery } from "../utils";

export class GameInfo {
  private table = "game_info";

  private tables = {
    game: "game",
    champ: "champ",
    positioning: "positioning",
    asset: "asset",
    account: "account",
  };

  public async get(gameInfoId: number) {
    const query = `SELECT * FROM ${this.table} WHERE game_id = ${gameInfoId}`;

    const result = await executeQuery(query, "getGameInfo");
    console.log(result);
    return result;
  }

  public async set(data: Data) {
    const query = insertInto(
      this.table,
      data as unknown as Record<string, string | number>
    );

    await executeQuery(query, "setGameInfo");
  }

  public async getChampStats(champName: string) {
    const query = `SELECT * FROM ${this.table} INNER JOIN ${this.tables.champ} ON ${this.table}.champ_id = ${this.tables.champ}.id WHERE ${this.tables.champ}.name = "${champName}"`;
    const result = await executeQuery(query, "getChampStats");
    if (!result) return;

    convertAllRepetitivesFields(result);

    console.log((result as any)[0]);
  }
}

interface ChampStats {
  patch: string;
  game_id: number;
  lane: string;
  positioning_id: number;
  skill_order: string;
  evolves_order: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
}

interface Data {
  game_id: number;
  account_id: number;
  champ_id: number;
  positioning_id: number;

  win: boolean;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  multikills: boolean | null;
  skills_order: string | null;
  evolves_order: string | null;

  primary_style_id: number;
  sub_style_id: number;
  perk_id: number;

  rune0_id: number;
  rune1_id: number;
  rune2_id: number;
  rune3_id: number;
  rune4_id: number;

  stats_mod0_id: number;
  stats_mod1_id: number;
  stats_mod2_id: number;

  summoner1_id: number;
  summoner2_id: number;

  item0_id: number | null;
  item1_id: number | null;
  item2_id: number | null;
  item3_id: number | null;
  item4_id: number | null;
  item5_id: number | null;

  start_item0_id: number | null;
  start_item1_id: number | null;
  start_item2_id: number | null;
  start_item3_id: number | null;
  start_item4_id: number | null;
  start_item5_id: number | null;
  start_item6_id: number | null;

  completed_item0_id: number | null;
  completed_item1_id: number | null;
  completed_item2_id: number | null;
  completed_item3_id: number | null;
  completed_item4_id: number | null;
  completed_item5_id: number | null;
}
