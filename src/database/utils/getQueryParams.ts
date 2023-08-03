import { getColumns, getValues } from "./";

export function getQueryParams(data: Record<string, string | number>) {
  const cols = getColumns(data);
  const values = getValues(data);

  return { cols, values };
}
