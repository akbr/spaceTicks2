import { stream } from "flyd";

export default (server, { getKey, shouldCache, onResponse }) => {
  let awaiting = {};
  let cache = {};

  const output$ = stream();

  const updateCache = (req, res) => {
    let resKey = shouldCache(req, res);
    if (resKey) cache[resKey] = res;
  };

  const send = req => {
    let reqKey = getKey(req);

    const procResponse = res => {
      delete awaiting[reqKey];
      res = onResponse(res);
      updateCache(req, res);
      output$({ req, res });
    };

    let cachedRes = cache[reqKey];
    if (cachedRes) {
      output$({ req, res: cachedRes });
      return;
    }

    awaiting[reqKey] = true;
    let res = server(req);
    res.then ? res.then(procResponse) : procResponse(res);
  };

  return [output$, send];
};
