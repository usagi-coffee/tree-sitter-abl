module.exports = ({ kw }) => ({
  os_append_statement: ($) =>
    seq(kw("OS-APPEND"), $.__os_append_body, $._terminator),

  __os_append_body: ($) =>
    seq(
      field("source", $.__os_append_filename),
      field("target", $.__os_append_filename),
    ),

  __os_append_filename: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_access_or_call,
    ),
});
