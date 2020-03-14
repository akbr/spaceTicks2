import React from "react";
import ReactDOM from "react-dom";

import { interpret } from "xstate";

import Server from "./engine/Server";
import ServerBridge from "./engine/ServerBridge";
import gameMachine, { createDigest } from "./state/gameMachine";
import { createGameProvider } from "./state/gameProvider";

import App from "./components/App";

export default function init({ rules, initialState, Display }, rootElement) {
  const server = Server(rules, initialState);
  const serverBridge = ServerBridge(server, rules, 50);
  const gameService = interpret(gameMachine(serverBridge));
  const GameProvider = createGameProvider(gameService);

  gameService.onTransition(createDigest);
  gameService.start();
  gameService.send("get");

  ReactDOM.render(
    <GameProvider>
      <App Display={Display} />
    </GameProvider>,
    rootElement
  );
}
