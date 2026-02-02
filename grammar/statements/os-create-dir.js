module.exports = ({ kw }) => ({
  os_create_dir_statement: ($) =>
    seq(
      kw("OS-CREATE-DIR"),
      repeat1($.__os_create_dir_directory),
      $._terminator,
    ),

  __os_create_dir_directory: ($) => field("directory", $._expression),
});
