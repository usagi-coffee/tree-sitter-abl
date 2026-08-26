// Non-core statement-specific shared rules

export default ({ kw }) => ({
  _alignment: ($) => choice(kw("COLON-ALIGNED"), kw("LEFT-ALIGNED"), kw("RIGHT-ALIGNED")),
  _as_like: ($) =>
    choice(
      seq($._as_keyword, optional(kw("CLASS")), field("type", $._type_or_string)),
      seq($._like_keyword, field("like", $._identifier_or_qualified_name)),
    ),

  _in_widget_pool: ($) =>
    seq($._in_keyword, kw("WIDGET-POOL"), field("pool", choice($.identifier, $.string_literal))),
  _handle_in_widget_pool: ($) =>
    seq(field("handle", $._identifier_or_array_access), optional($._in_widget_pool)),

  _except_fields: ($) => seq(kw("EXCEPT"), $._except_field_names),
  _except_field_names: ($) =>
    prec.right(seq(field("except", $.identifier), optional($._except_field_names))),
  _except_name_list: ($) =>
    prec.right(
      seq(field("except", $._identifier_or_qualified_name), optional($._except_name_list)),
    ),
  _frame_phrases: ($) => seq($.frame_phrase, optional($.frame_phrase)),
  _widget_phrases: ($) => prec.right(seq($.widget_phrase, optional($._widget_phrases))),
  _format_phrases: ($) => prec.right(seq($.format_phrase, optional($._format_phrases))),
  _text_fields: ($) =>
    prec.right(
      seq(
        field("field", $._identifier_or_qualified_name),
        optional($.format_phrase),
        optional($._text_fields),
      ),
    ),
  _selection_after_for: ($) =>
    choice(seq($.preselect_phrase, optional($.query_tuning_phrase)), $.query_tuning_phrase),
  _parenthesized_value: ($) => seq($._parenthesized_expression_prefix, ")"),
  _map_phrase: ($) =>
    choice(
      seq(kw("MAP"), field("map", $._identifier_or_string_literal)),
      alias(kw("NO-MAP"), $.no_map),
    ),

  _menu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          $._aggregate_label_phrase,
          alias(kw("DISABLED"), $.disabled),
          seq(kw("ACCELERATOR"), field("accelerator", $.string_literal)),
          alias(kw("READ-ONLY"), $.read_only),
          alias(kw("TOGGLE-BOX"), $.toggle_box),
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
  _frame_browse_menu_widget: ($) =>
    choice(
      seq(kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      seq(kw("BROWSE"), field("browse", $.__widget_name)),
      seq(choice(kw("MENU"), kw("SUB-MENU")), field("menu", $.__widget_name)),
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
    choice($._identifier_or_qualified_name, seq($.__record_operand_opener, ")")),
  __record_operand_opener: ($) => seq("(", $._identifier_or_qualified_name),
  _define_private_prefix: ($) =>
    seq($._define_keyword, optional(alias(kw("PRIVATE"), $.access_modifier))),
  _definition_scope_modifier: ($) =>
    choice(
      seq(alias($._new_keyword, $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
  _buffer_query_modifier: ($) =>
    choice(
      seq(alias($._new_keyword, $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
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

  _like_phrase: ($) => seq($._like_keyword, $.__temp_table_like_body),

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
      seq(alias(kw("SILENT"), $.silent), optional($._dos_unix_commands)),
      $._dos_unix_commands,
    ),
  _dos_unix_commands: ($) => prec.right(seq($._dos_unix_command, optional($._dos_unix_commands))),

  _for_phrase: ($) =>
    seq(
      $._for_keyword,
      seq(field("record", $._identifier_or_qualified_name), optional($._for_phrase_record_tail)),
    ),
  _for_phrase_record_tail: ($) =>
    seq(",", field("record", $._identifier_or_qualified_name), optional($._for_phrase_record_tail)),

  _loop_phrase: ($) =>
    seq(field("variable", choice($.identifier, $.macro_concatenated_name)), $._loop_phrase_tail),
  _loop_phrase_tail: ($) =>
    seq(
      "=",
      field("start", $._expression),
      $._to_keyword,
      field("end", $._expression),
      optional(seq($._by_keyword, field("step", $._expression))),
    ),

  _collate_body: ($) => seq($.__collate_prefix, ")"),
  __collate_prefix: ($) =>
    seq(
      kw("COLLATE"),
      "(",
      field("string", $._expression),
      ",",
      field("strength", $._expression),
      optional(seq(",", field("collation", $._expression))),
    ),

  _block_option: ($) =>
    choice(
      $.stop_after_phrase,
      $.on_endkey_phrase,
      $.on_stop_phrase,
      $.on_error_phrase,
      $.on_quit_phrase,
      $.frame_phrase,
    ),

  _convert_phrase: ($) =>
    choice(alias(kw("NO-CONVERT"), $.no_convert), seq(kw("CONVERT"), optional($._convert_options))),

  _convert_options: ($) =>
    prec.right(
      seq(
        choice(
          seq(kw("TARGET"), field("target", $._string_or_identifier_access_or_call)),
          seq(kw("SOURCE"), field("source", $._string_or_identifier_access_or_call)),
        ),
        optional($._convert_options),
      ),
    ),

  _string_or_identifier_access_or_call: ($) =>
    choice($.string_literal, $._identifier_or_access_or_call),

  _echo_phrase: ($) => choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo)),

  _lob_dir_phrase: ($) =>
    seq(kw("LOB-DIR"), field("directory", choice($.preprocessor_name, $._value_expression))),

  _skip_phrase: ($) =>
    prec.right(choice(seq(kw("SKIP"), "(", field("skip", $._expression), ")"), kw("SKIP"))),

  _space_phrase: ($) =>
    prec.right(choice(seq(kw("SPACE"), "(", field("space", $._expression), ")"), kw("SPACE"))),

  _table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($._no_undo_keyword, $.no_undo)),
      repeat(
        choice(
          seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
          seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $.string_literal)),
          seq(kw("XML-NODE-NAME"), field("node", $.string_literal)),
          $.__temp_table_serialize_name_phrase,
          seq(kw("XML-NODE-TYPE"), field("xml_node_type", $.string_literal)),
        ),
      ),
      optional(alias(kw("REFERENCE-ONLY"), $.reference_only)),
      optional($._table_options),
    ),

  _table_options: ($) =>
    prec.right(
      seq(
        choice(
          $.argument_reference,
          alias($._like_phrase, $.like_phrase),
          alias($.__temp_table_like_sequential_phrase, $.like_sequential_phrase),
          alias(kw("RCODE-INFORMATION", { offset: 10 }), $.rcode_information),
          alias($.__temp_table_before_table_phrase, $.before_table_phrase),
        ),
        optional($._table_options),
      ),
    ),

  _table_field: ($) =>
    seq(
      kw("FIELDS", { alias: "FIELD", offset: 5 }),
      field("name", $.identifier),
      choice(
        seq($._as_keyword, field("type", $._type_name)),
        $.__temp_table_like_type_clause,
        seq($.__temp_table_extent_option, $.__temp_table_like_type_clause),
      ),
      optional($._table_field_options),
    ),

  _table_field_options: ($) =>
    prec.right(seq($.__temp_table_field_option, optional($._table_field_options))),

  _table_index: ($) =>
    seq(
      kw("INDEX"),
      field(
        "name",
        choice(
          $.identifier,
          $.qualified_name,
          $._unquoted_name_initial,
          alias($.__operator_routine_name, $.identifier),
        ),
      ),
      optional(seq(choice($._as_keyword, kw("IS")), repeat($.__temp_table_index_modifier))),
      $.__temp_table_index_fields,
    ),

  _dataset_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("NAMESPACE-URI"), field("namespace_uri", $._expression)),
          seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $._expression)),
          seq(kw("XML-NODE-NAME"), field("xml_node_name", $._expression)),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $._expression)),
          seq(kw("XML-NODE-TYPE"), field("xml_node_type", $._expression)),
        ),
      ),
      optional($.__dataset_body_tail),
    ),
  __dataset_body_tail: ($) =>
    choice(
      seq(
        alias(kw("SERIALIZE-HIDDEN"), $.serialize_hidden),
        optional($.__dataset_body_after_serialize_hidden),
      ),
      $.__dataset_body_after_serialize_hidden,
    ),
  __dataset_body_after_serialize_hidden: ($) =>
    choice(
      seq(
        alias(kw("REFERENCE-ONLY"), $.reference_only),
        optional($.__dataset_body_after_reference_only),
      ),
      $.__dataset_body_after_reference_only,
    ),
  __dataset_body_after_reference_only: ($) =>
    choice(
      seq($.__dataset_for_phrase, optional($.__dataset_body_after_for)),
      $.__dataset_body_after_for,
    ),
  __dataset_body_after_for: ($) =>
    choice(
      seq($.__dataset_data_relations, optional($.__dataset_parent_id_relations)),
      $.__dataset_parent_id_relations,
    ),
  __dataset_data_relations: ($) =>
    prec.right(
      seq(alias($.__dataset_data_relation, $.data_relation), optional($.__dataset_data_relations)),
    ),
  __dataset_parent_id_relations: ($) =>
    prec.right(
      seq(
        alias($.__dataset_parent_id_relation, $.parent_id_relation),
        optional($.__dataset_parent_id_relations),
      ),
    ),
  __dataset_for_phrase: ($) =>
    seq($._for_keyword, field("table", $.identifier), optional($.__dataset_for_table_tail)),
  __dataset_for_table_tail: ($) =>
    seq(",", field("table", $.identifier), optional($.__dataset_for_table_tail)),

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
  _parameter_direction: ($) => choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT", { offset: 7 })),

  _alert_box_options: ($) =>
    choice(
      seq(alias($._alert_type, $.alert_type), optional($._alert_box_after_type)),
      $._alert_box_after_type,
    ),
  _alert_box_after_type: ($) =>
    choice(seq($._alert_buttons_phrase, optional($._alert_box_title)), $._alert_box_title),
  _alert_box_title: ($) => seq(kw("TITLE"), field("title", $._alert_box_title_value)),
  _alert_box_title_value: ($) =>
    choice(
      $._string_or_identifier_access_or_call,
      alias($._alert_box_title_concatenation, $.binary_expression),
    ),
  _alert_box_title_concatenation: ($) =>
    prec.right(
      1,
      seq($._string_or_identifier_access_or_call, $._alert_box_title_concatenation_tail),
    ),
  _alert_box_title_concatenation_tail: ($) =>
    prec.right(
      1,
      seq(
        "+",
        $._string_or_identifier_access_or_call,
        optional($._alert_box_title_concatenation_tail),
      ),
    ),
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

  _format_string: ($) =>
    seq(
      kw("FORMAT", { offset: 4 }),
      field(
        "format",
        choice($.string_literal, $.number_literal, alias($.__unquoted_format, $.format_picture)),
      ),
    ),
  __unquoted_format: ($) => token(/[0-9]+(?:\/[0-9]+)+/),
  _tooltip_phrase: ($) => seq(kw("TOOLTIP"), field("tooltip", $._expression)),
  _lock_option: ($) =>
    choice(
      alias(kw("SHARE-LOCK"), $.share_lock),
      alias(kw("EXCLUSIVE-LOCK"), $.exclusive_lock),
      alias(kw("NO-LOCK"), $.no_lock),
    ),
  _on_phrase_action: ($) => choice($._undo_lnr_target, $._on_phrase_return),
  _undo_lnr_target: ($) =>
    choice(
      seq(kw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(kw("NEXT"), optional(field("next_label", $.identifier))),
      seq(kw("RETRY"), optional(field("retry_label", $.identifier))),
    ),
  _on_phrase_return: ($) =>
    seq(
      kw("RETURN"),
      optional(
        choice(
          seq(kw("ERROR"), optional(field("error_value", $._expression))),
          kw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
  _when_phrase: ($) => seq(kw("WHEN"), field("when", $._expression)),
  _equals_value: ($) => seq("=", field("value", $._expression)),
  _display_space_phrase: ($) =>
    prec.left(
      seq(kw("SPACE"), optional(field("space", seq($._parenthesized_expression_prefix, ")")))),
    ),
  _list_items_phrase: ($) => seq(kw("LIST-ITEMS"), field("items", $._list_item_values)),
  _list_item_pairs_phrase: ($) => seq(kw("LIST-ITEM-PAIRS"), field("pairs", $._list_item_pairs)),
  _list_item_values: ($) => seq($._expression, optional($._list_item_values_tail)),
  _list_item_values_tail: ($) => seq(",", $._expression, optional($._list_item_values_tail)),
  _list_item_pairs: ($) => seq($._list_item_pair, optional($._list_item_pairs_tail)),
  _list_item_pairs_tail: ($) => seq(",", $._list_item_pair, optional($._list_item_pairs_tail)),
  _list_item_pair: ($) => seq(field("label", $._expression), ",", field("value", $._expression)),
  _scrollbar_option: ($) =>
    choice(
      alias(kw("SCROLLBAR-HORIZONTAL"), $.scrollbar_horizontal),
      alias(kw("SCROLLBAR-VERTICAL"), $.scrollbar_vertical),
    ),
  _extent_size: ($) => choice($.number_literal, $.preprocessor_name, $.identifier, $.null_literal),
  _extent_phrase: ($) => seq(kw("EXTENT"), optional(field("size", $._extent_size))),
});
