import { getTickStates } from "./logic";

export default (server, rules, delay = 0) => action =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      let res = server(action);
      if (res.ticks) {
        res.states = getTickStates(res.initialState, res.ticks, rules);
      }
      resolve(res);
    }, delay);
  });
