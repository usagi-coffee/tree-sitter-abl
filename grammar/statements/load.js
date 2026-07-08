module.exports = ({ kw }) => ({
  load_statement: ($) => seq($.__load_prefix, $._no_error_terminator),

  __load_prefix: ($) =>
    seq(
      kw("LOAD"),
      field("file", $._expression),
      optional(seq(kw("DIR"), field("dir", $._expression))),
      optional(seq(kw("APPLICATION"), field("app", $._expression))),
      optional(alias(kw("NEW"), $.new)),
      optional(seq(kw("BASE-KEY"), field("base_key", $._expression))),
    ),
});
