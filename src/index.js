import Server from "@server";
import { rules, initialState } from "@server/testRules";
import createGameService from "@services/gameService";

import initReact from "@ui/initReact";

const server = Server(rules, initialState);
const gameStore = createGameService(server, rules);

initReact(gameStore);
