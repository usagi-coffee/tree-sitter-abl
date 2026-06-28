module.exports = ({ kw }) => ({
  os_copy_statement: ($) => seq($.__os_copy_prefix, $._terminator),

  __os_copy_prefix: ($) => seq(kw("OS-COPY"), $.__os_copy_body),
  __os_copy_body: ($) => seq(field("source", $._os_filename), field("target", $._os_filename)),
});
