module.exports = ({ kw }) => ({
  dde_statement: ($) =>
    seq(
      kw("DDE"),
      choice(
        seq(
          field("action", alias(kw("ADVISE"), $.identifier)),
          $.__dde_advise_body,
        ),
        seq(
          field("action", alias(kw("EXECUTE"), $.identifier)),
          $.__dde_execute_body,
        ),
        seq(field("action", alias(kw("GET"), $.identifier)), $.__dde_get_body),
        seq(
          field("action", alias(kw("INITIATE"), $.identifier)),
          $.__dde_initiate_body,
        ),
        seq(
          field("action", alias(kw("REQUEST"), $.identifier)),
          $.__dde_request_body,
        ),
        seq(
          field("action", alias(kw("SEND"), $.identifier)),
          $.__dde_send_body,
        ),
        seq(
          field("action", alias(kw("TERMINATE"), $.identifier)),
          $.__dde_terminate_body,
        ),
      ),
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),

  __dde_advise_body: ($) =>
    seq(
      field("ddeid", $._expression),
      field("mode", alias(choice(kw("START"), kw("STOP")), $.identifier)),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
    ),
  __dde_execute_body: ($) =>
    seq(
      field("ddeid", $._expression),
      kw("COMMAND"),
      field("command", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
    ),
  __dde_get_body: ($) =>
    seq(
      field("ddeid", $._expression),
      kw("TARGET"),
      field("target", $._assignable),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
    ),
  __dde_initiate_body: ($) =>
    seq(
      field("ddeid", $._expression),
      kw("FRAME"),
      field("frame", $.identifier),
      kw("APPLICATION"),
      field("application", $._expression),
      kw("TOPIC"),
      field("topic", $._expression),
    ),
  __dde_request_body: ($) =>
    seq(
      field("ddeid", $._expression),
      kw("TARGET"),
      field("target", $._assignable),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
    ),
  __dde_send_body: ($) =>
    seq(
      field("ddeid", $._expression),
      kw("SOURCE"),
      field("source", $._expression),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
    ),
  __dde_terminate_body: ($) => seq(field("ddeid", $._expression)),
});
