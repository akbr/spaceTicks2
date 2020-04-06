import { applyTicks } from "@logic";

export default function Server(createInitialState, rules) {
  const db = {};

  return (req) => {
    let { type, game, ...strippedReq } = req;

    if (!api[type]) {
      return { err: "Server API doesn't support" + type };
    }

    if (!db[game]) db[game] = createTable(createInitialState);

    let table = db[game];

    return api[type](strippedReq, table, rules);
  };
}

const api = {
  get: ({ turn }, table) => {
    turn = turn || table.length;
    if (turn > table.length) turn = table.length;
    if (turn < 1) turn = 1;

    let entry = table[turn - 1];
    return entry
      ? {
          turn,
          ...entry
        }
      : {
          err: `No turn entry for ${turn}`
        };
  },
  next: ({ numTicks = 1 }, table, actionGlossary) => {
    let latestEntry = table[table.length - 1];
    let [updatedEntry, nextEntry] = getNextEntries(
      latestEntry,
      actionGlossary,
      numTicks
    );
    table.pop();
    table.push(updatedEntry, nextEntry);
    return api.get({ turn: table.length - 1 }, table);
  }
};

const getNextEntries = (entry, actionGlossary, numTicks = 1) => {
  let { initialState } = entry;

  // Apply orders
  // ...

  let [nextState, ticks] = applyTicks(
    JSON.parse(JSON.stringify(initialState)),
    actionGlossary,
    numTicks
  );

  let updatedEntry = { ...entry, ticks };
  let nextEntry = createEntry(nextState);

  return [updatedEntry, nextEntry];
};

const createTable = (createInitialState) => [createEntry(createInitialState())];

const createEntry = (initialState) => ({
  initialState,
  orders: [],
  ticks: false
});
