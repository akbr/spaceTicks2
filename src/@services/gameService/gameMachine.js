import { Machine, spawn, assign, actions, send } from "xstate";
import getKey from "./reqToKey";

const { raise } = actions;

const createServerReq = (ctx, e) => {
  let { type } = e;
  if (type === "select") {
    let { turn, dir } = e;
    let req = { type: "get" };
    if (turn) {
      req.turn = turn;
    } else if (dir !== undefined && typeof ctx.selected === "number") {
      req.turn = ctx.selected + dir;
    }
    return req;
  } else if (type === "next") {
    return e;
  }
};

const logReq = assign((ctx, e) => {
  let req = createServerReq(ctx, e);
  let selected = getKey(req);

  return {
    ...ctx,
    req,
    prevSelected: ctx.selected,
    selected
  };
});
const makeReq = send(ctx => ctx.req, { to: "fetch" });
const requestAndSort = { actions: [logReq, makeReq], target: "sort" };

const logRes = assign({
  data: (_, { res }) => res,
  prevSelected: ({ selected, prevSelected }, { res }) =>
    res.turn !== selected ? selected : prevSelected,
  selected: (_, { res }) => res.turn,
  req: false
});

const sort = {
  on: {
    "": [
      { cond: ctx => ctx.req, target: "waiting" },
      { cond: ctx => ctx.data.ticks, target: "history" },
      { target: "current" }
    ]
  }
};

const clampSeek = ({ ticks }, targetTick) =>
  targetTick < 0 ? 0 : targetTick > ticks.length ? ticks.length : targetTick;
const doSeek = ({ data, tick }, { to, by }) => {
  let targetTick = typeof to === "number" ? to : by + tick;
  return clampSeek(data, targetTick);
};
const seek = assign({
  tick: doSeek
});

const isMinTick = (ctx, e) => e.dir === -1 && (ctx.tick === 0 || ctx.req);
const isMaxTick = (ctx, e) => e.dir === 1 && ctx.tick === ctx.data.ticks.length;
const jumpTick = assign({
  tick: (ctx, { dir }) =>
    dir === -1 ? 0 : dir === 1 ? ctx.data.ticks.length : ctx.tick
});
const skipBack = {
  cond: isMinTick,
  actions: raise({ type: "select", dir: -1 })
};
const skipFwd = {
  cond: isMaxTick,
  actions: raise({ type: "select", dir: 1 })
};
const skipTicks = { actions: jumpTick };

const resetTick = assign({ tick: 0 });
const setInitialTick = assign({
  tick: ({ selected, prevSelected, data, tick }) => {
    if (prevSelected === "next") return 0;
    if (prevSelected === "current") return 0;
    if (prevSelected > selected) return data.ticks.length;
    if (prevSelected < selected) return 0;
    return tick;
  }
});

const animate = (_, { by = 1 }) => send => {
  send({ type: "_seek", by });
  const id = setInterval(() => send({ type: "_seek", by }), 200);
  return () => clearInterval(id);
};
const animationEnded = ({ tick, data }) => tick === data.ticks.length;
const resetTickIfAtEnd = assign({
  tick: ({ tick, data }) => (tick === data.ticks.length ? 0 : tick)
});

export default fetchCallback =>
  Machine({
    initial: "init",
    context: {
      req: false,
      selected: undefined,
      prevSelected: undefined,
      data: undefined,
      tick: 0
    },
    states: {
      init: {
        entry: [
          assign({ fetch: () => spawn(fetchCallback, "fetch") }),
          raise("select")
        ]
      },
      sort,
      waiting: {
        on: {
          skip: [skipFwd, skipBack]
        }
      },
      current: {
        entry: resetTick,
        on: {
          skip: [skipBack]
        }
      },
      history: {
        initial: "idle",
        states: {
          idle: {
            entry: setInitialTick,
            on: {
              seek: { actions: seek },
              skip: [skipFwd, skipBack, skipTicks],
              togglePlay: "animating"
            }
          },
          animating: {
            entry: resetTickIfAtEnd,
            invoke: { src: animate },
            on: {
              "": { cond: animationEnded, target: "idle" },
              _seek: { actions: seek },
              seek: { actions: seek, target: "idle" },
              //skip: { actions: skip, target: "idle" },
              togglePlay: "idle"
            },
            exit: assign({ prevSelected: ctx => ctx.selected })
          }
        }
      }
    },
    on: {
      select: requestAndSort,
      next: requestAndSort,
      update: [
        {
          cond: (ctx, e) => ctx.req === e.req,
          actions: logRes,
          target: "sort"
        }
      ]
    }
  });

export const computeContext = ({ data, tick, req, selected }) => {
  let state = {
    selected,
    req,
    tick
  };

  if (data) {
    let { turn, initialState, states, ticks } = data;
    let frame = tick === 0 ? initialState : states[tick - 1];
    let events = ticks ? ticks[tick - 1] : false;

    state = {
      ...state,
      turn,
      frame,
      ticks,
      events
    };
  }

  return state;
};
