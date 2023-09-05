export function twoDecimalsNum(num: number) {
  return parseFloat(num.toFixed(2));
}

export function twoDecimalsNumByPercent(num: number) {
  return twoDecimalsNum(num * 100);
}
