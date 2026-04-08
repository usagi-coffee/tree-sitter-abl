// Non-core statement-specific shared rules

module.exports = ({ kw }) => ({
  _as_like: ($) =>
    choice(
      seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
      seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
    ),

  _in_widget_pool: ($) => seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier)),

  _except_fields: ($) => seq(kw("EXCEPT"), repeat1(field("except", $.identifier))),

  _map_entry: ($) => $._identifier_or_string_literal,

  _menu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          $._aggregate_label_phrase,
          alias(kw("DISABLED"), $.disabled),
          seq(kw("ACCELERATOR"), field("accelerator", $.string_literal)),
        ),
      ),
    ),

  _menu_submenu: ($) =>
    seq(
      kw("SUB-MENU"),
      field("name", $.identifier),
      optional(alias(kw("DISABLED"), $.disabled)),
      optional($._aggregate_label_phrase),
    ),

  __up_down_count_frame: ($) =>
    choice(seq(field("count", $._expression), optional($.frame_phrase)), $.frame_phrase),

  _like_phrase: ($) => seq(kw("LIKE"), $.__temp_table_like_body),

  _stream_phrase: ($) =>
    seq(choice(kw("STREAM"), kw("STREAM-HANDLE")), field("stream", $.identifier)),

  _for_phrase: ($) =>
    seq(
      kw("FOR"),
      seq(
        field("record", $._identifier_or_qualified_name),
        repeat(seq(",", field("record", $._identifier_or_qualified_name))),
      ),
    ),

  _loop_phrase: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),

  _convert_phrase: ($) =>
    choice(
      alias(kw("NO-CONVERT"), $.no_convert),
      seq(
        kw("CONVERT"),
        repeat(
          choice(
            seq(kw("TARGET"), field("target", $.string_literal)),
            seq(kw("SOURCE"), field("source", $.string_literal)),
          ),
        ),
      ),
    ),

  _echo_phrase: ($) => choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo)),

  _lob_dir_phrase: ($) =>
    seq(kw("LOB-DIR"), field("directory", choice($.preprocessor_name, $._value_expression))),

  _skip_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SKIP"), "(", field("skip", $._expression), ")")),
      prec(-1, seq(kw("SKIP"))),
    ),

  _space_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SPACE"), "(", field("space", $._expression), ")")),
      prec(-1, seq(kw("SPACE"))),
    ),

  _table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias(kw("NO-UNDO"), $.no_undo)),
      repeat($.__temp_table_serializable_option),
      optional(alias(kw("REFERENCE-ONLY"), $.reference_only)),
      repeat(
        choice(
          $.argument_reference,
          alias($._like_phrase, $.like_phrase),
          alias($.__temp_table_like_sequential_phrase, $.like_sequential_phrase),
          alias(kw("RCODE-INFORMATION"), $.rcode_information),
          alias($.__temp_table_before_table_phrase, $.before_table_phrase),
        ),
      ),
    ),

  _table_field: ($) =>
    seq(
      kw("FIELDS", { alias: "FIELD", offset: 5 }),
      field("name", $.identifier),
      choice(
        seq(kw("AS"), field("type", $._type_name)),
        $.__temp_table_like_type_clause,
        seq($.__temp_table_extent_option, $.__temp_table_like_type_clause),
      ),
      repeat($.__temp_table_field_option),
    ),

  _table_index: ($) =>
    seq(
      kw("INDEX"),
      field("name", $.identifier),
      optional(seq(choice(kw("AS"), kw("IS")), repeat($.__temp_table_index_modifier))),
      repeat1($.__temp_table_index_field),
    ),

  _dataset_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat($.__dataset_serializable_option),
      optional(alias(kw("SERIALIZE-HIDDEN"), $.serialize_hidden)),
      optional(alias(kw("REFERENCE-ONLY"), $.reference_only)),
      optional(
        seq(
          kw("FOR"),
          field("table", $.identifier),
          repeat(seq(",", field("table", $.identifier))),
        ),
      ),
      repeat(alias($.__dataset_data_relation, $.data_relation)),
      repeat(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
    ),

  _event_body: ($) =>
    seq(field("name", $.identifier), optional(alias($.__event_signature, $.signature))),

  _up_down_tail: ($) =>
    choice(seq($._stream_phrase, optional($.__up_down_count_frame)), $.__up_down_count_frame),

  _unbuffered_convert_tail: ($) =>
    choice(
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($._convert_phrase, $.convert_phrase)),
      ),
      alias($._convert_phrase, $.convert_phrase),
    ),

  _aggregate_label_phrase: ($) => seq(kw("LABEL"), field("label", $.string_literal)),

  _format_string: ($) => seq(kw("FORMAT", { offset: 4 }), field("format", $.string_literal)),
});
