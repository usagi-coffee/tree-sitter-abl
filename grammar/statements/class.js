export default ({ kw }) => ({
  class_definition: ($) => seq($.__class_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __class_prefix: ($) => seq(optional($.__class_options), $._kw_class, $.__class_body),

  __class_body: ($) =>
    seq(
      field("name", $._type_name),
      optional($.__class_options),
      $.__class_definition_compound_body,
    ),
  __class_definition_compound_body: ($) =>
    seq(
      $.__class_body_opener,
      optional($.__class_definition_items),
      $._end_keyword,
      optional($._kw_class),
    ),

  __class_definition_items: ($) =>
    prec.right(
      seq(
        choice(
          $.variable_definition,
          $.temp_table_definition,
          $.work_table_definition,
          $.workfile_definition,
          $.stream_definition,
          $.image_definition,
          $.buffer_definition,
          alias($.data_source_class_definition, $.data_source_definition),
          $.query_definition,
          $.dataset_definition,
          $.button_definition,
          $.browse_definition,
          $.frame_definition,
          $.menu_definition,
          $.submenu_definition,
          $.rectangle_definition,
          $.event_definition,
          $.procedure_definition,
          $.function_definition,
          $.function_forward_definition,
          $.var_statement,
          $.property_definition,
          $.method_definition,
          $.constructor_definition,
          $.destructor_definition,
          $.error_scope_statement,
          $.on_statement,
          $.using_statement,
          $.annotation,
          $.global_define_preprocessor_directive,
          $.scoped_define_preprocessor_directive,
          $._if_preprocessor_statement,
          $.message_preprocessor_directive,
          $.undefine_preprocessor_directive,
          $.include_file_reference,
          alias($._macro_statement_token, $.constant),
        ),
        optional($.__class_definition_items),
      ),
    ),

  method_definition: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $.__class_method_definition_prefix,
        $._method_definition_signature,
        $.__class_body_opener,
        alias($.__class_method_body, $.body),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq($.__class_method_definition_prefix, kw("ABSTRACT"), $._method_header, $._terminator_dot),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-choice
  __class_body_opener: ($) => choice(alias($._colon, ":"), $._terminator_dot),
  __class_method_definition_prefix: ($) =>
    seq($._kw_method, optional($.__class_method_definition_modifiers)),
  __class_method_definition_modifiers: ($) =>
    prec.right(
      seq(
        choice($._method_modifier_no_abstract, $.preprocessor_name),
        optional($.__class_method_definition_modifiers),
      ),
    ),
  constructor_definition: ($) =>
    seq(
      kw("CONSTRUCTOR"),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        // oxlint-disable-next-line tree-sitter-optimize/choice-subset
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
          alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("PUBLIC"), $.access_modifier),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("STATIC"), $.static_modifier),
          $.preprocessor_name,
        ),
      ),
      field("name", $.identifier),
      alias($._method_parameters, $.parameters),
      alias($._colon, ":"),
      alias($.__class_constructor_body, $.body),
    ),

  destructor_definition: ($) =>
    seq(
      kw("DESTRUCTOR"),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("PUBLIC"), $.access_modifier)),
      field("name", $.identifier),
      alias($.__class_destructor_parameters, $.parameters),
      alias($._colon, ":"),
      alias($.__class_destructor_body, $.body),
    ),

  _method_parameters: ($) => seq("(", optional($.__class_method_parameter_head), ")"),
  __class_method_parameter_head: ($) =>
    seq(
      alias($.__class_method_parameter, $.parameter),
      optional(seq(",", $.__class_method_parameter_head)),
    ),

  __class_method_parameter: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      choice($.__class_named_parameter_body, $.__class_method_table_parameter),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
  __class_method_body: ($) => seq($._compound_body, optional($._kw_method), $._terminator),

  __class_constructor_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
    seq($._compound_body, optional(choice(kw("CONSTRUCTOR"), $._kw_method)), $._terminator),

  __class_destructor_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
    seq($._compound_body, optional(choice(kw("DESTRUCTOR"), $._kw_method)), $._terminator),

  __class_destructor_parameters: ($) => seq("(", ")"),

  property_definition: ($) =>
    seq(
      $.__class_property_definition_prefix,
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat1(
        choice(
          seq(
            optional($.__class_property_accessor_modifier),
            kw("GET"),
            optional($.__class_property_accessor_parameters),
            $.__class_property_accessor_tail,
          ),
          seq(
            optional($.__class_property_accessor_modifier),
            kw("SET"),
            optional($.__class_property_accessor_parameters),
            $.__class_property_accessor_tail,
          ),
        ),
      ),
    ),

  __class_property_definition_prefix: ($) =>
    seq(
      $._define_keyword,
      optional(choice($.__class_property_definition_modifier, $.preprocessor_name)),
      kw("PROPERTY"),
      field("name", $.identifier),
      $.__class_property_type_phrase,
      optional($.__class_property_options),
    ),

  __class_property_options: ($) =>
    prec.right(seq($.__class_property_option, optional($.__class_property_options))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __class_property_option: ($) =>
    choice(
      $._initial_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
      alias($._no_undo_keyword, $.no_undo),
      alias($._extent_phrase, $.extent_phrase),
    ),

  __class_property_accessor_body: ($) => seq(alias($._colon, ":"), $._compound_body),
  __class_property_accessor_tail: ($) =>
    choice(
      $._terminator_dot,
      // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
      seq($.__class_property_accessor_body, optional(choice(kw("GET"), kw("SET"))), $._terminator),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/choice-subset
  __class_property_accessor_modifier: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("PUBLIC"), $.access_modifier),
      $.preprocessor_name,
      // A {&NAME} alone on its line lexes as the whole-line macro_statement
      // token (longer match, higher precedence) rather than a bare
      // preprocessor_name — accept that spelling here too.
      alias($._macro_statement_token, $.constant),
    ),
  __class_property_accessor_parameters: ($) => choice(seq("(", ")"), $.property_set_parameter_list),
  property_set_parameter_list: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
    seq("(", $.property_set_parameter, optional($.__class_property_set_parameter_tail), ")"),
  __class_property_set_parameter_tail: ($) =>
    seq(",", $.property_set_parameter, optional($.__class_property_set_parameter_tail)),

  property_set_parameter: ($) =>
    seq(optional(field("direction", $._parameter_direction)), $.__class_named_parameter_body),
  __class_named_parameter_body: ($) =>
    seq(
      field("name", $.identifier),
      $.__class_method_variable_type_phrase,
      optional(alias($._no_undo_keyword, $.no_undo)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __class_option: ($) =>
    choice(
      seq(kw("INHERITS"), field("super", $._type_name)),
      // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
      seq(kw("IMPLEMENTS"), field("interface", $._type_name), optional($.__class_implements_tail)),
      alias(kw("USE-WIDGET-POOL"), $.use_widget_pool),
      alias(kw("ABSTRACT"), $.abstract),
      alias(kw("FINAL"), $.final),
      alias(kw("SERIALIZABLE"), $.serializable),
    ),
  __class_options: ($) => prec.right(seq($.__class_option, optional($.__class_options))),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-choice
  __class_property_definition_modifier: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $._member_access_modifier,
        optional($.__class_property_class_modifier),
        optional(choice($.__class_property_modifier_tail, $._serialization_modifier)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $.__class_property_class_modifier,
        optional($._member_access_modifier),
        optional(choice($.__class_property_modifier_tail, $._serialization_modifier)),
      ),
      $.__class_property_modifier_tail,
      $._serialization_modifier,
    ),
  __class_property_modifier_tail: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("OVERRIDE"), $.override_modifier),
      optional($._member_access_modifier),
      optional($._serialization_modifier),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/choice-subset
  __class_property_class_modifier: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("ABSTRACT"), $.abstract_modifier),
      alias(kw("FINAL"), $.final_modifier),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __class_property_type_phrase: ($) => seq(optional($._as_keyword), $._class_type),
  __class_implements_tail: ($) =>
    seq(",", field("interface", $._type_name), optional($.__class_implements_tail)),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/choice-subset, tree-sitter-optimize/single-use-shared-choice-inline
  _method_modifier_no_abstract: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("PUBLIC"), $.access_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("STATIC"), $.static_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("OVERRIDE"), $.override_modifier),
      alias(kw("FINAL"), $.final_modifier),
    ),

  _method_return_type: ($) =>
    choice(
      field("type", alias(kw("VOID"), $.identifier)),
      seq($._class_type, optional($.__class_method_return_extent_phrase)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __class_method_return_extent_phrase: ($) =>
    seq(
      kw("EXTENT"),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      optional(field("size", choice($.number_literal, $.preprocessor_name, $.identifier))),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __class_method_variable_type_phrase: ($) =>
    choice(
      seq($._as_keyword, $._class_type, optional($.__class_method_extent_phrase)),
      seq(
        $._like_keyword,
        field("like", $._identifier_or_qualified_name),
        optional($.__class_method_extent_phrase),
      ),
    ),

  __class_method_extent_phrase: ($) =>
    prec.right(
      seq(
        kw("EXTENT"),
        // oxlint-disable-next-line tree-sitter-optimize/alternative-extraction, tree-sitter-optimize/shared-choice
        optional(field("size", choice($.number_literal, $.preprocessor_name, $.identifier))),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-choice
  __class_method_table_parameter: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        $._kw_buffer,
        field("buffer", $.identifier),
        $._for_keyword,
        field("table", $._identifier_or_qualified_name),
      ),
      seq(
        kw("TABLE"),
        optional(field("for", $._for_keyword)),
        field("table", $._identifier_or_qualified_name),
        optional($.__class_table_options),
      ),
      seq($._table_handle_value, optional($.__class_handle_options)),
      seq(
        $._dataset_keyword,
        optional(field("for", $._for_keyword)),
        field("dataset", $._identifier_or_qualified_name),
        optional($.__class_table_options),
      ),
      seq(
        kw("DATASET-HANDLE"),
        field("dataset_handle", $.identifier),
        optional($.__class_handle_options),
      ),
    ),
  __class_table_options: ($) =>
    prec.right(seq($.__class_table_option, optional($.__class_table_options))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __class_table_option: ($) =>
    choice(
      alias(kw("APPEND"), $.append),
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("BY-REFERENCE"), $.by_reference),
    ),
  __class_handle_options: ($) =>
    prec.right(
      seq(
        choice(
          alias(kw("BIND"), $.bind),
          alias(kw("BY-VALUE"), $.by_value),
          alias(kw("BY-REFERENCE"), $.by_reference),
        ),
        optional($.__class_handle_options),
      ),
    ),
});
