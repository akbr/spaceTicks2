import { BehaviorSubject } from "rxjs";
import { interpret } from "xstate";

import createFetchService from "@services/fetchService/";
import { getKey, shouldCache, onResponse } from "./fetchServiceSettings";

import gameMachine, { computeContext } from "./gameMachine";

export default (server, rules) => {
  const gameState$ = new BehaviorSubject({});

  const fetchService = createFetchService(server, {
    getKey,
    shouldCache,
    onResponse: onResponse(rules)
  });

  const gameService = interpret(gameMachine(fetchService)).start();

  gameService.onTransition(state => {
    let { value, context } = state;
    gameState$.next({ value, ...computeContext(context) });
  });

  return [gameState$, gameService.send];
};
