import { getTickStates } from "./logic";

export default function GameProvider(server, rules) {
  let cache = {};
  let maxTurnSeen = 0;

  const api = {
    get: (turnNum, tick = 0) => {
      let isCached = cache[turnNum];
      let res = isCached ? cache[turnNum] : server.get(turnNum);
      let { turn, numTurns, state, turnActions } = res;

      maxTurnSeen = numTurns > maxTurnSeen ? numTurns : maxTurnSeen;

      let isResolvedTurn = turnActions;
      if (isResolvedTurn && !isCached) {
        //console.time("timer");
        cache[turnNum] = {
          ...res,
          states: getTickStates(state, turnActions, rules)
        };
        //console.timeEnd("timer");
      }

      // Don't return more than max tick
      if (isResolvedTurn) {
        tick = tick > turnActions.length ? turnActions.length : tick;
      }
      let initialStateRequested = tick === 0;
      state = initialStateRequested ? state : cache[turnNum].states[tick - 1];

      return {
        turn,
        numTurns: maxTurnSeen,
        state,
        tick: isResolvedTurn ? tick : false,
        numTicks: isResolvedTurn ? turnActions.length : false,
        stateActions:
          isResolvedTurn && !initialStateRequested
            ? turnActions[tick - 1]
            : false,
        turnActions: isResolvedTurn ? turnActions : false
      };
    },

    next: numTicks => {
      let { turn } = server.next(numTicks);
      return api.get(turn, numTicks);
    }
  };

  return api;
}
