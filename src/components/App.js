import React from "react";

import { useGameService } from "../state/gameProvider";

import DisplayHOC from "./DisplayHOC";
import HistoryNav from "./HistoryNav";

import "./App.css";

export default function App({ Display }) {
  return (
    <Wrapper>
      <DisplayHOC Display={Display} />
      <BottomConsoleWrapper>
        <BottomConsole />
      </BottomConsoleWrapper>
    </Wrapper>
  );
}

const Wrapper = ({ children }) => <div className="wrapper">{children}</div>;

const BottomConsoleWrapper = ({ children }) => (
  <div className="bottomConsole">{children}</div>
);

const BottomConsole = () => {
  let [{ value, context }, send] = useGameService();

  return value === "current" ? (
    <CurrentNav context={context} send={send} />
  ) : value === "history" ? (
    <HistoryNav context={context} send={send} />
  ) : (
    "Loading..."
  );
};

const CurrentNav = ({ context, send }) => {
  let { turn } = context;

  return (
    <>
      <div style={{ textAlign: "center" }}>Turn {turn} (Current)</div>
      <button
        disabled={turn === 1}
        onClick={() => send("step", { direction: -1 })}
      >
        Prev Turns
      </button>
      <button
        onClick={() => {
          send("next", { numTicks: 10 });
        }}
      >
        Next Turn
      </button>
    </>
  );
};
