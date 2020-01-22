import React from "react";
import { useSelector, useDispatch } from "react-redux";

export default function HistoryNav() {
  const { turn, numTurns, tick, numTicks } = useSelector(({ game }) => game);
  const dispatch = useDispatch();

  const step = num => dispatch({ type: "seekTo", tick: tick + num });
  const seek = e =>
    dispatch({ type: "seekTo", tick: parseInt(e.target.value, 0) });
  const toCurrentTurn = () => dispatch({ type: "toTurn", turn: numTurns });
  const moveTurn = num => dispatch({ type: "toTurn", turn: turn + num });

  return (
    <>
      <NavTop
        turn={turn}
        tick={tick}
        numTicks={numTicks}
        close={toCurrentTurn}
      />
      <Slider tick={tick} numTicks={numTicks} seek={seek} />
      <Buttons turn={turn} step={step} moveTurn={moveTurn} />
    </>
  );
}

const NavTop = ({ turn, tick, numTicks, close }) => (
  <div className="navTop">
    <div>
      Turn {turn}, Tick {tick}/{numTicks}
    </div>
    <button onClick={close}>X</button>
  </div>
);

const Slider = ({ tick, numTicks, seek }) => (
  <div className="navContainer">
    <input
      style={{ width: "100%" }}
      type="range"
      min="0"
      max={numTicks}
      value={tick}
      onChange={seek}
    />
  </div>
);

const Buttons = ({ turn, step, moveTurn }) => (
  <div>
    <button disabled={turn === 1} onClick={() => moveTurn(-1)}>
      {"<<"}
    </button>
    <button onClick={() => step(-1)}>{"<"}</button>
    <button>{"Play"}</button>
    <button onClick={() => step(1)}>{">"}</button>
    <button onClick={() => moveTurn(1)}>{">>"}</button>
  </div>
);
