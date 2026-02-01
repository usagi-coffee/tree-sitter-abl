module.exports = ({ kw }) => ({
  finally_statement: ($) => seq(kw("FINALLY"), $.__finally_body, $._terminator),

  __finally_body: ($) => seq($.body, kw("END"), optional(kw("FINALLY"))),
});
