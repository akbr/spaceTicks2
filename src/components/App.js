import React from "react";
import { useSelector, useDispatch } from "react-redux";

import DisplayHOC from "./DisplayHOC";
import HistoryNav from "./HistoryNav";

import { skip, nextTurn, toggleAnimation } from "../state/actions";

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
  const toNextTurn = () => dispatch(nextTurn());
  const toHistory = () => {
    dispatch(skip(-1));
    dispatch(toggleAnimation({ status: true, direction: -1 }));
  };
  return (
    <div>
      <div style={{ textAlign: "center" }}>Turn {turn} (Current)</div>
      <button disabled={turn === 1} onClick={toHistory}>
        Prev Turns
      </button>
      <button onClick={toNextTurn}>Next Turn</button>
    </div>
  );
};
