export function convertRepetitivesFields(
  data: any,
  newFieldName: string,
  prefix: string,
) {
  data.forEach((row: any) => {
    const array = [];

    for (let i = 0; i < 9; i++) {
      const fieldName = `${prefix}${i}`;

      if (row[fieldName] === undefined) continue;
      
      array.push(row[fieldName]);
      delete row[fieldName];
    }

    row[newFieldName] = array;
  });
}

export function convertAllRepetitivesFields(data: any) {
  convertRepetitivesFields(data, "statsMods", "statsModId");
  convertRepetitivesFields(data, "summoners", "summonerId");
  convertRepetitivesFields(data, "runes", "runeId");
  convertRepetitivesFields(data, "items", "itemId");
  convertRepetitivesFields(data, "start_items", "startItemId");
  convertRepetitivesFields(
    data,
    "completedItems",
    "completedItemId",
  );
}