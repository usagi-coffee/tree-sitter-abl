module.exports = ({ kw, tkw }) => ({
  assign_statement: ($) => seq($.assign_phrase, $._terminator),

  __assign_when_available_phrase: ($) =>
    seq(kw("WHEN"), kw("AVAILABLE"), $.__assign_record_name),
  __assign_record_name: ($) => choice($.identifier, $.qualified_name),
  __assignment_no_error: ($) => tkw("NO-ERROR"),
  __assignment_in_frame: ($) =>
    seq(kw("IN"), kw("FRAME"), field("frame", $.identifier)),
});
