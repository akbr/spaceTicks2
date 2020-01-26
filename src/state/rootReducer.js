import createGameReducer from "./gameReducer";
import uiReducer from "./uiReducer";
import cameraReducer from "./cameraReducer";

export default gameProvider => {
  const gameReducer = createGameReducer(gameProvider);

  return (state = {}, action) => {
    let game = gameReducer(state.game, action);
    let ui = uiReducer(state.ui, action, game);
    let camera = cameraReducer(state.camera, action);

    return {
      game,
      ui,
      camera
    };
  };
};
