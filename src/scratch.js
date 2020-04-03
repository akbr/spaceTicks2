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

  /**
  let el = useRef(null);

  useEffect(() => {
    initHammerEvents(el.current, dispatch);
  }, []);
  **/

let state = {
  systems: [],
  fleets: []
};

let orders = [];

let envelope = {
  player: 1,
  game: "test"
};

let preppedState = applyOrders(state, orders);
let nextState = resolveTurn(state, numTicks);

let order = {
  type: "move",
  from: 1,
  to: 2,
  num: 12
};

let move = {
  validate: (order, state, orders, { player }) => {},

  resolve: (order, state) => {}
};
