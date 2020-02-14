import { resolveTurn } from "./logic";

const deepCopy = x => JSON.parse(JSON.stringify(x));

export default function Server(rules = [], initialState = {}) {
  const db = [{ initialState, ticks: false }];
  const api = {
    get: ({ turn = db.length }) => {
      if (turn > db.length) turn = db.length;
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
      let stateCopy = deepCopy(latestEntry.initialState); // simulate pulling from db so safe for mutation
      let [nextState, ticks] = resolveTurn(stateCopy, numTicks, rules);
      let updatedEntry = { ...latestEntry, ticks };
      let nextEntry = { initialState: nextState, ticks: false };
      db.pop();
      db.push(updatedEntry, nextEntry);
      return api.get({ turn: db.length - 1 });
    }
  };

  return function({ type, ...args }) {
    return api[type] ? api[type](args) : false;
  };
}
