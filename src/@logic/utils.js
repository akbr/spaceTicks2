export const ensureArray = x =>
  x === undefined || x === false ? [] : Array.isArray(x) ? x : [x];
