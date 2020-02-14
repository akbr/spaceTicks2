import Server from "./Server";
import { getTickStates } from "./logic";

export const initialState = { count: 0 };
export const rules = [
  {
    type: "add",
    resolve: state => {
      state.count += 1;
    }
  },
  {
    type: "boost",
    getActions: state => state.count === 10,
    resolve: state => {
      state.count += 100;
    }
  }
];

test("it initializes", () => {
  const server = Server(rules, initialState);
  expect(server).toBeTruthy();
});

test("basic get requests", () => {
  const server = Server();

  expect(server({ type: "get" })).toEqual({
    turn: 1,
    initialState: {},
    ticks: false
  });

  expect(server({ type: "get", turn: 1 })).toEqual({
    turn: 1,
    initialState: {},
    ticks: false
  });

  expect(server({ type: "get", turn: Infinity })).toEqual({
    turn: 1,
    initialState: {},
    ticks: false
  });
});

test("basic nexts and state reconstitution", () => {
  const server = Server(rules, initialState);
  const numTicks = 11;

  expect(server({ type: "next", numTicks })).toEqual({
    turn: 1,
    initialState: { count: 0 },
    ticks: [[], [], [], [], [], [], [], [], [], [{ type: "boost" }], []]
  });

  expect(server({ type: "get" })).toEqual({
    turn: 2,
    initialState: { count: 111 },
    ticks: false
  });

  // ensure we can reconstitute current state from tick actions
  const response = server({ type: "get", turn: 1 });
  const states = getTickStates(response.initialState, response.ticks, rules);
  expect(server({ type: "get", turn: 2 }).initialState).toEqual(
    states[numTicks - 1]
  );
});