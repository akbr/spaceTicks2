import { createAction } from "@reduxjs/toolkit";

export const toTurn = createAction("toTurn");
export const nextTurn = createAction("nextTurn");
export const seekTo = createAction("seekTo");
export const toggleAnimation = createAction("toggleAnimation");
export const scroll = createAction("scroll");

export const skip = createAction("skip");
