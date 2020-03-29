import React from "react";
import ReactDOM from "react-dom";
import { createProvider } from "@ui/services/gameService";

import App from "./components/App";

export default (gameService, Display) => {
  const GameServiceProvider = createProvider(gameService);

  ReactDOM.render(
    <GameServiceProvider>
      <App Display={Display} />
    </GameServiceProvider>,
    document.getElementById("root")
  );
};
