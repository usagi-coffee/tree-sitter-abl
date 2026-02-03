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
      kw("PUT-BYTE"),
      kw("PUT-BYTES"),
      kw("PUT-BITS"),
      kw("PUT-SHORT"),
      kw("PUT-LONG"),
      kw("PUT-UNSIGNED-SHORT"),
      kw("PUT-UNSIGNED-LONG"),
      kw("PUT-INT64"),
      kw("PUT-FLOAT"),
      kw("PUT-DOUBLE"),
      kw("PUT-STRING"),
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
