import { distanceBetween } from "../../utils/2dMath";
import { moveSpeed } from "./settings";

export const type = "transitBattle";

export function getActions({ transit }) {
  return getBattleActions(transit);
}

export function resolve(state, action) {
  let { transit } = state;
  let { battle } = action;
  let [fleet1, fleet2] = battle;

  if (fleet1.num > fleet2.num) {
    transit = modTransit(transit, fleet1, fleet2);
  } else if (fleet2.num > fleet1.num) {
    transit = modTransit(transit, fleet2, fleet1);
  } else {
    transit = transit.filter(
      fleet => fleet.id !== fleet1.id && fleet.id !== fleet2.id
    );
  }

  return {
    ...state,
    transit
  };
}

function getBattleActions(transit) {
  let withPotentialCollisions = ([lane1, lane2]) =>
    lane1.length && lane2.length;

  let battleActions = [];

  sortByLanes(transit)
    .filter(withPotentialCollisions)
    .forEach(([direction1, direction2]) => {
      direction1.forEach(fleet1 => {
        direction2.forEach(fleet2 => {
          let distance = distanceBetween(fleet1, fleet2);
          if (distance <= moveSpeed * 2) {
            battleActions.push({ battle: [fleet1, fleet2] });
          }
        });
      });
    });

  return battleActions;
}

function sortByLanes(transit) {
  const getSortedIdStrings = (x, y) =>
    [x, y].map(x => String(x)).sort((y, x) => y.localeCompare(x));

  let lanes = {};

  transit.forEach(fleet => {
    let { to, from } = fleet;
    let laneIds = getSortedIdStrings(to, from);
    let laneId = laneIds.join(".");
    if (!lanes[laneId]) lanes[laneId] = [[], []];
    let laneDirection = String(from) === laneIds[0] ? 0 : 1;
    lanes[laneId][laneDirection].push(fleet);
  });

  return Object.values(lanes);
}

const modTransit = (transit, fleet1, fleet2) =>
  transit
    .map(fleet =>
      fleet.id === fleet1.id
        ? { ...fleet1, num: fleet1.num - fleet2.num }
        : fleet
    )
    .filter(fleet => fleet.id !== fleet2.id);
