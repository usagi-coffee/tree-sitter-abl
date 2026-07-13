// Non-core statement-specific shared rules

module.exports = ({ kw }) => ({
  _as_like: ($) =>
    choice(
      seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
      seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
    ),

  _in_widget_pool: ($) => seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier)),
  _handle_in_widget_pool: ($) => seq(field("handle", $.identifier), optional($._in_widget_pool)),

  _except_fields: ($) => seq(kw("EXCEPT"), repeat1(field("except", $.identifier))),
  _map_entry: ($) => $._identifier_or_string_literal,
  _map_phrase: ($) =>
    choice(seq(kw("MAP"), field("map", $._map_entry)), alias(kw("NO-MAP"), $.no_map)),

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
  _color_font_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
      seq(kw("DCOLOR"), field("dcolor", $._expression)),
      seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
      seq(kw("FONT"), field("font", $._expression)),
      seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
    ),
  _record_or_parenthesized_record: ($) =>
    choice($._identifier_or_qualified_name, seq("(", $._identifier_or_qualified_name, ")")),
  _define_private_prefix: ($) =>
    seq(kw("DEFINE", { offset: 3 }), optional(alias(kw("PRIVATE"), $.access_modifier))),
  _buffer_query_modifier: ($) =>
    choice(
      seq(alias(kw("NEW"), $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
      seq(alias(kw("PRIVATE"), $.access_modifier), alias(kw("STATIC"), $.static_modifier)),
      seq(alias(kw("PROTECTED"), $.access_modifier), alias(kw("STATIC"), $.static_modifier)),
      seq(alias(kw("STATIC"), $.static_modifier), alias(kw("PRIVATE"), $.access_modifier)),
      seq(alias(kw("STATIC"), $.static_modifier), alias(kw("PROTECTED"), $.access_modifier)),
    ),
  _serialization_modifier: ($) =>
    choice(
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),
  _member_access_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),

  __up_down_count_frame: ($) =>
    choice(seq(field("count", $._expression), optional($.frame_phrase)), $.frame_phrase),

  _like_phrase: ($) => seq(kw("LIKE"), $.__temp_table_like_body),

  _stream_phrase: ($) =>
    seq(choice(kw("STREAM"), kw("STREAM-HANDLE")), field("stream", $.identifier)),
  _input_stream_prefix: ($) => seq(kw("INPUT"), optional($._stream_phrase)),

  _dos_unix_command: ($) =>
    choice(
      field("command_token", $.identifier),
      field("command_token", $.string_literal),
      seq(kw("VALUE"), "(", field("command", $._expression), ")"),
    ),
  _dos_unix_tail: ($) =>
    choice(
      seq(alias(kw("SILENT"), $.silent), repeat($._dos_unix_command)),
      repeat1($._dos_unix_command),
    ),

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
      optional($.__dataset_body_tail),
    ),
  __dataset_body_tail: ($) =>
    choice(
      seq(
        alias(kw("SERIALIZE-HIDDEN"), $.serialize_hidden),
        optional($.__dataset_body_after_serialize_hidden),
      ),
      seq(
        alias(kw("REFERENCE-ONLY"), $.reference_only),
        optional($.__dataset_body_after_reference_only),
      ),
      seq($.__dataset_for_phrase, optional($.__dataset_body_after_for)),
      seq(
        repeat1(alias($.__dataset_data_relation, $.data_relation)),
        repeat(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
      ),
      repeat1(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
    ),
  __dataset_body_after_serialize_hidden: ($) =>
    choice(
      seq(
        alias(kw("REFERENCE-ONLY"), $.reference_only),
        optional($.__dataset_body_after_reference_only),
      ),
      seq($.__dataset_for_phrase, optional($.__dataset_body_after_for)),
      seq(
        repeat1(alias($.__dataset_data_relation, $.data_relation)),
        repeat(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
      ),
      repeat1(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
    ),
  __dataset_body_after_reference_only: ($) =>
    choice(
      seq($.__dataset_for_phrase, optional($.__dataset_body_after_for)),
      seq(
        repeat1(alias($.__dataset_data_relation, $.data_relation)),
        repeat(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
      ),
      repeat1(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
    ),
  __dataset_body_after_for: ($) =>
    choice(
      seq(
        repeat1(alias($.__dataset_data_relation, $.data_relation)),
        repeat(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
      ),
      repeat1(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
    ),
  __dataset_for_phrase: ($) =>
    seq(kw("FOR"), field("table", $.identifier), repeat(seq(",", field("table", $.identifier)))),

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
  _map_unbuffered_convert_tail: ($) =>
    choice(seq($._map_phrase, optional($._unbuffered_convert_tail)), $._unbuffered_convert_tail),
  _echo_map_unbuffered_convert_tail: ($) =>
    choice(
      seq($._echo_phrase, optional($._map_unbuffered_convert_tail)),
      $._map_unbuffered_convert_tail,
    ),

  _aggregate_label_phrase: ($) => seq(kw("LABEL"), field("label", $.string_literal)),
  _initial_value: ($) => choice($._expression, seq("[", optional($._expressions), "]")),
  _parameter_direction: ($) => choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT")),

  _alert_box_options: ($) =>
    choice(
      seq(alias($._alert_type, $.alert_type), optional($._alert_box_after_type)),
      seq($._alert_buttons_phrase, optional($._alert_box_title)),
      $._alert_box_title,
    ),
  _alert_box_after_type: ($) =>
    choice(seq($._alert_buttons_phrase, optional($._alert_box_title)), $._alert_box_title),
  _alert_box_title: ($) => seq(kw("TITLE"), field("title", $.string_literal)),
  _alert_type: ($) =>
    choice(
      kw("MESSAGE"),
      kw("QUESTION"),
      kw("INFORMATION"),
      kw("INFO"),
      kw("ERROR"),
      kw("WARNING"),
    ),
  _alert_buttons_phrase: ($) =>
    seq(
      kw("BUTTONS", { alias: "BUTTON", offset: 6 }),
      field(
        "buttons",
        choice(kw("YES-NO"), kw("YES-NO-CANCEL"), kw("OK-CANCEL"), kw("RETRY-CANCEL"), kw("OK")),
      ),
    ),

  _format_string: ($) => seq(kw("FORMAT", { offset: 4 }), field("format", $.string_literal)),
  _tooltip_phrase: ($) => seq(kw("TOOLTIP"), field("tooltip", $._expression)),
  _lock_option: ($) =>
    choice(
      alias(kw("SHARE-LOCK"), $.share_lock),
      alias(kw("EXCLUSIVE-LOCK"), $.exclusive_lock),
      alias(kw("NO-LOCK"), $.no_lock),
    ),
  _when_phrase: ($) => seq(kw("WHEN"), field("when", $._expression)),
  _list_items_phrase: ($) => seq(kw("LIST-ITEMS"), field("items", $._list_item_values)),
  _list_item_pairs_phrase: ($) => seq(kw("LIST-ITEM-PAIRS"), field("pairs", $._list_item_pairs)),
  _list_item_values: ($) => seq($._expression, repeat(seq(",", $._expression))),
  _list_item_pairs: ($) => seq($._list_item_pair, repeat(seq(",", $._list_item_pair))),
  _list_item_pair: ($) => seq(field("label", $._expression), ",", field("value", $._expression)),
  _scrollbar_option: ($) =>
    choice(
      alias(kw("SCROLLBAR-HORIZONTAL"), $.scrollbar_horizontal),
      alias(kw("SCROLLBAR-VERTICAL"), $.scrollbar_vertical),
    ),
  _extent_size: ($) => choice($.number_literal, $.preprocessor_name, $.identifier, $.null_literal),
  _extent_phrase: ($) => seq(kw("EXTENT"), optional(field("size", $._extent_size))),
});
