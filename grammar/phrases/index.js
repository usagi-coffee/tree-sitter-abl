const aggregate = require("./aggregate");
const atPhrase = require("./at");
const colorPhrase = require("./color");
const editingPhrase = require("./editing");
const formatPhrase = require("./format");
const framePhrase = require("./frame");
const onEndkeyPhrase = require("./on-endkey");
const onErrorPhrase = require("./on-error");
const onQuitPhrase = require("./on-quit");
const onStopPhrase = require("./on-stop");
const stopAfterPhrase = require("./stop-after");
const widgetPhrase = require("./widget");
const assignPhrase = require("./assign");
const triggerPhrase = require("./trigger");

module.exports = (ctx) => ({
  ...assignPhrase(ctx),
  ...aggregate(ctx),
  ...triggerPhrase(ctx),
  ...atPhrase(ctx),
  ...colorPhrase(ctx),
  ...editingPhrase(ctx),
  ...formatPhrase(ctx),
  ...framePhrase(ctx),
  ...onEndkeyPhrase(ctx),
  ...onErrorPhrase(ctx),
  ...onQuitPhrase(ctx),
  ...onStopPhrase(ctx),
  ...stopAfterPhrase(ctx),
  ...widgetPhrase(ctx),
});
