module.exports = ({ kw }) => ({
  os_copy_statement: ($) => seq(kw("OS-COPY"), $.__os_copy_body, $._terminator),

  __os_copy_body: ($) => seq(field("source", $.__os_filename), field("target", $.__os_filename)),
  __os_filename: ($) => choice($.string_literal, $._identifier_or_access_or_call),
});
