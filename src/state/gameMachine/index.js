import { Machine, spawn, assign, send } from "xstate";
import serverService from "./serverService";

const logRes = assign((ctx, e) => ({
  res: e.data,
  waiting: false
}));
const logReq = assign((ctx, e) => ({ req: e, waiting: true }));
const makeReq = send(ctx => ctx.req, { to: "fetch" });

export default server =>
  Machine({
    id: "toggle",
    initial: "init",
    context: {
      waiting: false,
      req: undefined,
      res: undefined
    },
    states: {
      init: {
        entry: assign({
          fetch: () => spawn(serverService(server), "fetch")
        })
      },
      sort: {
        on: {
          "": [
            { cond: ctx => ctx.waiting, target: "waiting" },
            { target: "ready" }
          ]
        }
      },
      waiting: {},
      ready: {}
    },
    on: {
      get: { actions: [logReq, makeReq], target: "sort" },
      update: {
        actions: logRes,
        target: "sort"
      }
    }
  });
