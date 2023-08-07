export function convertRepetitivesFields(
  data: any,
  newFieldName: string,
  prefix: string,
  suffix?: string
) {
  data.forEach((row: any) => {
    const array = [];

    for (let i = 0; i < 9; i++) {
      const fieldName = `${prefix}${i}${suffix}`;

      if (row[fieldName] === undefined) continue;
      
      array.push(row[fieldName]);
      delete row[fieldName];
    }

    row[newFieldName] = array;
  });
}

export function convertAllRepetitivesFields(data: any) {
  convertRepetitivesFields(data, "stats_mods", "stats_mod", "_id");
  convertRepetitivesFields(data, "summoners", "summoner", "_id");
  convertRepetitivesFields(data, "runes", "rune", "_id");
  convertRepetitivesFields(data, "items", "item", "_id");
  convertRepetitivesFields(data, "start_items", "start_item", "_id");
  convertRepetitivesFields(
    data,
    "completed_items",
    "completed_item",
    "_id"
  );
}