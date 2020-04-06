import { produce } from "immer";
import { applyActions } from "@logic";

const applyActionsImmutably = produce(applyActions);

export default (state, turnActions, rules = []) =>
  turnActions.map((tickActions) => {
    state = applyActionsImmutably(state, rules, tickActions);
    return state;
  });
