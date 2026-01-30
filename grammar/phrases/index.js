const aggregate = require("./aggregate");
const colorPhrase = require("./color");
const framePhrase = require("./frame");

module.exports = (ctx) => ({
  ...aggregate(ctx),
  ...colorPhrase(ctx),
  ...framePhrase(ctx),
});
