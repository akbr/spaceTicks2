import React, { createContext, useContext } from "react";
import { useService } from "@xstate/react";
import { deriveContext } from "./gameMachine";

const GameContext = createContext();

const createGameProvider = gameService => ({ children }) => (
  <GameContext.Provider value={gameService}>{children}</GameContext.Provider>
);

const useGameService = () => {
  let gameContext = useContext(GameContext);
  let [{ value, context }, send] = useService(gameContext);
  //console.log(value, context);
  let derivedContext = deriveContext(context);
  //console.log("=>", derivedContext);
  return [{ value, context: derivedContext }, send];
};

export { createGameProvider, useGameService };
