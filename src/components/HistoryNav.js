import React from "react";

export default function HistoryNav({ context, send }) {
  return (
    <>
      <NavTop {...context} send={send} />
      <Slider {...context} send={send} />
      <Buttons {...context} send={send} />
    </>
  );
}

const NavTop = ({ turn, tick, numTicks, send }) => (
  <div className="navTop">
    <div>
      Turn {turn}, Tick {tick}/{numTicks}
    </div>
    <button onClick={() => send({ type: "get" })}>X</button>
  </div>
);

const Slider = ({ tick, numTicks, send }) => (
  <div className="navContainer">
    <input
      style={{ width: "100%" }}
      type="range"
      min="0"
      max={numTicks}
      value={tick}
      onChange={e => send("seek", { to: parseInt(e.target.value, 10) })}
    />
  </div>
);

const Buttons = ({ turn, tick, send }) => (
  <div>
    <button
      disabled={turn === 1 && tick === 0}
      onClick={() => send("step", { direction: -1 })}
    >
      {"<<"}
    </button>
    <button onClick={() => send("seek", { by: -1 })}>{"<"}</button>
    <button onClick={() => send("seek", { by: 1 })}>{">"}</button>
    <button onClick={() => send("step", { direction: 1 })}>{">>"}</button>
  </div>
);
