module.exports = ({ kw }) => ({
  put_assign_statement: ($) =>
    seq(
      field("type", $.__put_assign_type),
      $.__put_assign_args,
      "=",
      field("value", $._expression),
      $._terminator,
    ),

  __put_assign_type: ($) =>
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
  __put_assign_args: ($) =>
    seq(
      "(",
      field("buffer", $._expression),
      ",",
      field("position", $._expression),
      optional(seq(",", field("length", $._expression))),
      ")",
    ),
});
