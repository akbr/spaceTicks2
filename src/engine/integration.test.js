import GameProvider from "./GameProvider";
import Server from "./Server";

const initialState = { count: 0 };

const rules = [
  {
    type: "add",
    resolve: state => ({ ...state, count: state.count + 1 })
  },
  {
    type: "awardEvery10Count",
    getActions: state => (state.count % 10 === 0 ? { num: 1 } : false),
    resolve: (state, { num }) => {
      let award = (state.award || 0) + num;
      return {
        ...state,
        award
      };
    }
  }
];

// ---

const server = Server(rules, initialState);

const gameProvider = GameProvider(server, rules);

// ---

test("it initializes", () => {
  expect(gameProvider.get).toBeTruthy();
  expect(gameProvider.next).toBeTruthy();
});

test("it gets", () => {
  let gameData = gameProvider.get();

  expect(gameData).toEqual({
    turn: 1,
    numTurns: 1,
    state: initialState,
    tick: false,
    numTicks: false,
    stateActions: false,
    turnActions: false
  });
});

test("it gets the last tick of turn 1", () => {
  let gameData = gameProvider.next(10);
  let {
    turn,
    numTurns,
    state,
    tick,
    numTicks,
    stateActions,
    turnActions
  } = gameData;

  expect(turn).toBe(1);
  expect(numTurns).toBe(2);
  expect(state).toEqual({ count: 10, award: 1 });
  expect(tick).toBe(10);
  expect(numTicks).toBe(10);
  expect(stateActions.length).toBe(1);
  expect(turnActions.length).toBe(10);
});

test("it get beginning of turn 2", () => {
  let gameData = gameProvider.get();
  expect(gameData).toEqual({
    turn: 2,
    numTurns: 2,
    state: { count: 10, award: 1 },
    tick: false,
    numTicks: false,
    stateActions: false,
    turnActions: false
  });
});

test("server state and client state match", () => {
  let gameData = gameProvider.get(1, 10);
  let serverGameData = server.get();
  expect(gameData.state).toEqual(serverGameData.state);
});
