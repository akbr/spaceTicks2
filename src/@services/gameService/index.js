import { BehaviorSubject } from "rxjs";
import { interpret } from "xstate";

import createServerService from "@services/serverService";
import gameMachine, { computeContext } from "./gameMachine";

export default (serverBridge, actionGlossary) => {
  const gameState$ = new BehaviorSubject({});

  const serverService = createServerService(serverBridge, actionGlossary);

  const gameService = interpret(gameMachine(serverService)).start();

  gameService.onTransition((state) => {
    let { value, context } = state;
    gameState$.next({ value, ...computeContext(context) });
  });

  const send = gameService.send;

  registerHashChange(send);

  return [gameState$, send];
};

const registerHashChange = (send) => {
  const onHashChange = () => {
    let game = window.location.hash.substr(1);
    if (game === "") return;
    send({ type: "setEnvelope", envelope: { game } });
  };
  window.addEventListener("hashchange", onHashChange);
  onHashChange();
};
