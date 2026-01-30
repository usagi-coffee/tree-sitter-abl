module.exports = ({ kw }) => ({
  stop_after_phrase: ($) =>
    seq(kw("STOP-AFTER"), field("time", $._expression)),
});
