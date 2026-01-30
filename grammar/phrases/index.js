const aggregate = require("./aggregate");
const colorPhrase = require("./color");
const editingPhrase = require("./editing");
const framePhrase = require("./frame");
const onEndkeyPhrase = require("./on-endkey");
const onErrorPhrase = require("./on-error");
const onQuitPhrase = require("./on-quit");
const onStopPhrase = require("./on-stop");
const stopAfterPhrase = require("./stop-after");
const widgetPhrase = require("./widget");

module.exports = (ctx) => ({
  ...aggregate(ctx),
  ...colorPhrase(ctx),
  ...editingPhrase(ctx),
  ...framePhrase(ctx),
  ...onEndkeyPhrase(ctx),
  ...onErrorPhrase(ctx),
  ...onQuitPhrase(ctx),
  ...onStopPhrase(ctx),
  ...stopAfterPhrase(ctx),
  ...widgetPhrase(ctx),
});
