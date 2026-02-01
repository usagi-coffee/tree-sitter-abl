module.exports = ({ kw }) => ({
  os_create_dir_statement: ($) =>
    seq(
      kw("OS-CREATE-DIR"),
      repeat1(field("directory", $._expression)),
      $._terminator,
    ),
});
