module.exports = ({ kw }) => ({
  dynamic_new_statement: ($) =>
    seq(
      field("target", $._assignable),
      "=",
      kw("DYNAMIC-NEW"),
      field("class", $._expression),
      $.arguments,
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),

  this_object_statement: ($) =>
    seq(kw("THIS-OBJECT"), optional($.arguments), $._terminator),

  super_statement: ($) =>
    seq(kw("SUPER"), optional($.arguments), $._terminator),
});
