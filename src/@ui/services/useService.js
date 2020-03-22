import { useState, useEffect } from "react";
import { on } from "flyd";

export default ([state$, send]) => {
  const [value, setState] = useState(state$());
  useEffect(() => {
    const sub = on(x => setState(x), state$);
    return () => {
      sub.end();
    };
  }, [state$]);
  return [value, send];
};
