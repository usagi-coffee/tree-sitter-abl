export default ({ kw }) => ({
  connect_statement: ($) => seq($.__connect_prefix, $._no_error_terminator),
  __connect_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_connect,
      optional(field("database", choice($.identifier, $.string_literal, $.function_call))),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        seq(
          "-",
          field("parameter", alias(token.immediate(/[A-Za-z0-9_]+/), $.identifier)),
          optional(field("value", choice($.identifier, $.string_literal, $.number_literal))),
        ),
      ),
    ),
});
