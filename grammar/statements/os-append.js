module.exports = ({ kw }) => ({
  os_append_statement: ($) => seq(kw("OS-APPEND"), $.__os_append_body, $._terminator),

  __os_append_body: ($) => seq(field("source", $._os_filename), field("target", $._os_filename)),
});
