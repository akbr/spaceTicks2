import { moveSpeed } from "./settings";
import { travel } from "../../utils/2dMath";

export const type = "moveTransit";

export const resolve = state => {
  let { systems, transit } = state;
  return {
    ...state,
    transit: transit.map(fleet => ({
      ...fleet,
      ...travel(fleet, systems[fleet.to], moveSpeed)
    }))
  };
};
