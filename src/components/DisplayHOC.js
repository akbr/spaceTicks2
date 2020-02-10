import React, { useState } from "react";
import { useGameService } from "../state/gameProvider";

//import * as Hammer from "hammerjs";
//import { scroll } from "../state/actions";

/**
function initHammerEvents(el, dispatch) {
  const mc = new Hammer.Manager(el);
  mc.add(new Hammer.Pan({ threshold: 0 }));

  let last;
  mc.on("panstart", function() {
    last = { deltaX: 0, deltaY: 0 };
  });

  mc.on("panmove", function({ deltaX, deltaY }) {
    let dx = deltaX - last.deltaX;
    let dy = deltaY - last.deltaY;
    last = { deltaX, deltaY };
    dispatch(scroll({ dx, dy }));
  });
}
**/

export default ({ Display }) => {
  /**
  let el = useRef(null);

  useEffect(() => {
    initHammerEvents(el.current, dispatch);
  }, []);
  **/

  let [{ value, context }] = useGameService();
  let [storedGameState, storeGameState] = useState();

  // Don't show a loading value when there is SOMETHING to show
  let state = value === "loading" ? storedGameState : context.state;
  state !== storedGameState && storeGameState(state);

  if (!state) return <div>Display waiting...</div>;

  return (
    <div className="display camera">
      <Display state={state} />
    </div>
  );
};
