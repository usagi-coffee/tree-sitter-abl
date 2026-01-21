module.exports = ({ kw }) => ({
  procedure_name: ($) => /[A-Za-z0-9_\/.-]+\.p/i,

  run_statement: ($) =>
    seq(
      kw("RUN"),
      field("procedure", $._run_target),
      optional($.argument_list),
      $._terminator,
    ),

  _run_target: ($) => choice($.procedure_name, $.identifier, $.qualified_name),
});
