import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <div className="App">
      <YoYo />
    </div>
  );
}

const YoYo = () => {
  return (
    <>
      <div>Hello, world!!</div>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

/**
import init from "./init";
import { rules, initialState, Display } from "./test-game";

init(
  {
    rules,
    initialState,
    Display
  },
  document.getElementById("root")
);
**/
