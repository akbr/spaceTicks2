import { createReducer } from "@reduxjs/toolkit";
import { scroll } from "./actions";

export default createReducer(
  { x: 0, y: 0, scale: 1 },
  {
    [scroll]: (state, { payload }) => setPan(state, payload)
  }
);

function setPan({ x, y, scale }, { dx, dy }) {
  return {
    x: (x += dx),
    y: (y += dy),
    scale
  };
}
