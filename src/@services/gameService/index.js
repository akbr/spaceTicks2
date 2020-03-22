import { interpret } from "xstate";
import { stream } from "flyd";

import createFetchCallback from "./fetchServiceCallback";
import machine, { computeContext } from "./gameMachine";

export default (server, rules) => {
  let state$ = stream();

  let fetchCallback = createFetchCallback(server, rules);
  let service = interpret(machine(fetchCallback)).start();
  let { send } = service;

  service.onTransition(state => {
    let { value, context } = state;
    state$({ value, state: computeContext(context) });
  });

  return [state$, send];
};
