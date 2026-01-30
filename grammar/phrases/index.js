const aggregate = require("./aggregate");
const colorPhrase = require("./color");

module.exports = (ctx) => ({
  ...aggregate(ctx),
  ...colorPhrase(ctx),
});
