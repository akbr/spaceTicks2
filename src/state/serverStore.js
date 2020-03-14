import { stream } from "flyd";

export default server => {
  let status = { current: false };
  let cache = {};
  let res$ = stream();
  let send = makeSend(server, status, cache, res$);
  return [res$, send];
};

const makeSend = (server, status, cache, res$) => (req, refresh) => {
  let key = JSON.stringify(sortObj(req));
  status.current = key;

  const maybeStream = () => {
    if (cache[key] && key === status.current) {
      status.current = false;
      res$(cache[key].data);
    }
  };

  if (refresh === true) {
    cache[key] = false;
  }

  if (!cache[key]) {
    let res = server(req);
    if (res.then) {
      res.then(data => {
        cache[key] = { data, req };
        maybeStream();
      });
    } else {
      cache[key] = { data: res, req };
    }
  }

  maybeStream();
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
