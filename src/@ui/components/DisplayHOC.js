import React from "react";
import useGameService from "@ui/services/gameService";

const DefaultDisplay = (frame, events) => (
  <div>
    {JSON.stringify(frame)} | {JSON.stringify(events)}
  </div>
);

const DisplayHOC = ({ Display }) => {
  let [{ frame, events }] = useGameService();
  if (!frame) return null;
  let View = Display || DefaultDisplay;
  return <View frame={frame} events={events} />;
};

export default DisplayHOC;
