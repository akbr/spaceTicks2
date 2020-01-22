import React from "react";
import { useSelector, useDispatch } from "react-redux";

import DisplayHOC from "./DisplayHOC";
import HistoryNav from "./HistoryNav";

import "./App.css";

export default function App({ Display }) {
  return (
    <div className="wrapper">
      <DisplayHOC Display={Display} />
      <BottomConsole />
    </div>
  );
}

const BottomConsole = () => {
  let isCurrentTurn = useSelector(({ game }) => game.turn === game.numTurns);

  return (
    <div className="bottomConsole">
      {!isCurrentTurn && <HistoryNav />}
      {isCurrentTurn && <CurrentTurnButtons />}
    </div>
  );
};

const CurrentTurnButtons = () => {
  const { turn } = useSelector(({ game }) => game);
  const dispatch = useDispatch();
  const nextTurn = () =>
    dispatch({
      type: "nextTurn"
    });
  const prevTurn = () =>
    dispatch({
      type: "toTurn",
      turn: turn - 1
    });

  return (
    <div>
      <div style={{ textAlign: "center" }}>Turn {turn} (Current)</div>
      <button disabled={turn === 1} onClick={prevTurn}>
        Prev Turns
      </button>
      <button onClick={nextTurn}>Next Turn</button>
    </div>
  );
};
