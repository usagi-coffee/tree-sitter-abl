module.exports = ({ kw }) => ({
  overlay_statement: ($) => seq(kw("OVERLAY"), $.__overlay_body, $._terminator),

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
