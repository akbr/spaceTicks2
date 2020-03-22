import React from "react";
import ReactDOM from "react-dom";
import { createProvider } from "@ui/services/gameService";

import App from "./components/App";

export default gameService => {
  const GameServiceProvider = createProvider(gameService);

  ReactDOM.render(
    <GameServiceProvider>
      <App />
    </GameServiceProvider>,
    document.getElementById("root")
  );
};
