import { moveSpeed } from "./settings";
import { travel } from "../utils/2dMath";

export const type = "moveTransit";

export const resolve = ({ transit, systems }) => {
  transit.forEach(fleet => {
    let { x, y } = travel(fleet, systems[fleet.to], moveSpeed);
    fleet.x = x;
    fleet.y = y;
  });
};
