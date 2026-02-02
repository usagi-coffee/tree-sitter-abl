module.exports = ({ kw }) => ({
  os_delete_statement: ($) =>
    seq(kw("OS-DELETE"), $.__os_delete_body, $._terminator),

  __os_delete_body: ($) =>
    seq(repeat1($.__os_delete_target), optional(kw("RECURSIVE"))),

  __os_delete_target: ($) =>
    choice($._expression, seq(kw("VALUE"), "(", $._expression, ")")),
});
