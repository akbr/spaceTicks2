import getTickStates from "./getTickStates";
import createFetchService from "@services/fetchService/";

export const getKey = (req) => {
  if (req.type === "get") {
    return typeof req.turn === "number" ? req.turn : "current";
  }
  return req.type;
};

const shouldCache = (req, res) => (res.ticks ? res.turn : false);

const onResponse = (actionGlossary) => (res) => {
  let { ticks, states, initialState } = res;
  let needsHistoryStates = ticks && !states;
  if (needsHistoryStates) {
    res.states = getTickStates(initialState, ticks, actionGlossary);
  }
  return res;
};

export default (serverBridge, actionGlossary) => {
  return createFetchService(serverBridge, {
    getKey,
    shouldCache,
    onResponse: onResponse(actionGlossary)
  });
};
