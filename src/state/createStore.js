import { createStore } from "redux";
import createRootReducer from "./createRootReducer";

export default gameProvider => createStore(createRootReducer(gameProvider));
