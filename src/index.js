import React from "react";
import ReactDOM from "react-dom";

import Server from "./engine/Server";
import { rules, initialState } from "./engine/Server.testRules";

import createStore from "./state/gameStore";
import useStore from "./state/useStore";

const wrap = server => req =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(server(req));
    }, 1000);
  });

const server = Server(rules, initialState);
server({ type: "next", numTicks: 10 });

const store = createStore(wrap(server));

function App() {
  return (
    <div className="App">
      <YoYo />
    </div>
  );
}

const YoYo = () => {
  let [{ value, state }, send] = useStore(store);

  return (
    <>
      <div>{value}</div>
      <div>REQ: {JSON.stringify(state.req)}</div>
      <div>RES: {JSON.stringify(state.res)}</div>
      <button onClick={() => send({ type: "get", turn: 1 })}>toggle1</button>
    </>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
