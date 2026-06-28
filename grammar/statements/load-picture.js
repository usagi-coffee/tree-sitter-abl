module.exports = ({ kw }) => ({
  load_picture_statement: ($) => seq($.__load_picture_prefix, $._terminator),

  __load_picture_prefix: ($) => seq(kw("LOAD-PICTURE"), optional(field("image", $._expression))),
});
