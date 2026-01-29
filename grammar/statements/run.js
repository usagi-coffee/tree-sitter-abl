module.exports = ({ kw, tkw }) => ({
  procedure_name: ($) => /[A-Za-z0-9_\/.-]+\.p/i,

  run_statement: ($) => seq(kw("RUN"), $.__run_body, $._terminator),

  __run_body: ($) =>
    seq(
      field("procedure", $._run_target),
      optional($.arguments),
      optional(tkw("NO-ERROR")),
    ),

  _run_target: ($) => choice($.procedure_name, $.identifier, $.qualified_name),
});
