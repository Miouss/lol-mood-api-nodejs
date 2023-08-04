import { insertInto } from "../helpers";
import { executeQuery } from "../utils";

export class GameInfo {
  private table = "game_info";

  private tables = {
    game: "game",
    champ: "champ",
    positioning: "positioning",
    asset: "asset",
    account: "account",
  };

  public async set(data: Data) {
    const query = insertInto(
      this.table,
      data as unknown as Record<string, string | number>
    );

    await executeQuery(query, "setGameInfo");
  }
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
