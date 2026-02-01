module.exports = ({ kw }) => ({
  os_append_statement: ($) =>
    seq(kw("OS-APPEND"), $.__os_append_body, $._terminator),

  __os_append_body: ($) =>
    seq(field("source", $._expression), field("target", $._expression)),
});
