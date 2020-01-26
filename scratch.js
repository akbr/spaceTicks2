({status: false, direction: 1}, event, {tick, numTicks}) => {
  let payload = {event};
  switch (state.status) {
    case false:
      case (event.payload === true):
        return {
          ...state,
          status: tick < numTicks
        }
      case (event.payload === false):
        return {
          ...state,
          status: false
        }
    case true:
      case (event.payload === false):
        return {
          ...state,
          status: false
        }
  }
  return state;
}

