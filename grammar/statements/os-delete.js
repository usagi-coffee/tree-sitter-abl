module.exports = ({ kw }) => ({
  os_delete_statement: ($) =>
    seq(kw("OS-DELETE"), $.__os_delete_body, $._terminator),

  __os_delete_body: ($) =>
    seq(repeat1($.__os_delete_target), optional(alias(kw("RECURSIVE"), $.recursive))),

  __os_delete_target: ($) =>
    choice(
      $.__os_delete_filename,
      seq(kw("VALUE"), "(", field("value", $.__os_delete_filename), ")"),
    ),

  __os_delete_filename: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_qualified_name,
      $.function_call,
      $.object_access,
    ),
});
