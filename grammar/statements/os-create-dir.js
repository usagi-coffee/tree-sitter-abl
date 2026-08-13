export default ({ kw }) => ({
  os_create_dir_statement: ($) => seq($.__os_create_dir_prefix, $._terminator),

  __os_create_dir_prefix: ($) => seq(kw("OS-CREATE-DIR"), repeat1($.__os_create_dir_directory)),

  __os_create_dir_directory: ($) => field("directory", $._os_filename),
});
