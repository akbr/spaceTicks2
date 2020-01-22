import { resolveTurn } from "./logic";

export default function Server(rules, state = {}) {
  const db = [{ state }];
  const api = {
    get: (turn = db.length) => {
      let { state, turnActions } = db[turn - 1];

      return {
        turn,
        numTurns: db.length,
        state,
        turnActions
      };
    },

    next: (numTicks = 1) => {
      let entry = db[db.length - 1];
      let { state } = entry;
      let { nextState, turnActions } = resolveTurn(state, numTicks, rules);
      entry.turnActions = turnActions;
      let nextEntry = { state: nextState };
      db.push(nextEntry);
      return api.get(db.length - 1);
    }
  };

  return api;
}
