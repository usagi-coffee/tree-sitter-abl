const aggregate = require("./aggregate");
const atPhrase = require("./at");
const colorPhrase = require("./color");
const comboBoxPhrase = require("./combo-box");
const sizePhrase = require("./size");
const editingPhrase = require("./editing");
const editorPhrase = require("./editor");
const formatPhrase = require("./format");
const framePhrase = require("./frame");
const imagePhrase = require("./image");
const onEndkeyPhrase = require("./on-endkey");
const onErrorPhrase = require("./on-error");
const onQuitPhrase = require("./on-quit");
const onStopPhrase = require("./on-stop");
const preselectPhrase = require("./preselect");
const queryTuningPhrase = require("./query-tuning");
const radioSetPhrase = require("./radio-set");
const recordPhrase = require("./record");
const selectionListPhrase = require("./selection-list");
const sliderPhrase = require("./slider");
const stopAfterPhrase = require("./stop-after");
const widgetPhrase = require("./widget");
const assignPhrase = require("./assign");
const triggerPhrase = require("./trigger");
const inWindowPhrase = require("./in-window");
const viewAsPhrase = require("./view-as");

module.exports = (ctx) => ({
  ...assignPhrase(ctx),
  ...aggregate(ctx),
  ...triggerPhrase(ctx),
  ...inWindowPhrase(ctx),
  ...atPhrase(ctx),
  ...colorPhrase(ctx),
  ...comboBoxPhrase(ctx),
  ...editingPhrase(ctx),
  ...editorPhrase(ctx),
  ...formatPhrase(ctx),
  ...framePhrase(ctx),
  ...imagePhrase(ctx),
  ...preselectPhrase(ctx),
  ...queryTuningPhrase(ctx),
  ...radioSetPhrase(ctx),
  ...recordPhrase(ctx),
  ...selectionListPhrase(ctx),
  ...sliderPhrase(ctx),
  ...sizePhrase(ctx),
  ...onEndkeyPhrase(ctx),
  ...onErrorPhrase(ctx),
  ...onQuitPhrase(ctx),
  ...onStopPhrase(ctx),
  ...stopAfterPhrase(ctx),
  ...viewAsPhrase(ctx),
  ...widgetPhrase(ctx),
});
