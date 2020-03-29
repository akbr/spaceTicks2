// SERVER PATH ... => [nextTurnState, ticks]
export const resolveTurn = (state, numTicks = 1, rules) => {
  let ticks = [];

  // Potentially mutative for state (depending on how rule.resolves are defined).
  // (this may come out later)
  state = JSON.parse(JSON.stringify(state));

  while (numTicks > 0) {
    let [nextState, actions] = resolveTick(state, rules);
    ticks.push(actions);
    state = nextState;
    numTicks = numTicks - 1;
  }

  let nextTurnState = state;

  return [nextTurnState, ticks];
};

// CLIENT PATH ... => nextTickState
// Should be wrapped by immer of rule.resolves are not pure.
export const getTickState = (state, rules, actions) => {
  let nextTickState = rules.reduce(
    (state, rule) =>
      resolveRule(
        state,
        rule,
        actions.filter(action => action.type === rule.type)
      ),
    state
  );

  return nextTickState;
};

const resolveTick = (state, rules) => {
  let actions = [];
  rules.forEach(rule => {
    let ruleActions = getActions(rule, state);
    actions.push(...ruleActions);
    state = resolveRule(state, rule, ruleActions);
  });
  return [state, actions];
};

// Rule interface
const ensureArray = x =>
  x === undefined || x === false ? [] : Array.isArray(x) ? x : [x];

const getActions = (rule, state) => {
  let { type, getActions } = rule;
  let actions = getActions ? getActions(state) : false;
  if (actions === true) actions = {};
  return ensureArray(actions).map(action => ({
    ...action,
    type
  }));
};

const resolveRule = (state, rule, actions) => {
  // !! This is the ONLY function in which rule.resolve is called -- the central kernel of engine logic.
  // It guards aggresively against "undefined" returns, because rule.resolve might return undefined as a developer convenience when using immer.
  // This allows for (1) mutative runs by the server, *AND* (2) immerized runs where produce is used at a higher level.

  // If a rule does not specify a "getActions" property, it is assumed to resolve on each tick.
  if (!rule.getActions) {
    return rule.resolve(state) || state;
  }

  // If a rule does specify a "getActions" property, it is assumed to resolve on an opt-in basis only.
  if (rule.getActions) {
    if (actions && actions.length) {
      return actions.reduce(
        (state, action) => rule.resolve(state, action) || state,
        state
      );
    } else {
      return state;
    }
  }
};
