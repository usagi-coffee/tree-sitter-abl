module.exports = ({ kw }) => ({
  unload_statement: ($) => seq(kw("UNLOAD"), $.__unload_body, $._terminator),
  __unload_body: ($) =>
    seq(field("file", $._expression), optional(alias(kw("NO-ERROR"), $.no_error))),
});
