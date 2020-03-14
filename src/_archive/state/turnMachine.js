import { Machine, assign, actions, send } from "xstate";
import { pure } from "xstate/lib/actions";
const { raise } = actions;

// Selectors
const sMaxTick = data => (data.ticks ? data.ticks.length : 0);

// Logic
const computeSeek = ({ tick, data }, { by = 1, to }) => {
  let targetTick = typeof to === "number" ? to : by + tick;
  let maxTick = sMaxTick(data);
  return targetTick < 0 ? 0 : targetTick > maxTick ? maxTick : targetTick;
};

// Actions
const update = assign({
  data: (_, { data }) => data,
  tick: () => 0
});
const reqTurn = (ctx, { turn }) => sendParent({ type: "get", turn });
const reqNext = (ctx, { numTicks }) => sendParent({ type: "next", numTicks });

const seek = assign({
  prevTick: ({ tick }) => tick,
  tick: computeSeek
});
const skip = pure(({ tick, data }, { direction }) => {
  let maxTick = sMaxTick(data);
  if (tick > 0 && tick < maxTicks) {
    let to = direction > 0 ? maxTick : 0;
    return raise({ type: "seek", to });
  } else {
    let turn = direction > 0 ? data.turn + 1 : data.turn - 1;
    return raise({ type: "get", turn });
  }
});

// Guards
const isHistory = ({ data }) => data.ticks;
const isWaiting = ({ data }) => !data.initialState;
const animationEnded = ({ tick, prevTick, data }) => {
  let maxTick = sMaxTick(data);
  return (
    (tick === 0 && prevTick > 0) || (tick === maxTick && prevTick < maxTick)
  );
};

// Services
const animate = (_, { by = 1 }) => send => {
  const id = setInterval(() => send({ type: "_seek", by }), 200);
  return () => clearInterval(id);
};

const turnMachine = Machine({
  initial: "init",
  context: {
    data: {
      // turn, initialState[, ticks, states]
    },
    tick: undefined
  },
  states: {
    init: {},
    waiting: {
      on: { skip: { actions: skip } }
    },
    unknown: {
      on: {
        "": [
          { cond: isHistory, target: "history" },
          { cond: isWaiting, target: "waiting" },
          { target: "current" }
        ]
      }
    },
    current: {
      on: {
        skip: { actions: skip },
        reqNext: { actions: reqNext }
      }
    },
    history: {
      initial: "idle",
      states: {
        idle: {
          on: {
            seek: { actions: seek },
            skip: { actions: skip },
            togglePlay: "animating"
          }
        },
        animating: {
          invoke: { src: animate },
          on: {
            "": { cond: animationEnded, target: "idle" },
            _seek: { actions: seek },
            seek: { actions: seek, target: "idle" },
            skip: { actions: skip, target: "idle" },
            togglePlay: "idle"
          }
        }
      }
    }
  },
  on: {
    update: {
      actions: update,
      target: "unknown"
    }
  }
});

export default turnMachine;
