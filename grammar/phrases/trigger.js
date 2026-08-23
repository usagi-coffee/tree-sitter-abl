export default ({ kw }) => ({
  trigger_phrase: ($) =>
    choice(seq(kw("TRIGGERS"), $.__triggers_body), seq(kw("ON"), $.__trigger_event_list)),

  __triggers_body: ($) =>
    prec.right(
      seq(
        ":",
        repeat(
          seq(
            kw("ON"),
            field("event", $.__trigger_event_list),
            optional(alias(kw("ANYWHERE"), $.anywhere)),
            $.__trigger_action,
          ),
        ),
        kw("END"),
        optional(kw("TRIGGERS")),
      ),
    ),
  __trigger_action: ($) =>
    choice(alias(seq(kw("DO"), $.__trigger_body_tail), $.trigger_body), $.__persistent_trigger),

  __trigger_event_list: ($) => seq($._events, optional($.__trigger_event_list_tail)),
  __trigger_event_list_tail: ($) => seq(",", $._events, optional($.__trigger_event_list_tail)),

  __trigger_body_tail: ($) =>
    choice(
      seq(
        seq(
          field("variable", $.identifier),
          "=",
          field("start", $._expression),
          kw("TO"),
          field("end", $._expression),
        ),
        optional($.__trigger_body_after_loop),
      ),
      $.__trigger_body_after_loop,
    ),
  __trigger_body_after_loop: ($) =>
    choice(seq($.__trigger_down_phrase, $.__trigger_body_block), $.__trigger_body_block),
  __trigger_body_block: ($) => seq(":", repeat($._statement), kw("END"), "."),
  __trigger_down_phrase: ($) =>
    seq(kw("DOWN"), optional(kw("TO")), optional(field("down", $._expression))),

  __persistent_trigger: ($) =>
    seq(
      kw("PERSISTENT"),
      kw("RUN"),
      field("procedure", $.__persistent_trigger_procedure),
      optional($.__persistent_trigger_tail),
      optional($._terminator_dot),
    ),
  __persistent_trigger_procedure: ($) =>
    choice(
      $._identifier_or_qualified_name,
      $.string_literal,
      alias($._value_expression, $.value_expression),
    ),
  __persistent_trigger_tail: ($) =>
    choice(
      seq(kw("IN"), field("handle", $._expression), optional($.__persistent_trigger_parameters)),
      $.__persistent_trigger_parameters,
    ),
  __persistent_trigger_parameters: ($) => seq("(", field("parameters", $._expressions), ")"),
});
