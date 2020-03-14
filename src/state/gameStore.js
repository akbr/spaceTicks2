import { interpret } from "xstate";
import { stream } from "flyd";

import machine from "./gameMachine";

export default server => {
  let state$ = stream();

  let service = interpret(machine(server)).start();
  let { send } = service;

  service.onTransition(state => {
    let { value, context } = state;
    state$({ value, state: context });
  });

  return [state$, send];
};
