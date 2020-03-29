import Server from "@server";
import createGameService from "@services/gameService";
import initReact from "@ui/initReact";

export default (rules, initialState, Display) => {
  const server = Server(rules, initialState);
  const gameStore = createGameService(server, rules);
  initReact(gameStore, Display);
};
