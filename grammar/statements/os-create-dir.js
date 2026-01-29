module.exports = ({ kw, tkw }) => ({
  os_create_dir_statement: ($) =>
    seq(
      tkw("OS-CREATE-DIR"),
      repeat1(field("directory", $._expression)),
      $._terminator,
    ),
});
