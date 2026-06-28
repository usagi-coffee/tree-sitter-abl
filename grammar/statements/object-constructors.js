module.exports = ({ kw }) => ({
  dynamic_new_statement: ($) => seq($.__dynamic_new_prefix, $._no_error_terminator),

  __dynamic_new_prefix: ($) =>
    seq(
      field("target", $._assignable),
      "=",
      kw("DYNAMIC-NEW"),
      field("class", $._expression),
      $.arguments,
    ),

  this_object_statement: ($) => seq(kw("THIS-OBJECT"), optional($.arguments), $._terminator),

  super_statement: ($) => seq(kw("SUPER"), optional($.arguments), $._terminator),
});
