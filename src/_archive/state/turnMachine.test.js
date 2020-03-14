import { interpret } from "xstate";
import turnMachine, { createView } from "./turnMachine";

import Server from "../engine/Server";
import { rules, initialState } from "../engine/Server.test";
import getTickStates from "../engine/getTickStates";

const server = Server(rules, initialState);
server({ type: "next", numTicks: 10 });
let turn1 = server({ type: "get", turn: 1 });
turn1.states = getTickStates(turn1.initialState, turn1.ticks, rules);
let turn2 = server({ type: "get", turn: 2 });

const turnService = interpret(turnMachine);
const send = turnService.send;

// To read on tests
let value;
let context;

turnService.onTransition(state => {
  value = state.value;
  context = state.context;
});

turnService.onTransition(state => {
  console.log(state.value, state.context.tick);
});

turnService.start();

// -----

test("inits, fetches first turn async", () => {
  expect(turnService).toBeTruthy();
  turnService.send({ type: "update", data: turn1 });
  turnService.send({ type: "seek", to: 125 });
  turnService.send({ type: "seek", by: -5 });
});
