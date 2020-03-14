import React, { createContext, useContext } from "react";
import { useService } from "@xstate/react";

const GameContext = createContext();

const createGameProvider = gameService => ({ children }) => (
  <GameContext.Provider value={gameService}>{children}</GameContext.Provider>
);

const useGameService = () => {
  let gameContext = useContext(GameContext);
  return useService(gameContext);
};

export { createGameProvider, useGameService };
