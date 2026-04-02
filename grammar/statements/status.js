module.exports = ({ kw }) => ({
  status_statement: ($) => seq(kw("STATUS"), $.__status_body, $._terminator),

  __status_body: ($) =>
    seq(choice($.__status_default_body, $.__status_input_body), optional($.in_window_phrase)),

  __status_default_body: ($) => seq(kw("DEFAULT"), optional(field("message", $._expression))),

  __status_input_body: ($) =>
    seq(kw("INPUT"), optional(choice(kw("OFF"), field("message", $._expression)))),
});
