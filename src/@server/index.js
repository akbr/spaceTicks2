import { resolveTurn } from "@logic";

export default function Server(rules = [], initialState = {}) {
  const db = [{ initialState, ticks: false }];

  const api = {
    get: ({ turn = db.length }) => {
      if (turn > db.length) turn = db.length;
      if (turn < 1) turn = 1;
      let entry = db[turn - 1];
      return entry
        ? {
            turn,
            ...entry
          }
        : {
            err: `No turn entry for ${turn}`
          };
    },
    next: ({ numTicks = 1 }) => {
      let latestEntry = db[db.length - 1];
      let { initialState } = latestEntry;
      let [nextTurnState, ticks] = resolveTurn(initialState, numTicks, rules);
      let updatedEntry = { ...latestEntry, ticks };
      let nextEntry = { initialState: nextTurnState, ticks: false };
      db.pop();
      db.push(updatedEntry, nextEntry);
      return api.get({ turn: db.length - 1 });
    }
  };

  return function({ type, ...args }) {
    return api[type] ? api[type](args) : false;
  };
}
