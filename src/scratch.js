import xstate from "xstate";
let { Machine, assign, interpret, actions } = xstate;
const { raise } = actions;

console.log(raise("TEST"));
