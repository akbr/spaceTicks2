import { applyTicks } from "./core";

export const get = (turn, entry) =>
  entry
    ? {
        turn,
        ...entry
      }
    : {
        err: `No turn entry for ${turn}`
      };

export const getNextEntries = (entry, actionGlossary, numTicks = 1) => {
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

export const createEntry = initialState => ({
  initialState,
  orders: [],
  ticks: false
});
