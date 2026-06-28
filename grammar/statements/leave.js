module.exports = ({ kw }) => ({
  leave_statement: ($) => seq($.__leave_prefix, $._terminator),

  __leave_prefix: ($) => seq(kw("LEAVE"), optional(field("label", $.identifier))),
});
