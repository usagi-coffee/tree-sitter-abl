module.exports = ({ tkw }) => ({
  leave_statement: ($) =>
    seq(tkw("LEAVE"), optional(field("label", $.identifier)), $._terminator),
});
