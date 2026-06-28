module.exports = ({ kw }) => ({
  os_append_statement: ($) => seq($.__os_append_prefix, $._terminator),

  __os_append_prefix: ($) => seq(kw("OS-APPEND"), $.__os_append_body),
  __os_append_body: ($) => seq(field("source", $._os_filename), field("target", $._os_filename)),
});
