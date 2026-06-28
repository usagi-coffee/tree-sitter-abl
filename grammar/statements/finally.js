module.exports = ({ kw }) => ({
  finally_statement: ($) => seq($.__finally_prefix, $._terminator),

  __finally_prefix: ($) => seq(kw("FINALLY"), $.__finally_body),
  __finally_body: ($) => seq($.body, kw("END"), optional(kw("FINALLY"))),
});
