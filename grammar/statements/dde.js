module.exports = ({ kw }) => ({
  dde_advise_statement: ($) =>
    seq(
      kw("DDE"),
      kw("ADVISE"),
      field("ddeid", $._expression),
      field("action", choice(kw("START"), kw("STOP"))),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  dde_execute_statement: ($) =>
    seq(
      kw("DDE"),
      kw("EXECUTE"),
      field("ddeid", $._expression),
      kw("COMMAND"),
      field("command", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  dde_get_statement: ($) =>
    seq(
      kw("DDE"),
      kw("GET"),
      field("ddeid", $._expression),
      kw("TARGET"),
      field("target", $._assignable),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  dde_initiate_statement: ($) =>
    seq(
      kw("DDE"),
      kw("INITIATE"),
      field("ddeid", $._expression),
      kw("FRAME"),
      field("frame", $.identifier),
      kw("APPLICATION"),
      field("application", $._expression),
      kw("TOPIC"),
      field("topic", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  dde_request_statement: ($) =>
    seq(
      kw("DDE"),
      kw("REQUEST"),
      field("ddeid", $._expression),
      kw("TARGET"),
      field("target", $._assignable),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  dde_send_statement: ($) =>
    seq(
      kw("DDE"),
      kw("SEND"),
      field("ddeid", $._expression),
      kw("SOURCE"),
      field("source", $._expression),
      kw("ITEM"),
      field("item", $._expression),
      optional(seq(kw("TIME"), field("time", $._expression))),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  dde_terminate_statement: ($) =>
    seq(
      kw("DDE"),
      kw("TERMINATE"),
      field("ddeid", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
