import { produce } from "immer";
import { applyActions } from "./core";

const getTickStateWithImmer = produce(applyActions);

export default (state, turnActions, rules = []) =>
  turnActions.map(tickActions => {
    state = getTickStateWithImmer(state, rules, tickActions);
    return state;
  });
