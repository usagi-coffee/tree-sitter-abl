module.exports = ({ kw }) => ({
  class_definition: ($) =>
    seq(repeat($.__class_option), kw("CLASS"), $.__class_body, $._terminator),

  __class_body: ($) =>
    seq(field("name", $._type_name), repeat($.__class_option), $.__class_definition_compound_body),
  __class_definition_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), $._terminator_dot),
      repeat($.__class_body_item),
      kw("END"),
      optional(kw("CLASS")),
    ),

  __class_body_item: ($) =>
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
      $.on_statement,
      $.using_statement,
      $.annotation,
      $.global_define_preprocessor_directive,
      $.scoped_define_preprocessor_directive,
      alias($.if_preprocessor_directive_statement, $.if_preprocessor_directive),
      $.message_preprocessor_directive,
      $.undefine_preprocessor_directive,
      $.include_file_reference,
    ),

  method_definition: ($) =>
    choice(
      seq(
        $.__class_method_definition_prefix,
        $.__class_method_definition_signature,
        choice(alias($._colon, ":"), $._terminator_dot),
        alias($.__class_method_body, $.body),
      ),
      seq(
        $.__class_method_definition_prefix,
        kw("ABSTRACT"),
        repeat($._method_modifier_no_abstract),
        $.__class_method_definition_signature,
        $._terminator_dot,
      ),
    ),
  __class_method_definition_prefix: ($) =>
    seq(kw("METHOD"), repeat($._method_modifier_no_abstract)),
  __class_method_definition_signature: ($) =>
    seq(
      $._method_return_type,
      field("name", $.identifier),
      alias($._method_parameters, $.parameters),
    ),

  constructor_definition: ($) =>
    seq(
      kw("CONSTRUCTOR"),
      repeat($.__class_constructor_modifier),
      field("name", $.identifier),
      alias($._method_parameters, $.parameters),
      alias($._colon, ":"),
      alias($.__class_constructor_body, $.body),
    ),

  destructor_definition: ($) =>
    seq(
      kw("DESTRUCTOR"),
      optional(alias(kw("PUBLIC"), $.access_modifier)),
      field("name", $.identifier),
      alias($.__class_destructor_parameters, $.parameters),
      alias($._colon, ":"),
      alias($.__class_destructor_body, $.body),
    ),

  _method_parameters: ($) =>
    seq(
      "(",
      optional(
        seq(
          alias($.__class_method_parameter, $.parameter),
          repeat(seq(",", alias($.__class_method_parameter, $.parameter))),
        ),
      ),
      ")",
    ),

  __class_method_parameter: ($) =>
    seq(
      optional(field("direction", $.__class_method_parameter_direction)),
      $.__class_method_parameter_body,
    ),
  __class_method_parameter_body: ($) =>
    choice($.__class_named_parameter_body, $.__class_method_table_parameter),
  __class_method_parameter_direction: ($) => choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT")),

  __class_method_body: ($) => seq($.__class_compound_body, optional(kw("METHOD")), $._terminator),

  __class_constructor_body: ($) =>
    seq($.__class_compound_body, optional(choice(kw("CONSTRUCTOR"), kw("METHOD"))), $._terminator),

  __class_destructor_body: ($) =>
    seq($.__class_compound_body, optional(kw("DESTRUCTOR")), $._terminator),
  __class_compound_body: ($) => seq(repeat($._statement), kw("END")),

  __class_destructor_parameters: ($) => seq("(", ")"),

  property_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__class_property_definition_modifier),
      kw("PROPERTY"),
      field("name", $.identifier),
      $.__class_property_type_phrase,
      repeat(
        choice(
          seq(
            kw("INITIAL", { offset: 4 }),
            field("initial", choice($._expression, seq("[", optional($._expressions), "]"))),
          ),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
          alias(kw("NO-UNDO"), $.no_undo),
        ),
      ),
      repeat1(choice($.__class_property_get_phrase, $.__class_property_set_phrase)),
    ),

  __class_property_get_phrase: ($) => seq(kw("GET"), $.__class_property_accessor_tail),

  __class_property_set_phrase: ($) =>
    seq(kw("SET"), optional($.property_set_parameter_list), $.__class_property_accessor_tail),
  __class_property_accessor_body: ($) => seq(alias($._colon, ":"), repeat($._statement), kw("END")),
  __class_property_accessor_tail: ($) =>
    choice(
      $._terminator_dot,
      seq($.__class_property_accessor_body, optional(choice(kw("GET"), kw("SET"))), $._terminator),
    ),

  property_set_parameter_list: ($) => seq("(", $.property_set_parameter, ")"),

  property_set_parameter: ($) => $.__class_named_parameter_body,
  __class_named_parameter_body: ($) =>
    seq(
      field("name", $.identifier),
      $.__class_method_variable_type_phrase,
      optional(alias(kw("NO-UNDO"), $.no_undo)),
    ),

  __class_option: ($) =>
    choice(
      seq(kw("INHERITS"), field("super", $._type_name)),
      seq(
        kw("IMPLEMENTS"),
        field("interface", $._type_name),
        repeat(seq(",", field("interface", $._type_name))),
      ),
      alias(kw("USE-WIDGET-POOL"), $.use_widget_pool),
      alias(kw("ABSTRACT"), $.abstract),
      alias(kw("FINAL"), $.final),
      alias(kw("SERIALIZABLE"), $.serializable),
    ),

  __class_property_modifier: ($) =>
    choice(
      alias(kw("ABSTRACT"), $.abstract_modifier),
      alias(kw("FINAL"), $.final_modifier),
      alias(kw("OVERRIDE"), $.override_modifier),
    ),
  __class_property_definition_modifier: ($) =>
    choice(
      seq(
        $.__class_property_access_modifier,
        optional($.__class_property_class_modifier),
        optional($.__class_property_modifier_tail),
      ),
      seq(
        $.__class_property_class_modifier,
        optional($.__class_property_access_modifier),
        optional($.__class_property_modifier_tail),
      ),
      $.__class_property_modifier_tail,
      $.__class_property_serialization_modifier,
    ),
  __class_property_modifier_tail: ($) =>
    seq(
      alias(kw("OVERRIDE"), $.override_modifier),
      optional($.__class_property_serialization_modifier),
    ),
  __class_property_access_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),
  __class_property_class_modifier: ($) =>
    choice(
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("ABSTRACT"), $.abstract_modifier),
      alias(kw("FINAL"), $.final_modifier),
    ),
  __class_property_serialization_modifier: ($) =>
    choice(
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),

  __class_property_type_phrase: ($) => seq(optional(kw("AS")), $.__class_typed_extent_phrase),

  __class_method_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("ABSTRACT"), $.abstract_modifier),
      alias(kw("OVERRIDE"), $.override_modifier),
      alias(kw("FINAL"), $.final_modifier),
    ),
  _method_modifier_no_abstract: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("OVERRIDE"), $.override_modifier),
      alias(kw("FINAL"), $.final_modifier),
    ),

  __class_constructor_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
    ),

  _method_return_type: ($) =>
    choice(field("type", alias(kw("VOID"), $.identifier)), $.__class_typed_extent_phrase),
  __class_typed_extent_phrase: ($) =>
    seq(
      optional(kw("CLASS")),
      field("type", $._type_or_string),
      optional($.__class_method_extent_phrase),
    ),

  __class_method_variable_type_phrase: ($) =>
    choice(
      seq(kw("AS"), $.__class_typed_extent_phrase),
      seq(
        kw("LIKE"),
        field("like", $._identifier_or_qualified_name),
        optional($.__class_method_extent_phrase),
      ),
    ),

  __class_method_extent_phrase: ($) =>
    prec.right(seq(kw("EXTENT"), optional(field("size", $.__class_method_extent_size)))),
  __class_method_extent_size: ($) => choice($.number_literal, $.preprocessor_name, $.identifier),
  __class_method_table_parameter: ($) =>
    choice(
      seq(kw("TABLE"), $.__class_method_table_parameter_tail),
      seq(kw("TABLE-HANDLE"), $.__class_method_table_handle_parameter_tail),
      seq(kw("DATASET"), $.__class_method_dataset_parameter_tail),
      seq(kw("DATASET-HANDLE"), $.__class_method_dataset_handle_parameter_tail),
    ),
  __class_method_table_parameter_tail: ($) =>
    seq(
      optional(field("for", kw("FOR"))),
      field("table", $._identifier_or_qualified_name),
      repeat($.__class_method_table_parameter_option),
    ),
  __class_method_dataset_parameter_tail: ($) =>
    seq(
      optional(field("for", kw("FOR"))),
      field("dataset", $._identifier_or_qualified_name),
      repeat($.__class_method_table_parameter_option),
    ),
  __class_method_table_handle_parameter_tail: ($) =>
    seq(field("table_handle", $.identifier), repeat($.__class_method_handle_parameter_option)),
  __class_method_dataset_handle_parameter_tail: ($) =>
    seq(field("dataset_handle", $.identifier), repeat($.__class_method_handle_parameter_option)),
  __class_method_table_parameter_option: ($) =>
    choice(
      alias(kw("APPEND"), $.append),
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("BY-REFERENCE"), $.by_reference),
    ),
  __class_method_handle_parameter_option: ($) =>
    choice(
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("BY-REFERENCE"), $.by_reference),
    ),
});
