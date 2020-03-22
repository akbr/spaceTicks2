import React from "react";
import useGameService from "@ui/services/gameService";

const Display = () => {
  let [{ state }] = useGameService();
  let { frame, events } = state;

  return (
    <div>
      {JSON.stringify(frame)} | {JSON.stringify(events)}
    </div>
  );
};

export default Display;
