module.exports = ({ kw, tkw }) => ({
  trigger_phrase: ($) =>
    choice(
      prec.right(1,
        seq(
          tkw("TRIGGERS"),
          ":",
          repeat1($.__trigger_block),
          kw("END"),
          optional(tkw("TRIGGERS")),
        ),
      ),
      seq(kw("ON"), $.__trigger_event_list),
    ),

  __trigger_block: ($) =>
    seq(
      kw("ON"),
      field("event", $.__trigger_event_list),
      optional(tkw("ANYWHERE")),
      choice(
        alias($.__trigger_body, $.trigger_body),
        $.__persistent_trigger,
      ),
    ),

  __trigger_event_list: ($) =>
    seq($.identifier, repeat(seq(",", $.identifier))),

  __trigger_body: ($) =>
    seq(
      tkw("DO"),
      optional(seq(field("variable", $.identifier), "=", field("start", $._expression), kw("TO"), field("end", $._expression))),
      optional(seq(kw("DOWN"), optional(kw("TO")), optional($._expression))),
      ":",
      repeat($._statement),
      tkw("END"),
      ".",
    ),

  __persistent_trigger: ($) =>
    seq(
      tkw("PERSISTENT"),
      kw("RUN"),
      field("procedure", $._expression),
      optional(seq(kw("IN"), field("handle", $._expression))),
      optional(seq("(", field("parameters", $._expressions), ")")),
    ),
});
