import Server from "@server";

export default function (createInitialState, rules) {
  const server = Server(createInitialState, rules);
  const lag = 500;
  return (e) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(server(e)), lag);
    });
}
