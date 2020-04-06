import LocalServerBridge from "@ui/LocalServerBridge";
import createGameService from "@services/gameService";
import initReact from "@ui/initReact";

import { createInitialState, rules, Display } from "test-game";

export default () => {
  const serverBridge = LocalServerBridge(createInitialState, rules);
  const gameStore = createGameService(serverBridge, rules);
  initReact(gameStore, Display);
};
