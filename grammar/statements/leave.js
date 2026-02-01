module.exports = ({ kw }) => ({
  leave_statement: ($) =>
    seq(kw("LEAVE"), optional(field("label", $.identifier)), $._terminator),
});
