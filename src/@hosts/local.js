import { createEntry, get, getNextEntries } from "@logic/server";

function LocalHost(rules = [], initialState = {}) {
  const db = [createEntry(initialState)];

  const api = {
    get: ({ turn = db.length }) => {
      if (turn > db.length) turn = db.length;
      if (turn < 1) turn = 1;
      let entry = db[turn - 1];
      return get(turn, entry);
    },
    next: ({ numTicks = 1 }) => {
      let latestEntry = db[db.length - 1];
      let [updatedEntry, nextEntry] = getNextEntries(
        latestEntry,
        rules,
        numTicks
      );
      db.pop();
      db.push(updatedEntry, nextEntry);
      return api.get({ turn: db.length - 1 });
    }
  };

  return function ({ type, ...args }) {
    return api[type] ? api[type](args) : false;
  };
}

export default function () {
  const host = LocalHost(...arguments);
  return function (x) {
    return new Promise((resolve) => {
      setTimeout(function () {
        resolve(host(x));
      }, 500);
    });
  };
}
