import Server from "./Server";
import { rules, initialState } from "./Server.test";
import ServerBridge from "./ServerBridge";

const server = Server(rules, initialState);
const serverBridge = ServerBridge(server, rules);
const firstRes = server({ type: "get" });

test("it initializes", () => {
  expect(serverBridge).toBeTruthy();
});

test("gets a promise, then a static value, per cache layer", done => {
  serverBridge({ type: "get" }).then(res => {
    expect(res).toEqual(firstRes);
    done();
  });
});

test("gets the next turn, as a promise", done => {
  serverBridge({ type: "next" })
    .then(res => {
      expect(res).toEqual({ currentTurn: 2 });
      return serverBridge({ type: "get", turn: 1 });
    })
    .then(res => {
      expect(res.turn).toEqual(1);
      expect(res.ticks).toBeTruthy();
      expect(res.states.length).toBeGreaterThan(0);
      done();
    });
});

test("watch out! get is still cached", done => {
  serverBridge({ type: "get" }).then(res => {
    expect(res).toEqual(firstRes);
    done();
  });
});

test("this is what we expect", done => {
  serverBridge({ type: "get", turn: 2 }, { cache: false }).then(res => {
    expect(res.turn).toEqual(2);
    done();
  });
});
