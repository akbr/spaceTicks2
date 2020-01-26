import { createStore } from "@reduxjs/toolkit";
import createRootReducer from "./rootReducer";
export default gameProvider => createStore(createRootReducer(gameProvider));
