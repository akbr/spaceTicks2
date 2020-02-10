import { interpret } from "xstate";
import gameMachine from "./gameMachine";

import Server from "../engine/Server";
import ServerBridge from "../engine/ServerBridge";

const machine = interpret(gameMachine(ServerBridge(Server())));

machine.start();

describe("basic interactions", () => {
  test("gets a first time", done => {
    expect(machine.state.value).toEqual("idle");
    machine.send("get");
    expect(machine.state.value).toEqual("loading");
    expect(machine.state.context.turn).toEqual(Infinity);
    setTimeout(() => {
      expect(machine.state.value).toEqual("current");
      expect(machine.state.context.turn).toEqual(1);
      expect(machine.state.context.tick).toEqual(0);
      machine.send("get", { turn: 1 });
      expect(machine.state.value).toEqual("current");
      expect(machine.state.context.turn).toEqual(1);
      expect(machine.state.context.tick).toEqual(0);
      done();
    }, 1);
  });

  test("resolves a turn", done => {
    machine.send("next", { numTicks: 10 });
    expect(machine.state.value).toEqual("loading");
    setTimeout(() => {
      expect(machine.state.value).toEqual("history");
      expect(machine.state.context.turn).toEqual(1);
      expect(machine.state.context.tick).toEqual(0);
      machine.send("seek");
      expect(machine.state.context.tick).toEqual(1);
      machine.send("step");
      expect(machine.state.context.tick).toEqual(10);
      machine.send("seek", { to: 5 });
      expect(machine.state.context.tick).toEqual(5);
      machine.send("step", { direction: -1 });
      expect(machine.state.context.tick).toEqual(0);
      machine.send("step", { direction: -1 });
      expect(machine.state.context.turn).toEqual(1);
      expect(machine.state.context.tick).toEqual(0);
      done();
    }, 1);
  });

  test("gets next turn", done => {
    machine.send("get");
    expect(machine.state.value).toEqual("loading");
    setTimeout(() => {
      expect(machine.state.value).toEqual("current");
      expect(machine.state.context.turn).toEqual(2);
      machine.send("get", { turn: 1 });
      expect(machine.state.value).toEqual("history");
      expect(machine.state.context.turn).toEqual(1);
      done();
    }, 1);
  });
});
