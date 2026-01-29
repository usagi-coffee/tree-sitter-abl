module.exports = ({ kw, tkw }) => ({
  finally_statement: ($) =>
    seq(tkw("FINALLY"), $.__finally_body, $._terminator),

  __finally_body: ($) => seq($.body, tkw("END"), optional(tkw("FINALLY"))),
});
