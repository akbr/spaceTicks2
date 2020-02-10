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
  if (!rule.getActions) {
    return rule.resolve(state);
  }

  if (rule.getActions) {
    return actions.length ? actions.reduce(rule.resolve, state) : state;
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

const resolveTickWithActions = (state, rules, tickActions = []) =>
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

export const getTickStates = (state, turnActions, rules = []) =>
  turnActions.map(tickActions => {
    state = resolveTickWithActions(state, rules, tickActions);
    return state;
  });
