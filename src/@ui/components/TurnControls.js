import React from "react";
import styled from "styled-components";
import useGameService from "@ui/services/gameService";

const Button = styled.button`
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  padding: 0.25em 1em;
`;

const Input = styled.input`
  width: 100%;
`;

const TurnControls = () => {
  let [{ value, state }, send] = useGameService();
  let { selected, tick, ticks } = state;

  return (
    <>
      <div>
        {JSON.stringify(value)}: {selected}
      </div>
      {value.history && (
        <HistoryControls value={value} tick={tick} ticks={ticks} send={send} />
      )}
      {value === "current" && <CurrentControls send={send} />}
    </>
  );
};

const CurrentControls = ({ send }) => (
  <>
    <button onClick={() => send({ type: "skip", dir: -1 })}>{"<<"}</button>
    <button onClick={() => send({ type: "next", numTicks: 10 })}>next</button>
  </>
);

const HistoryDisplay = ({ tick, ticks }) => (
  <div>
    tick: {tick}/{ticks.length}
  </div>
);
const HistorySlider = ({ tick, ticks, send }) => (
  <Input
    type="range"
    min="0"
    max={ticks.length}
    value={tick}
    onChange={e => send("seek", { to: parseInt(e.target.value, 10) })}
  />
);

const HistoryButtons = ({ send, isAnimating }) => (
  <div>
    <button onClick={() => send("skip", { dir: -1 })}>{"<<"}</button>
    <button onClick={() => send("seek", { by: -1 })}>{"<"}</button>
    <Button onClick={() => send("togglePlay")}>
      {isAnimating ? "Pause" : "Play"}
    </Button>
    <button onClick={() => send("seek", { by: 1 })}>{">"}</button>
    <button onClick={() => send("skip", { dir: 1 })}>{">>"}</button>
  </div>
);
const HistoryControls = ({ value, tick, ticks, send }) => {
  return (
    <>
      <HistoryDisplay tick={tick} ticks={ticks} />
      <HistorySlider tick={tick} ticks={ticks} send={send} />
      <HistoryButtons isAnimating={value.history === "animating"} send={send} />
    </>
  );
};

export default TurnControls;
