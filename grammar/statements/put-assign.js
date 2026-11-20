export default ({ kw }) => ({
  put_assign_statement: ($) => seq($.__put_assign_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __put_assign_prefix: ($) =>
    seq(
      field(
        "type",
        // oxlint-disable-next-line tree-sitter-optimize/body-extraction
        choice(
          alias(kw("PUT-BYTE"), $.identifier),
          alias(kw("PUT-BYTES"), $.identifier),
          alias(kw("PUT-BITS"), $.identifier),
          alias(kw("PUT-SHORT"), $.identifier),
          alias(kw("PUT-LONG"), $.identifier),
          alias(kw("PUT-UNSIGNED-SHORT"), $.identifier),
          alias(kw("PUT-UNSIGNED-LONG"), $.identifier),
          alias(kw("PUT-INT64"), $.identifier),
          alias(kw("PUT-FLOAT"), $.identifier),
          alias(kw("PUT-DOUBLE"), $.identifier),
          alias(kw("PUT-STRING"), $.identifier),
        ),
      ),
      "(",
      field("buffer", $._expression),
      $._comma_position_length,
      $._close_equals_value,
    ),
});
