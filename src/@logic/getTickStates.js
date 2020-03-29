import { produce } from "immer";
import { getTickState } from ".";

const getTickStateWithImmer = produce(getTickState);

export default (state, turnActions, rules = []) =>
  turnActions.map(tickActions => {
    state = getTickStateWithImmer(state, rules, tickActions);
    return state;
  });
