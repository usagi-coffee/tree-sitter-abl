module.exports = (ctx) => ({
  ...require("./conditional")(ctx),
  ...require("./available")(ctx),
  ...require("./can-find")(ctx),
  ...require("./locked")(ctx),
  ...require("./new")(ctx),
  ...require("./entered")(ctx),
  ...require("./dataset")(ctx),
  ...require("./current-changed")(ctx),
  ...require("./ambiguous")(ctx),
  ...require("./accum")(ctx),
  ...require("./input")(ctx),
  ...require("./widget")(ctx),
});
