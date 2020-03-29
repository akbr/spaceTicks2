import { useState, useEffect } from "react";

export default ([state$, send]) => {
  const [value, setState] = useState(state$.getValue());
  useEffect(() => {
    const sub = state$.subscribe(x => setState(x));
    return () => sub.unsubscribe();
  }, [state$]);
  return [value, send];
};
