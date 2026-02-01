module.exports = ({ kw }) => ({
  os_copy_statement: ($) => seq(kw("OS-COPY"), $.__os_copy_body, $._terminator),

  __os_copy_body: ($) =>
    seq(field("source", $._expression), field("target", $._expression)),
});
