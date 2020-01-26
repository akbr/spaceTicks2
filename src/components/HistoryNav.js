import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useInterval from "./useInterval";

import { toTurn, seekTo, skip, toggleAnimation } from "../state/actions";

export default function HistoryNav() {
  const { turn, numTurns, tick, numTicks } = useSelector(({ game }) => game);
  const animStatus = useSelector(({ ui }) => ui.status);
  const animDirection = useSelector(({ ui }) => ui.direction);
  const dispatch = useDispatch();

  const step = num => dispatch(seekTo(tick + num));
  const seek = e => dispatch(seekTo(parseInt(e.target.value, 0)));
  const toCurrentTurn = () => dispatch(toTurn(numTurns));
  const skipAction = direction => dispatch(skip(direction));
  const toggleAnimationAction = bool => dispatch(toggleAnimation(bool));
  useInterval(
    () => {
      dispatch(seekTo(tick + animDirection));
    },
    animStatus ? 16 : null
  );
  return (
    <>
      <NavTop
        turn={turn}
        tick={tick}
        numTicks={numTicks}
        close={toCurrentTurn}
      />
      <Slider tick={tick} numTicks={numTicks} seek={seek} />
      <Buttons
        turn={turn}
        tick={tick}
        step={step}
        skip={skipAction}
        toggleAnimation={toggleAnimationAction}
        animStatus={animStatus}
      />
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

const Buttons = ({ step, skip, toggleAnimation, animStatus, turn, tick }) => (
  <div>
    <button disabled={turn === 1 && tick === 0} onClick={() => skip(-1)}>
      {"<<"}
    </button>
    <button onClick={() => step(-1)}>{"<"}</button>
    <button
      onClick={() => toggleAnimation({ status: !animStatus, direction: 1 })}
    >
      {animStatus ? "Pause" : "Play"}
    </button>
    <button onClick={() => step(1)}>{">"}</button>
    <button onClick={() => skip(1)}>{">>"}</button>
  </div>
);
