export function arrayToKeyedObj(array: unknown[], key: string) {
    const obj: any = {};
  
    let i = 0;
  
    for (const item of array) {
      obj[`${key}${i}`] = item;
      i++;
    }
  
    return obj;
  }
  