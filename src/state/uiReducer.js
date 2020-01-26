export default (
  state = { status: false, direction: 1 },
  { type, payload },
  { tick, numTicks, turn, numTurns }
) => {
  let isLastTick = tick >= numTicks;
  let isFirstTick = tick === 0;

  switch (type) {
    case "toggleAnimation":
      let { status, direction = 1 } = payload;
      if (status === false) {
        return {
          ...state,
          status: false
        };
      }
      if (status === true) {
        if (direction === 1) {
          return {
            direction,
            status: !isLastTick
          };
        } else if (direction === -1) {
          return {
            direction,
            status: !isFirstTick
          };
        }
      }
    default:
      return (isLastTick && state.direction > -1) ||
        (isFirstTick && state.direction < 1)
        ? {
            ...state,
            status: false
          }
        : state;
  }
};
