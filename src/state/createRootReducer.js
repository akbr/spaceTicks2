export default function createReducer(gameProvider) {
  return (state = {}, action) => {
    return {
      game: createGameReducer(gameProvider)(state.game, action),
      camera: cameraReducer(state.camera, action)
    };
  };
}

function cameraReducer(state = { x: 0, y: 0, scale: 1 }, action) {
  if (action.type === "scroll") {
    state = setPan(state, action);
  }
  return state;
}

function setPan({ x, y, scale }, { dx, dy }) {
  return {
    x: (x += dx),
    y: (y += dy),
    scale
  };
}

const createGameReducer = gameProvider =>
  fromReducerObj(
    {
      toTurn: (state, { turn }) => gameProvider.get(turn),
      seekTo: (state, { tick }) => {
        let { numTicks, turn } = state;
        if (tick > numTicks) {
          tick = numTicks;
        } else if (tick < 0) {
          tick = 0;
        }
        return gameProvider.get(turn, tick);
      },
      nextTurn: (state, { numTicks = 50 }) => gameProvider.next(numTicks)
    },
    gameProvider.get()
  );

const fromReducerObj = (obj, initialState) => (
  state = initialState,
  action
) => {
  let { type } = action;
  return obj[type] ? obj[type](state, action) : state;
};
