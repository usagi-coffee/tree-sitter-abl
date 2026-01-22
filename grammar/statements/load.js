module.exports = ({ kw, tkw }) => ({
  load_statement: ($) =>
    seq(
      tkw("LOAD"),
      field("file", $._expression),
      optional(seq(kw("DIR"), field("dir", $._expression))),
      optional(seq(kw("APPLICATION"), field("app", $._expression))),
      optional(tkw("NEW")),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
