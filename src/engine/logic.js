// Rule interface
const ensureArray = x =>
  x === undefined || x === false ? [] : Array.isArray(x) ? x : [x];
const getActions = (rule, state) =>
  rule.getActions
    ? ensureArray(rule.getActions(state)).map(action => ({
        ...action,
        type: rule.type
      }))
    : [];
const resolveRule = (state, actions, rule) =>
  rule.getActions
    ? actions.length
      ? actions.reduce(rule.resolve, state)
      : state
    : rule.resolve(state);

// Running ticks and turns
const resolveTick = (state, rules) => {
  let tickActions = [];
  rules.forEach(rule => {
    let actions = getActions(rule, state);
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
  let turnActions = [];

  while (numTicks > 0) {
    let [nextState, tickActions] = resolveTick(state, rules);
    turnActions.push(tickActions);
    state = nextState;
    numTicks = numTicks - 1;
  }

  return {
    nextState: state,
    turnActions
  };
};

export const getTickStates = (state, turnActions, rules) =>
  turnActions.map(tickActions => {
    state = resolveTickWithActions(state, rules, tickActions);
    return state;
  });
