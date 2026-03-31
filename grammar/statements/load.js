module.exports = ({ kw }) => ({
  load_statement: ($) => seq(kw("LOAD"), $.__load_body, $._no_error_terminator),

  __load_body: ($) =>
    seq(
      field("file", $._expression),
      optional(seq(kw("DIR"), field("dir", $._expression))),
      optional(seq(kw("APPLICATION"), field("app", $._expression))),
      optional(alias(kw("NEW"), $.new)),
      optional(seq(kw("BASE-KEY"), field("base_key", $._expression))),
    ),
});
