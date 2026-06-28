module.exports = ({ kw }) => ({
  empty_temp_table_statement: ($) => seq($.__empty_temp_table_prefix, $._terminator),

  __empty_temp_table_prefix: ($) => seq(kw("EMPTY"), $.__empty_temp_table_body),
  __empty_temp_table_body: ($) =>
    seq(kw("TEMP-TABLE"), field("name", $.identifier), optional(alias(kw("NO-ERROR"), $.no_error))),
});
