const fetch = serverBridge => (send, receive) => {
  let log = { req: undefined, timeout: undefined };

  const reset = req => {
    log.req = req;
    log.timeout && clearTimeout(log.timeout);
    log.timeout = setTimeout(() => {
      send({ type: "waiting", req });
    }, 8);
  };

  const handleGet = (req, options) => {
    let res = serverBridge(req, options);
    res.then(data => {
      if (log.req === req) {
        send({
          type: "update",
          data
        });
        clearTimeout(log.timeout);
      }
    });
  };

  receive(function doReceive(req) {
    reset(req);
    if (req.type === "get") handleGet(req);
    if (req.type === "next") {
      let res = serverBridge(req);
      res.then(({ currentTurn }) => {
        doReceive({ type: "get", turn: currentTurn - 1 }, { cache: false });
      });
    }
  });
};

// View
export const createView = state => {};
