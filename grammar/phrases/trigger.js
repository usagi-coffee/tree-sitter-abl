export default ({ kw }) => ({
  trigger_phrase: ($) =>
    choice(seq(kw("TRIGGERS"), $.__triggers_body), seq(kw("ON"), $.__trigger_event_list)),

  __triggers_body: ($) =>
    prec.right(seq(":", repeat1($.__trigger_block), kw("END"), optional(kw("TRIGGERS")))),

  __trigger_block: ($) =>
    seq(
      kw("ON"),
      field("event", $.__trigger_event_list),
      optional(alias(kw("ANYWHERE"), $.anywhere)),
      choice(alias(seq(kw("DO"), $.__trigger_body_tail), $.trigger_body), $.__persistent_trigger),
    ),

  __trigger_event_list: ($) => seq($._events, repeat(seq(",", $._events))),

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
        optional(
          choice(seq($.__trigger_down_phrase, $.__trigger_body_block), $.__trigger_body_block),
        ),
      ),
      seq($.__trigger_down_phrase, $.__trigger_body_block),
      $.__trigger_body_block,
    ),
  __trigger_body_block: ($) => seq(":", repeat($._statement), kw("END"), "."),
  __trigger_down_phrase: ($) =>
    seq(kw("DOWN"), optional(kw("TO")), optional(field("down", $._expression))),

  __persistent_trigger: ($) =>
    seq(
      kw("PERSISTENT"),
      kw("RUN"),
      field("procedure", $._expression),
      optional(seq(kw("IN"), field("handle", $._expression))),
      optional(seq("(", field("parameters", $._expressions), ")")),
    ),
});
