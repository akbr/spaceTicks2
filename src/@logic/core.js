import { ensureArray } from "./utils";

export const applyTicks = (state, actionGlossary, numTicks = 1) => {
  let ticks = [];

  while (numTicks > 0) {
    let [nextState, actions] = applyTick(state, actionGlossary);
    ticks.push(actions);
    state = nextState;
    numTicks = numTicks - 1;
  }

  let nextTurnState = state;

  return [nextTurnState, ticks];
};

const applyTick = (state, actionGlossary) => {
  let tickActions = [];

  actionGlossary.forEach(actionDefinion => {
    let actions = getActions(actionDefinion, state);
    tickActions.push(...actions);
    state = applyActionDefinition(state, actionDefinion, actions);
  });

  return [state, tickActions];
};

const getActions = (actionDefinion, state) => {
  let { type, prep } = actionDefinion;
  let actions = prep ? prep(state) : false;
  actions = actions === true ? {} : actions;
  return ensureArray(actions).map(action => ({
    ...action,
    type
  }));
};

const applyActionDefinition = (state, actionDefinition, actions) => {
  let { prep } = actionDefinition;
  return prep
    ? // Action definitions with a "prep" property are opt-in.
      actions.reduce(
        (state, action) => actionDefinition.apply(state, action) || state,
        state
      )
    : // Action defintions without a "prep" property run on every tick.
      actionDefinition.apply(state) || state;
};

export const applyActions = (state, actionGlossary, actions) =>
  actionGlossary.reduce(
    (state, actionDefinition) =>
      applyActionDefinition(
        state,
        actionDefinition,
        actions.filter(action => action.type === actionDefinition.type)
      ),
    state
  );
