import { on } from "flyd";
import getTickStates from "@logic/getTickStates";
import getKey from "./reqToKey";
import fetchStream from "./fetchService";

const shouldCache = (req, res) => (res.ticks ? res.turn : false);
const onResponse = rules => res => {
  let { ticks, states, initialState } = res;
  let needsHistoryStates = ticks && !states;
  if (needsHistoryStates) {
    res.states = getTickStates(initialState, ticks, rules);
  }
  return res;
};

export default (server, rules) => (send, onReceive) => {
  let [output$, makeRequest] = fetchStream(server, {
    getKey,
    shouldCache,
    onResponse: onResponse(rules)
  });

  onReceive(req => makeRequest(req));

  const sub = on(data => {
    send({ type: "update", ...data });
  }, output$);

  return () => sub.end();
};
