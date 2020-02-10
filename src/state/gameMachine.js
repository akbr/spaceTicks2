import { Machine, assign } from "xstate";
import memoizeOne from "memoize-one";

const createGameMachineDef = serverBridge => ({
  id: "game",
  initial: "idle",
  context: {
    turn: undefined,
    tick: 0,
    cache: {}
  },
  states: {
    idle: {},
    refreshTurn: {
      on: {
        "": [
          {
            cond: "needsLoading",
            target: "loading"
          },
          {
            cond: "isCurrent",
            target: "current"
          },
          {
            cond: "isHistory",
            target: "history"
          }
        ]
      }
    },
    loading: {
      invoke: {
        src: ({ turn }, { type, numTicks }) =>
          type === "next"
            ? serverBridge({ type: "next", numTicks })
            : serverBridge({ type: "get", turn }),
        onDone: {
          actions: "finishLoad",
          target: "refreshTurn"
        }
      }
    },
    current: {
      entry: "enforceTickRange",
      on: {
        step: {
          actions: "step",
          target: "refreshTurn"
        }
      }
    },
    history: {
      entry: "enforceTickRange",
      on: {
        seek: { actions: "seek" },
        step: {
          actions: "step",
          target: "refreshTurn"
        }
      }
    }
  },
  on: {
    get: {
      actions: "setTurn",
      target: ".refreshTurn"
    },
    next: {
      actions: ["setTurn", "setEndTick"],
      target: ".loading"
    }
  }
});

const selectTurn = ctx => ctx.cache[ctx.turn];
const selectFrame = ctx => {
  if (!selectTurn(ctx)) return;
  return ctx.tick === 0
    ? selectTurn(ctx).initialState
    : selectTurn(ctx).states[ctx.tick - 1];
};

const getTick = ({ ticks }, targetTick) => {
  let numTicks = ticks.length;
  return targetTick > numTicks ? numTicks : targetTick < 0 ? 0 : targetTick;
};

const guards = {
  needsLoading: ctx => !selectTurn(ctx),
  isHistory: ctx => selectTurn(ctx).ticks,
  isCurrent: ctx => !selectTurn(ctx).ticks
};

const actions = {
  setTurn: assign({
    turn: (ctx, { turn = Infinity }) => turn
  }),
  setEndTick: assign({
    tick: () => Infinity
  }),
  enforceTickRange: assign({
    tick: ctx => {
      let currentTurn = selectTurn(ctx);
      if (!currentTurn) return ctx.tick;
      if (!currentTurn.ticks) return 0;
      if (ctx.tick > currentTurn.ticks.length) return currentTurn.ticks.length;
      return ctx.tick;
    }
  }),
  finishLoad: assign({
    turn: (ctx, { data }) => data.turn,
    cache: (ctx, { data }) => ({
      ...ctx.cache,
      [data.turn]: data
    })
  }),
  seek: assign({
    tick: (ctx, { by = 1, to }) => {
      let currentTurn = selectTurn(ctx);
      let targetTick = typeof to === "number" ? to : by + ctx.tick;
      return getTick(currentTurn, targetTick);
    }
  }),
  step: assign((ctx, { direction = 1 }) => {
    let currentTurn = selectTurn(ctx);
    let maxTick = currentTurn.ticks ? currentTurn.ticks.length : 0;
    let fwd = direction > 0;
    let back = !fwd;

    if (fwd && ctx.tick === maxTick && currentTurn.ticks) {
      return { ...ctx, turn: ctx.turn + 1, tick: 0 };
    } else if (back && ctx.tick === 0 && ctx.turn > 1) {
      return {
        ...ctx,
        turn: ctx.turn === 1 ? 1 : ctx.turn - 1,
        tick: Infinity
      };
    } else if (fwd) {
      return { ...ctx, tick: maxTick };
    } else if (back) {
      return { ...ctx, tick: 0 };
    }
  })
};

export default serverBridge => {
  let gameMachine = createGameMachineDef(serverBridge);
  return Machine(gameMachine, { actions, guards });
};

export const deriveContext = memoizeOne(context => {
  let { turn, tick } = context;
  let turnData = selectTurn(context);
  let state = selectFrame(context);
  if (!turnData) return {};
  return {
    turn,
    tick,
    numTicks: turnData.ticks ? turnData.ticks.length : 0,
    state,
    actions: tick === 0 ? false : turnData.ticks[tick - 1]
  };
});
