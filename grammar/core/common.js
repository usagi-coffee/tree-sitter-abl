// Non-core statement-specific shared rules

export default ({ kw }) => ({
  _width_by: ($) => seq(field("width", $.number_literal), $._by_keyword),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _inner_chars_value: ($) => seq(kw("INNER-CHARS"), field("inner_chars", $.number_literal)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _key_section: ($) => seq(kw("SECTION"), field("section", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _key_value: ($) => seq(kw("VALUE"), field("value", $._expression)),
  _for_tenant: ($) => seq($._for_keyword, kw("TENANT"), field("tenant", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _table_handle_value: ($) => seq(kw("TABLE-HANDLE"), field("table_handle", $.identifier)),
  _set_update_record_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("record", $._identifier_or_qualified_name),
      optional($._except_fields),
      optional($.frame_phrase),
    ),
  _alignment: ($) => choice(kw("COLON-ALIGNED"), kw("LEFT-ALIGNED"), kw("RIGHT-ALIGNED")),
  _class_type: ($) => seq(optional(kw("CLASS")), field("type", $._type_or_string)),
  _as_like: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/optional-modifier-field, tree-sitter-optimize/sequence-subset
      seq($._as_keyword, optional(kw("CLASS")), field("type", $._type_or_string)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._like_keyword, field("like", $._identifier_or_qualified_name)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _as_type_name_phrase: ($) => seq($._as_keyword, field("type", $._type_name)),
  _input_field: ($) => choice($._identifier_or_qualified_name, $.object_access, $.array_access),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _in_widget_pool: ($) =>
    seq(
      $._in_keyword,
      kw("WIDGET-POOL"),
      field(
        "pool",
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice
        choice($.identifier, $.string_literal),
      ),
    ),
  _handle_in_widget_pool: ($) =>
    seq(field("handle", $._identifier_or_array_access), optional($._in_widget_pool)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _except_fields: ($) => seq(kw("EXCEPT"), $._except_field_names),
  _field_names: ($) =>
    seq($._identifier_or_qualified_name, optional(seq(optional(","), $._field_names))),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _query_name_phrase: ($) => seq(kw("QUERY"), field("query", $.identifier)),
  _field_references: ($) =>
    prec.right(seq(field("field", $._identifier_or_qualified_name), optional($._field_references))),
  _expression_list: ($) => prec.right(seq($._expression, optional($._expression_list))),
  _except_field_names: ($) =>
    prec.right(seq(field("except", $.identifier), optional($._except_field_names))),
  _except_name_list: ($) =>
    prec.right(
      seq(field("except", $._identifier_or_qualified_name), optional($._except_name_list)),
    ),
  _import_export_except_names: ($) =>
    prec.right(seq($._identifier_or_qualified_name, optional($._import_export_except_names))),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _initial_phrase: ($) => seq(kw("INITIAL", { offset: 4 }), field("initial", $._initial_value)),
  _frame_phrases: ($) => seq($.frame_phrase, optional($.frame_phrase)),
  // VIEW and HIDE are the only users, and both admit a trailing IN WINDOW that
  // the shared widget_phrase cannot be told apart from IN FRAME with a single
  // token of lookahead, hence the statement-local variant.
  _widget_phrases: ($) =>
    prec.right(
      seq(alias($.__view_hide_widget_phrase, $.widget_phrase), optional($._widget_phrases)),
    ),
  _format_phrases: ($) => prec.right(seq($.format_phrase, optional($._format_phrases))),
  _text_fields: ($) =>
    prec.right(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("field", $._identifier_or_qualified_name),
        optional($.format_phrase),
        optional($._text_fields),
      ),
    ),
  _selection_after_for: ($) =>
    choice(seq($.preselect_phrase, optional($.query_tuning_phrase)), $.query_tuning_phrase),
  _index_prefix: ($) => seq("[", field("index", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-closing-delimiter-inline
  _parenthesized_value: ($) => seq($._parenthesized_expression_prefix, ")"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _map_phrase: ($) =>
    choice(
      seq(kw("MAP"), field("map", $._identifier_or_string_literal)),
      alias(kw("NO-MAP"), $.no_map),
    ),

  _aliased_menu_item: ($) => alias($._menu_item, $.menu_item),
  _menu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
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
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("SUB-MENU"),
      field("name", $.identifier),
      optional(alias(kw("DISABLED"), $.disabled)),
      optional($._aggregate_label_phrase),
    ),
  _frame_browse_menu_widget: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
      seq(kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("BROWSE"), field("browse", $.__widget_name)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/shared-choice
      seq(choice(kw("MENU"), kw("SUB-MENU")), field("menu", $.__widget_name)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/shared-keyword-field-inline, tree-sitter-optimize/inline-keyword-owner
  _frame_identifier_phrase: ($) => seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier)),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  _color_font_option: ($) =>
    prec(
      "color_font_value",
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("DCOLOR"), field("dcolor", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("FONT"), field("font", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
      ),
    ),
  _record_or_parenthesized_record: ($) =>
    choice($._identifier_or_qualified_name, seq($.__record_operand_opener, ")")),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __record_operand_opener: ($) => seq("(", $._identifier_or_qualified_name),
  _define_private_prefix: ($) =>
    seq($._define_keyword, optional(alias(kw("PRIVATE"), $.access_modifier))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _definition_scope_modifier: ($) =>
    choice(
      seq(alias($._new_keyword, $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  _buffer_query_modifier: ($) =>
    choice(
      $._definition_scope_modifier,
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
      seq(alias(kw("PRIVATE"), $.access_modifier), alias(kw("STATIC"), $.static_modifier)),
      seq(alias(kw("PROTECTED"), $.access_modifier), alias(kw("STATIC"), $.static_modifier)),
      seq(alias(kw("STATIC"), $.static_modifier), alias(kw("PRIVATE"), $.access_modifier)),
      seq(alias(kw("STATIC"), $.static_modifier), alias(kw("PROTECTED"), $.access_modifier)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-alias-choice-inline
  _serialization_modifier: ($) =>
    choice(
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-alias-choice-inline
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

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
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
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _loop_phrase_tail: ($) =>
    seq(
      "=",
      field("start", $._expression),
      $._to_keyword,
      field("end", $._expression),
      optional(seq($._by_keyword, field("step", $._expression))),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-closing-delimiter-inline
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

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _block_option: ($) =>
    choice(
      $.stop_after_phrase,
      $.on_endkey_phrase,
      $.on_stop_phrase,
      $.on_error_phrase,
      $.on_quit_phrase,
      $.frame_phrase,
    ),
  _block_options: ($) => prec.right(seq($._block_option, optional($._block_options))),

  _convert_phrase: ($) =>
    choice(alias(kw("NO-CONVERT"), $.no_convert), seq(kw("CONVERT"), optional($._convert_options))),

  _convert_options: ($) => prec.right(seq($._convert_option, optional($._convert_options))),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _convert_option: ($) =>
    choice(
      seq(kw("TARGET"), field("target", $._string_or_identifier_access_or_call)),
      seq(kw("SOURCE"), field("source", $._string_or_identifier_access_or_call)),
    ),

  _string_or_identifier_access_or_call: ($) =>
    choice($.string_literal, $._identifier_or_access_or_call),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _echo_phrase: ($) => choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo)),

  _lob_dir_phrase: ($) =>
    seq(kw("LOB-DIR"), field("directory", choice($.preprocessor_name, $._value_expression))),

  _skip_phrase: ($) => prec.right(choice(seq($.__skip_parenthesized_prefix, ")"), kw("SKIP"))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __skip_parenthesized_prefix: ($) => seq(kw("SKIP"), "(", field("skip", $._expression)),

  _space_phrase: ($) => prec.right(choice(seq($.__space_parenthesized_prefix, ")"), kw("SPACE"))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __space_parenthesized_prefix: ($) => seq(kw("SPACE"), "(", field("space", $._expression)),

  _table_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("name", $.identifier),
      optional(alias($._no_undo_keyword, $.no_undo)),
      optional($._table_body_tail),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-shared-choice-inline
  _table_body_tail: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/recurse
        repeat1(
          choice(
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $.string_literal)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq(kw("XML-NODE-NAME"), field("node", $.string_literal)),
            $.__temp_table_serialize_name_phrase,
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq(kw("XML-NODE-TYPE"), field("xml_node_type", $.string_literal)),
          ),
        ),
        optional(alias(kw("REFERENCE-ONLY"), $.reference_only)),
        optional($._table_options),
      ),
      seq(alias(kw("REFERENCE-ONLY"), $.reference_only), optional($._table_options)),
      $._table_options,
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
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _table_field_type: ($) =>
    choice(
      $._as_type_name_phrase,
      $.__temp_table_like_type_clause,
      seq($.__temp_table_extent_option, $.__temp_table_like_type_clause),
    ),
  _table_field: ($) =>
    seq(
      kw("FIELDS", { alias: "FIELD", offset: 5 }),
      field("name", $.identifier),
      $._table_field_type,
      optional($._table_field_options),
    ),

  _table_field_options: ($) =>
    prec.right(seq($.__temp_table_field_option, optional($._table_field_options))),

  _temp_table_items: ($) =>
    prec.right(
      seq(
        choice(
          alias($._table_field, $.temp_table_field),
          alias($._table_index, $.temp_table_index),
        ),
        optional($._temp_table_items),
      ),
    ),

  _table_index: ($) =>
    seq(
      kw("INDEX"),
      field(
        "name",
        choice(
          $.identifier,
          $.qualified_name,
          $._unquoted_name_initial,
          alias($.__operator_name, $.identifier),
        ),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      optional(seq(choice($._as_keyword, kw("IS")), optional($.__temp_table_index_modifiers))),
      $.__temp_table_index_fields,
    ),
  __temp_table_index_modifiers: ($) =>
    prec.right(seq($.__temp_table_index_modifier, optional($.__temp_table_index_modifiers))),

  _dataset_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("name", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
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
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
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
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __dataset_for_phrase: ($) => seq($._for_keyword, $.__dataset_for_table_head),
  __dataset_for_table_head: ($) =>
    seq(field("table", $.identifier), optional(seq(",", $.__dataset_for_table_head))),

  _event_tail: ($) => seq(kw("EVENT"), $._event_body, $._terminator),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
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
      // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
      alias($._convert_phrase, $.convert_phrase),
    ),
  _map_unbuffered_convert_tail: ($) =>
    choice(seq($._map_phrase, optional($._unbuffered_convert_tail)), $._unbuffered_convert_tail),
  _echo_map_unbuffered_convert_tail: ($) =>
    choice(
      seq($._echo_phrase, optional($._map_unbuffered_convert_tail)),
      $._map_unbuffered_convert_tail,
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _aggregate_label_phrase: ($) => seq(kw("LABEL"), field("label", $.string_literal)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _initial_value: ($) => choice($._expression, seq($._array_initializer_prefix, "]")),
  _parameter_direction: ($) => choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT", { offset: 7 })),

  _alert_box_options: ($) =>
    choice(
      seq(alias($._alert_type, $.alert_type), optional($._alert_box_after_type)),
      $._alert_box_after_type,
    ),
  _alert_box_after_type: ($) =>
    choice(seq($._alert_buttons_phrase, optional($._alert_box_title)), $._alert_box_title),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _alert_box_title: ($) => seq(kw("TITLE"), field("title", $._alert_box_title_value)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _alert_box_title_value: ($) =>
    choice(
      $._string_or_identifier_access_or_call,
      alias($._alert_box_title_concatenation, $.binary_expression),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-precedence-sequence-inline
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
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
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
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/shared-keyword-field-inline
  _tooltip_phrase: ($) => seq(kw("TOOLTIP"), field("tooltip", $._expression)),
  _lock_option: ($) =>
    choice(
      alias(kw("SHARE-LOCK"), $.share_lock),
      alias(kw("EXCLUSIVE-LOCK"), $.exclusive_lock),
      alias(kw("NO-LOCK"), $.no_lock),
    ),
  _on_action_tail: ($) => seq(",", $._on_phrase_action),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _on_phrase_action: ($) => choice($._undo_lnr_target, $._on_phrase_return),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _undo_lnr_target: ($) =>
    choice(
      seq(kw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(kw("NEXT"), optional(field("next_label", $.identifier))),
      seq(kw("RETRY"), optional(field("retry_label", $.identifier))),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _on_phrase_return: ($) =>
    seq(
      kw("RETURN"),
      optional(
        choice($.__return_error_clause, kw("NO-APPLY"), field("return_value", $._expression)),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __return_error_clause: ($) => seq(kw("ERROR"), optional(field("error_value", $._expression))),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/shared-keyword-field-inline
  _when_phrase: ($) => seq(kw("WHEN"), field("when", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _equals_value: ($) => seq("=", field("value", $._expression)),
  _close_equals_value: ($) => seq(")", $._equals_value),
  _status: ($) => seq(field("status_var", $._identifier_or_qualified_name), "=", kw("PROC-STATUS")),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _position_length: ($) => seq(field("position", $._expression), optional($._comma_length)),
  _comma_position_length: ($) => seq(",", $._position_length),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _comma_length: ($) => seq(",", field("length", $._expression)),
  _method_header: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat($._method_modifier_no_abstract),
      $._method_definition_signature,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _method_definition_signature: ($) =>
    seq(
      $._method_return_type,
      field("name", $.identifier),
      alias($._method_parameters, $.parameters),
    ),
  _closed_body: ($) => seq($.body, $._end_keyword),
  _compound_body: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat($._statement),
      $._end_keyword,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-precedence-sequence-inline
  _display_space_phrase: ($) =>
    prec.left(
      seq(kw("SPACE"), optional(field("space", seq($._parenthesized_expression_prefix, ")")))),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _list_items_phrase: ($) => seq(kw("LIST-ITEMS"), field("items", $._list_item_values)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline
  _list_item_pairs_phrase: ($) => seq(kw("LIST-ITEM-PAIRS"), field("pairs", $._list_item_pairs)),
  _list_item_values: ($) => seq($._expression, optional(seq(",", $._list_item_values))),
  _list_item_pairs: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-comma-field
      seq(field("label", $._expression), ",", field("value", $._expression)),
      optional(seq(",", $._list_item_pairs)),
    ),
  _scrollbar_option: ($) =>
    choice(
      alias(kw("SCROLLBAR-HORIZONTAL"), $.scrollbar_horizontal),
      alias(kw("SCROLLBAR-VERTICAL"), $.scrollbar_vertical),
    ),
  _extent_phrase: ($) =>
    seq(
      kw("EXTENT"),
      optional(
        field("size", choice($.number_literal, $.preprocessor_name, $.identifier, $.null_literal)),
      ),
    ),
});
