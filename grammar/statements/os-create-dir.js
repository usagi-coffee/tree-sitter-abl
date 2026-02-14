module.exports = ({ kw }) => ({
  os_create_dir_statement: ($) =>
    seq(
      kw("OS-CREATE-DIR"),
      repeat1($.__os_create_dir_directory),
      $._terminator,
    ),

  __os_create_dir_directory: ($) =>
    field("directory", $.__os_create_dir_name),

  __os_create_dir_name: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_access_or_call,
    ),
});
