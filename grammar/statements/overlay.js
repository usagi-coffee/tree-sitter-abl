module.exports = ({ kw }) => ({
  overlay_statement: ($) => seq($.__overlay_prefix, $._terminator),

  __overlay_prefix: ($) => seq(kw("OVERLAY"), $.__overlay_body),
  __overlay_body: ($) =>
    seq(
      "(",
      field("target", $._expression),
      ",",
      field("position", $._expression),
      optional(
        seq(",", field("length", $._expression), optional(seq(",", field("type", $._expression)))),
      ),
      ")",
      "=",
      field("value", $._expression),
    ),
});
