module.exports = ({ kw }) => ({
  put_assign_statement: ($) => seq(
    field("type", $.__put_assign_type),
    choice($.__put_assign_args_2, $.__put_assign_args_3),
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
  __put_assign_args_2: ($) =>
    seq(
      "(",
      field("buffer", $._expression),
      ",",
      field("position", $._expression),
      ")",
    ),
  __put_assign_args_3: ($) =>
    seq(
      "(",
      field("buffer", $._expression),
      ",",
      field("position", $._expression),
      ",",
      field("length", $._expression),
      ")",
    ),
});
