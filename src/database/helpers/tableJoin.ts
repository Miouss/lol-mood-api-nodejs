export function joinChampTable(champId: number) {
  return tableJoin("LEFT", "champ", "game_info.champ_id", "champ.id");
}

function tableJoin(type: "LEFT" | "INNER", table: string, verif1: string, verif2: string) {
  return `${type} JOIN ${table} ON ${verif1} = ${verif2}`;
}
