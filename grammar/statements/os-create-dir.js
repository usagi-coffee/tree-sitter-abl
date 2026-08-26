export default ({ kw }) => ({
  os_create_dir_statement: ($) => seq($.__os_create_dir_prefix, $._terminator),

  __os_create_dir_prefix: ($) => seq(kw("OS-CREATE-DIR"), $.__os_create_dir_directories),

  __os_create_dir_directory: ($) => field("directory", $._string_or_identifier_access_or_call),
  __os_create_dir_directories: ($) =>
    prec.right(seq($.__os_create_dir_directory, optional($.__os_create_dir_directories))),
});
