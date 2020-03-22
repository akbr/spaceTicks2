export default req => {
  if (req.type === "get") {
    return typeof req.turn === "number" ? req.turn : "current";
  }
  if (req.type === "next") {
    return "next";
  }
};
