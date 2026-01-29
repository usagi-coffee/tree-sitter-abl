module.exports = ({ tkw }) => ({
  overlay_statement: ($) =>
    seq(tkw("OVERLAY"), $.__overlay_body, $._terminator),

  __overlay_body: ($) =>
    seq(
      "(",
      field("target", $._expression),
      ",",
      field("position", $._expression),
      optional(
        seq(
          ",",
          field("length", $._expression),
          optional(seq(",", field("type", $._expression))),
        ),
      ),
      ")",
      "=",
      field("value", $._expression),
    ),
});
