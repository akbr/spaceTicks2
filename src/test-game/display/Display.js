import React from "react";

export default function SVGDisplay({ frame, events }) {
  let { systems, transit } = frame;

  return (
    <svg height="100%" width="100%">
      <g>
        {systems.map(svgSystem)}
        {transit.map(svgTransit)}
      </g>
    </svg>
  );
}

const svgSystem = ({ x, y, r, color, fleets }) => (
  <g key={x} transform={`translate(${x}, ${y})`}>
    <circle r={r} fill={color} />
    {fleets && (
      <text x={r + 2} y={r + 5} fill="white">
        {fleets}
      </text>
    )}
  </g>
);

const svgTransit = ({ x, y, to, num }) => (
  <g key={to} transform={`translate(${x}, ${y})`}>
    <circle r="5" fill="orange" />
    <text x={7} y={10} fill="gray">
      {num}
    </text>
  </g>
);
