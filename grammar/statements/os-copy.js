module.exports = ({ kw }) => ({
  os_copy_statement: ($) => seq(kw("OS-COPY"), $.__os_copy_body, $._terminator),

  __os_copy_body: ($) => seq(field("source", $._os_filename), field("target", $._os_filename)),
});
