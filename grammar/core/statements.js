// Just an aggregator of statements

module.exports = ({ kw }) => ({
  _statement: ($) =>
    choice(
      // Special
      alias($.include_statement, $.include_file_reference),
      $.global_define_preprocessor_directive,
      $.scoped_define_preprocessor_directive,
      alias($.if_preprocessor_directive_statement, $.if_preprocessor_directive),
      $.message_preprocessor_directive,
      $.undefine_preprocessor_directive,
      $.empty_statement,
      $.annotation,

      // Definitions
      $.image_definition,
      $.browse_definition,
      $.frame_definition,
      $.class_definition,
      $.data_source_definition,
      $.query_definition,
      $.temp_table_definition,
      $.buffer_definition,
      $.variable_definition,
      $.menu_definition,
      $.function_definition,
      $.button_definition,
      $.work_table_definition,
      $.rectangle_definition,
      $.submenu_definition,
      $.workfile_definition,
      $.dataset_definition,
      $.procedure_definition,
      $.interface_definition,
      $.function_forward_definition,
      $.stream_definition,
      $.parameter_definition,

      // ABL Statements
      $.do_statement,
      $.input_statement,
      $.choose_statement,
      $.input_through_statement,
      $.open_query_statement,
      $.preselect_statement,
      $.buffer_compare_statement,
      $.for_statement,
      $.hide_statement,
      $.subscribe_statement,
      $.prompt_for_statement,
      $.pause_statement,
      $.repeat_statement,
      $.set_statement,
      $.enable_statement,
      $.output_statement,
      $.unsubscribe_statement,
      $.import_statement,
      $.insert_statement,
      $.reposition_statement,
      $.run_stored_procedure_statement,
      $.input_output_statement,
      $.put_screen_statement,
      $.save_cache_statement,
      $.overlay_statement,
      $.load_statement,
      $.put_statement,
      $.message_statement,
      $.wait_for_statement,
      $.view_statement,
      $.put_key_value_statement,
      $.update_statement,
      $.disable_statement,
      $.status_statement,
      $.color_statement,
      $.on_statement,
      $.if_statement,
      $.seek_statement,
      $.close_stored_procedure_statement,
      $.undo_statement,
      $.put_cursor_statement,
      $.case_statement,
      $.compile_statement,
      $.find_statement,
      $.raw_transfer_statement,
      $.export_statement,
      $.clear_statement,
      $.down_statement,
      $.up_statement,
      $.scroll_statement,
      $.get_key_value_statement,
      $.dos_statement,
      $.unix_statement,
      $.enum_statement,
      $.var_statement,
      $.aggregate_statement,
      $.copy_lob_statement,
      $.convert_statement,
      $.buffer_copy_statement,
      $.catch_statement,
      $.connect_statement,
      $.disable_triggers_statement,
      $.disconnect_statement,
      $.dde_statement,
      $.readkey_statement,
      $.os_command_statement,
      $.publish_statement,
      $.release_external_statement,
      $.get_statement,
      $.underline_statement,
      $.assign_statement,
      $.value_assignment_statement,
      $.error_scope_statement,
      $.release_object_statement,
      $.display_statement,
      $.apply_statement,
      $.fix_codepage_statement,
      $.set_byte_order_statement,
      $.set_pointer_value_statement,
      $.set_size_statement,
      $.system_help_statement,
      $.run_statement,
      $.accumulate_statement,
      $.call_statement,
      $.create_socket_statement,
      $.create_statement,
      $.delete_object_statement,
      $.delete_procedure_statement,
      $.delete_alias_statement,
      $.delete_widget_statement,
      $.delete_widget_pool_statement,
      $.empty_temp_table_statement,
      $.finally_statement,
      $.os_delete_statement,
      $.transaction_mode_statement,
      $.use_statement,
      $.using_statement,
      $.validate_statement,
      $.assignment_statement,
      $.close_query_statement,
      $.form_statement,
      $.next_prompt_statement,
      $.propath_statement,
      $.promsgs_statement,
      $.return_statement,
      $.unload_statement,
      $.create_widget_statement,
      $.create_temp_table_statement,
      $.delete_statement,
      $.release_statement,
      $.expression_statement,
      $.input_clear_statement,
      $.leave_statement,
      $.load_picture_statement,
      $.next_statement,
      $.os_append_statement,
      $.os_copy_statement,
      $.os_rename_statement,
      $.page_statement,
      $.show_stats_statement,
      $.os_create_dir_statement,
      $.process_events_statement,
      $.terminal_statement,
      $.bell_statement,
      $.dictionary_statement,
      $.quit_statement,
      $.stop_statement,
      $.dynamic_new_statement,
      $.this_object_statement,
      $.super_statement,
      $.put_assign_statement,
      $.system_dialog_get_file_statement,
      $.system_dialog_font_statement,
      $.system_dialog_printer_setup_statement,
      $.system_dialog_get_dir_statement,
      $.system_dialog_color_statement,
      $.trigger_procedure_statement,
    ),

  // Shared statements-specific rules
  _os_filename: ($) => choice($.string_literal, $._identifier_or_access_or_call),
  _alias_name: ($) => choice($.identifier, $.string_literal, $._value_expression),
  _in_widget_pool: ($) => seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier)),

  // Extracted shared rules
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

  _except_fields: ($) => seq(kw("EXCEPT"), repeat1(field("except", $.identifier))),

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

  _map_entry: ($) => $._identifier_or_string_literal,

  _program_target: ($) =>
    choice(field("program", $.identifier), field("program", $.string_literal), $._value_expression),

  _unbuffered_convert_tail: ($) =>
    choice(
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($._convert_phrase, $.convert_phrase)),
      ),
      alias($._convert_phrase, $.convert_phrase),
    ),

  _lob_dir_phrase: ($) =>
    seq(kw("LOB-DIR"), field("directory", choice($.preprocessor_name, $._value_expression))),

  _stream_definition: ($) =>
    seq(choice(kw("STREAM"), kw("STREAM-HANDLE")), field("name", $.identifier)),

  _menu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          $.__aggregate_label_phrase,
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
      optional($.__aggregate_label_phrase),
    ),

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

  _like_phrase: ($) => seq(kw("LIKE"), $.__temp_table_like_body),

  _up_down_tail: ($) =>
    choice(seq($._stream_phrase, optional($.__up_down_count_frame)), $.__up_down_count_frame),
  __up_down_count_frame: ($) =>
    choice(seq(field("count", $._expression), optional($.frame_phrase)), $.frame_phrase),

  _variable_type: ($) =>
    choice(
      seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
      seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
    ),
});
