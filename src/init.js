import Server from "./engine/Server";
import GameProvider from "./engine/GameProvider";

import createStore from "./state/createStore";
import { Provider } from "react-redux";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

export default function init({ rules, initialState, Display }, rootElement) {
  // Create server and gameProvider
  const server = Server(rules, initialState);
  const gameProvider = GameProvider(server, rules);

  // Create redux store, with access to gameProvider
  const store = createStore(gameProvider);

  // Kick of react+redux
  ReactDOM.render(
    <Provider store={store}>
      <App Display={Display} />
    </Provider>,
    rootElement
  );
}
