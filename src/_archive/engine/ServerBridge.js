import getTickStates from "./getTickStates";

export default (server, rules, delay) =>
  [
    asyncWrapper(delay), // makes everything a promise
    cacheWrapper, // caching based on deterministic req strings
    cacheSettingsWrapper, // caches all {type:"get"} by default
    mutateResponse(rules) // adds states to finished turns without states (exensible)
  ].reduce((server, wrapper) => wrapper(server), server);

const asyncWrapper = (delay = 0) => server => (...args) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(server(...args));
    }, delay);
  });

const cacheSettingsWrapper = server => (event, options) =>
  event.type === "get"
    ? server(event, options || { cache: true })
    : server(event, { cache: false });

const cacheWrapper = server => {
  let cacheObj = {};

  return (event, options = {}) => {
    let { cache = true } = options;
    let key = JSON.stringify(sortObj(event));

    if (cache && cacheObj[key]) {
      return cacheObj[key];
    } else {
      let promise = server(event);
      if (cache) {
        cacheObj[key] = promise;
      }
      return promise;
    }
  };
};

const sortObj = obj =>
  obj === null || typeof obj !== "object"
    ? obj
    : Array.isArray(obj)
    ? obj.map(sortObj)
    : Object.assign(
        {},
        ...Object.entries(obj)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([k, v]) => ({ [k]: sortObj(v) }))
      );

const mutateRes = (res, rules) => {
  if (res.ticks && !res.states) {
    res.states = getTickStates(res.initialState, res.ticks, rules);
  }
  return res;
};

const mutateResponse = rules => server => (...args) =>
  server(...args).then(res => mutateRes(res, rules));
