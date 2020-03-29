import getTickStates from "@logic/getTickStates";

export const getKey = req => {
  if (req.type === "get") {
    return typeof req.turn === "number" ? req.turn : "current";
  }
  if (req.type === "next") {
    return "next";
  }
};

export const shouldCache = (req, res) => (res.ticks ? res.turn : false);

export const onResponse = rules => res => {
  let { ticks, states, initialState } = res;
  let needsHistoryStates = ticks && !states;
  if (needsHistoryStates) {
    res.states = getTickStates(initialState, ticks, rules);
  }
  return res;
};
