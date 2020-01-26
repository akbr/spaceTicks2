import { createReducer } from "@reduxjs/toolkit";
import { toTurn, nextTurn, seekTo, skip, toggleAnimation } from "./actions";

export default gameProvider =>
  createReducer(gameProvider.get(), {
    [toTurn]: (state, { payload }) => gameProvider.get(payload),
    [nextTurn]: state => gameProvider.next(state.numTicks || 50),
    [seekTo]: (state, { payload }) => {
      let tick = payload;
      let { numTicks, turn } = state;
      if (tick > numTicks) {
        tick = numTicks;
      } else if (tick < 0) {
        tick = 0;
      }
      return gameProvider.get(turn, tick);
    },
    [skip]: (state, { payload = 1 }) => {
      let direction = payload;
      let { turn, tick, numTicks } = state;

      let isStart = tick === 0;
      let isEnd = tick === numTicks;

      if (direction > 0 && isEnd) {
        return gameProvider.get(turn + 1);
      } else if (direction < 0 && isStart) {
        return gameProvider.get(turn - 1, Infinity);
      } else if (direction < 1 && tick === false) {
        return gameProvider.get(turn - 1, Infinity);
      }

      return gameProvider.get(turn, direction > 0 ? numTicks : 0);
    },
    [toggleAnimation]: (state, { payload }) => {
      let { status, direction } = payload;
      let { tick, numTicks, turn } = state;
      if (status && direction > 0 && tick >= numTicks) {
        return gameProvider.get(turn, 0);
      }
      return state;
    }
  });
