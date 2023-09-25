export function arrayToKeyedObj(array: unknown[], key: string) {
  const obj: any = {};

  let i = 0;

  array.forEach((element) => {
    obj[`${key}${i}`] = element;
    i++;
  });

  return obj;
}
