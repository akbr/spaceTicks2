import LocalHost from "@hosts/local";
import createGameService from "@services/gameService";
import initReact from "@ui/initReact";

export default (rules, initialState, Display) => {
  const host = LocalHost(rules, initialState);
  const gameStore = createGameService(host, rules);
  initReact(gameStore, Display);
};
