import { produce } from "immer";

// Rule interface
const ensureArray = x =>
  x === undefined || x === false ? [] : Array.isArray(x) ? x : [x];

const handleGetActions = (rule, state) => {
  let { type, getActions } = rule;
  let actions = getActions ? getActions(state) : false;
  if (actions === true) actions = {};
  return ensureArray(actions).map(action => ({
    ...action,
    type
  }));
};

const resolveRule = (state, actions, rule) => {
  // !! This is the ONLY function in which rule.resolve is called.
  // It guards aggresively against "undefined" returns, because rule.resolve might return undefined as a developer convenience when using immer.
  // This allows for (1) mutative runs by the server, and (2) immerized runs where produce is used at a higher level.
  if (rule.getActions) {
    return actions.length
      ? actions.reduce(
          (state, action) => rule.resolve(state, action) || state,
          state
        )
      : state;
  } else {
    return rule.resolve(state) || state;
  }
};

// Running ticks and turns
const resolveTick = (state, rules) => {
  let tickActions = [];
  rules.forEach(rule => {
    let actions = handleGetActions(rule, state);
    tickActions.push(...actions);
    state = resolveRule(state, actions, rule);
  });
  return [state, tickActions];
};

const resolveTickWithPredefinedActions = (state, rules, tickActions) =>
  rules.reduce(
    (state, rule) =>
      resolveRule(
        state,
        tickActions.filter(action => action.type === rule.type),
        rule
      ),
    state
  );

export const resolveTurn = (state, numTicks = 1, rules) => {
  let ticks = [];

  while (numTicks > 0) {
    let [nextState, tickActions] = resolveTick(state, rules);
    ticks.push(tickActions);
    state = nextState;
    numTicks = numTicks - 1;
  }

  let nextState = state;

  return [nextState, ticks];
};

const nextStateWithImmer = produce(resolveTickWithPredefinedActions);
export const getTickStates = (state, turnActions, rules = []) => {
  return turnActions.map(tickActions => {
    state = nextStateWithImmer(state, rules, tickActions);
    return state;
  });
};
