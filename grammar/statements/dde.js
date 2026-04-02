module.exports = ({ kw }) => ({
  dde_statement: ($) =>
    seq(
      kw("DDE"),
      choice(
        $.__dde_advise_or_send_branch,
        $.__dde_execute_or_terminate_branch,
        $.__dde_get_or_request_branch,
        seq(field("action", alias(kw("INITIATE"), $.identifier)), $.__dde_initiate_body),
      ),
      $._no_error_terminator,
    ),

  __dde_advise_or_send_branch: ($) =>
    seq(
      field("action", choice(alias(kw("ADVISE"), $.identifier), alias(kw("SEND"), $.identifier))),
      field("ddeid", $._expression),
      choice(
        field("mode", alias(choice(kw("START"), kw("STOP")), $.identifier)),
        seq(kw("SOURCE"), field("source", $._expression)),
      ),
      $.__dde_item_time_body,
    ),
  __dde_execute_or_terminate_branch: ($) =>
    seq(
      field(
        "action",
        choice(alias(kw("EXECUTE"), $.identifier), alias(kw("TERMINATE"), $.identifier)),
      ),
      field("ddeid", $._expression),
      optional(seq(kw("COMMAND"), field("command", $._expression), optional($.__dde_time_phrase))),
    ),
  __dde_get_or_request_branch: ($) =>
    seq(
      field("action", choice(alias(kw("GET"), $.identifier), alias(kw("REQUEST"), $.identifier))),
      $.__dde_target_item_body,
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
  __dde_target_item_body: ($) =>
    seq(
      field("ddeid", $._expression),
      kw("TARGET"),
      field("target", $._assignable),
      $.__dde_item_time_body,
    ),
  __dde_item_time_body: ($) =>
    seq(kw("ITEM"), field("item", $._expression), optional($.__dde_time_phrase)),
  __dde_time_phrase: ($) => seq(kw("TIME"), field("time", $._expression)),
});
