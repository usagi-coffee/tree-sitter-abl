module.exports = ({ kw }) => ({
  load_picture_statement: ($) =>
    seq(
      kw("LOAD-PICTURE"),
      optional(field("image", $._expression)),
      $._terminator,
    ),
});
