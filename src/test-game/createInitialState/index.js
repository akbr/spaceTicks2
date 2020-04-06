export default () => ({
  systems: [
    { id: 1, x: 100, y: 100, r: 10, color: "green", fleets: 10 },
    { id: 2, x: 150, y: 217, r: 20, color: "pink" },
    { id: 3, x: 225, y: 50, r: 15, color: "brown" },
    { id: 4, x: 450, y: 175, r: 80, color: "yellow" }
  ],
  transit: [
    { id: "Aaron", from: 1, to: 3, x: 150, y: 217, num: 12 },
    { id: "Ben", from: 3, to: 1, x: 450, y: 175, num: 100 }
  ]
});
