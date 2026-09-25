export default ({ kw }) => ({
  overlay_statement: ($) => seq($.__overlay_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __overlay_prefix: ($) =>
    seq(
      $._kw_overlay,
      "(",
      field("target", $._expression),
      ",",
      field("position", $._expression),
      optional(seq($._comma_length, optional(seq(",", field("type", $._expression))))),
      $._close_equals_value,
    ),
});
