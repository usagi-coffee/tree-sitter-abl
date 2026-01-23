module.exports = ({ tkw }) => ({
  load_picture_statement: ($) =>
    seq(tkw("LOAD-PICTURE"), optional(field("image", $._expression)), $._terminator),
});
