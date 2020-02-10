import init from "./init";
import { rules, initialState, Display } from "./test-game";

init(
  {
    rules,
    initialState,
    Display
  },
  document.getElementById("root")
);