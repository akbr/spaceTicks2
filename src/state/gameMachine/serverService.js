import { on } from "flyd";
import serverStore from "../serverStore";

export default server => (cb, receive) => {
  let [res$, send] = serverStore(server);
  receive(req => send(req));
  let sub = on(res => cb({ type: "update", data: res }), res$);
  return () => sub.end();
};
