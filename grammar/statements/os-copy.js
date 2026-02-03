module.exports = ({ kw }) => ({
  os_copy_statement: ($) => seq(kw("OS-COPY"), $.__os_copy_body, $._terminator),

  __os_copy_body: ($) =>
    seq(
      field("source", $.__os_copy_filename),
      field("target", $.__os_copy_filename),
    ),

  __os_copy_filename: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_qualified_name,
      $.function_call,
      $.object_access,
    ),
});
