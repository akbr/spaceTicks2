import React from "react";
import { useSelector, useDispatch } from "react-redux";

import DisplayHOC from "./DisplayHOC";

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

const HistoryNav = () => {
  const { turn, numTurns, tick, numTicks } = useSelector(({ game }) => game);
  const dispatch = useDispatch();

  const step = num => {
    dispatch({ type: "seekTo", tick: tick + num });
  };
  const seek = e => {
    let tick = parseInt(e.target.value, 0);
    dispatch({ type: "seekTo", tick });
  };
  const toCurrentTurn = () => {
    dispatch({ type: "toTurn", turn: numTurns });
  };
  const moveTurn = num => {
    dispatch({ type: "toTurn", turn: turn + num });
  };

  return (
    <>
      <div className="navTop">
        <div>
          Turn {turn}, Tick {tick}/{numTicks}
        </div>
        <button onClick={toCurrentTurn}>X</button>
      </div>

      <div className="navContainer">
        <button disabled={turn === 1} onClick={() => moveTurn(-1)}>
          {"<<"}
        </button>
        <button onClick={() => step(-1)}>{"<"}</button>
        <input
          type="range"
          min="0"
          max={numTicks}
          value={tick}
          onChange={seek}
        />
        <button onClick={() => step(1)}>{">"}</button>
        <button onClick={() => moveTurn(1)}>{">>"}</button>
      </div>
    </>
  );
};
