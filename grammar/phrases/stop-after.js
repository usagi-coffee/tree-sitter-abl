export default ({ kw }) => ({
  stop_after_phrase: ($) => seq(kw("STOP-AFTER"), field("time", $._expression)),
});
