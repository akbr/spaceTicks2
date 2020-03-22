import React, { createContext, useContext } from "react";
import useService from "./useService";

const GameServiceContext = createContext();

export const createProvider = gameService => ({ children }) => (
  <GameServiceContext.Provider value={gameService}>
    {children}
  </GameServiceContext.Provider>
);

const useGameService = () => useService(useContext(GameServiceContext));

export default useGameService;
