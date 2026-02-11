module.exports = ({ kw }) => ({
  class_definition: ($) =>
    seq(repeat($.__class_option), kw("CLASS"), $.__class_body, $._terminator),

  __class_body: ($) =>
    seq(
      field("name", $._type_name),
      repeat($.__class_option),
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
      $.preprocessor_directive,
      alias($.include_expression, $.include_reference),
    ),

  method_definition: ($) =>
    choice(
      seq(
        kw("METHOD"),
        repeat($.__method_modifier_no_abstract),
        $.__method_return_type,
        field("name", $.identifier),
        alias($.__method_parameters, $.parameters),
        choice(alias($._colon, ":"), $._terminator_dot),
        alias($.__method_body, $.body),
      ),
      seq(
        kw("METHOD"),
        repeat($.__method_modifier_no_abstract),
        kw("ABSTRACT"),
        repeat($.__method_modifier_no_abstract),
        $.__method_return_type,
        field("name", $.identifier),
        alias($.__method_parameters, $.parameters),
        $._terminator_dot,
      ),
    ),

  constructor_definition: ($) =>
    seq(
      kw("CONSTRUCTOR"),
      repeat($.__constructor_modifier),
      field("name", $.identifier),
      alias($.__method_parameters, $.parameters),
      alias($._colon, ":"),
      alias($.__constructor_body, $.body),
    ),

  destructor_definition: ($) =>
    seq(
      kw("DESTRUCTOR"),
      optional(alias(kw("PUBLIC"), $.access_modifier)),
      field("name", $.identifier),
      alias($.__destructor_parameters, $.parameters),
      alias($._colon, ":"),
      alias($.__destructor_body, $.body),
    ),

  __method_parameters: ($) =>
    seq(
      "(",
      optional(
        seq(
          alias($.__method_parameter, $.parameter),
          repeat(seq(",", alias($.__method_parameter, $.parameter))),
        ),
      ),
      ")",
    ),

  __method_parameter: ($) =>
    choice(
      seq(
        optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
        field("name", $.identifier),
        $.__method_variable_type_phrase,
        optional(alias(kw("NO-UNDO"), $.no_undo)),
      ),
      $.__method_table_parameter,
    ),

  __method_body: ($) =>
    seq(repeat($._statement), kw("END"), optional(kw("METHOD")), $._terminator),

  __constructor_body: ($) =>
    seq(
      repeat($._statement),
      kw("END"),
      optional(choice(kw("CONSTRUCTOR"), kw("METHOD"))),
      $._terminator,
    ),

  __destructor_body: ($) =>
    seq(
      repeat($._statement),
      kw("END"),
      optional(kw("DESTRUCTOR")),
      $._terminator,
    ),

  __destructor_parameters: ($) => seq("(", ")"),

  property_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__property_definition_modifier),
      kw("PROPERTY"),
      field("name", $.identifier),
      $.__property_type_phrase,
      repeat(
        choice(
          seq(
            kw("INITIAL", { offset: 4 }),
            choice($._expression, seq("[", optional($._expressions), "]")),
          ),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
          alias(kw("NO-UNDO"), $.no_undo),
        ),
      ),
      repeat1(choice($.__property_get_phrase, $.__property_set_phrase)),
    ),

  __property_get_phrase: ($) =>
    seq(
      kw("GET"),
      choice(
        $._terminator_dot,
        seq(
          alias($._colon, ":"),
          repeat($._statement),
          kw("END"),
          optional(kw("GET")),
          $._terminator,
        ),
      ),
    ),

  __property_set_phrase: ($) =>
    seq(
      kw("SET"),
      optional($.property_set_parameter_list),
      choice(
        $._terminator_dot,
        seq(
          alias($._colon, ":"),
          repeat($._statement),
          kw("END"),
          optional(kw("SET")),
          $._terminator,
        ),
      ),
    ),

  property_set_parameter_list: ($) => seq("(", $.property_set_parameter, ")"),

  property_set_parameter: ($) =>
    seq(
      field("name", $.identifier),
      $.__method_variable_type_phrase,
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

  __property_modifier: ($) =>
    choice(
      alias(kw("ABSTRACT"), $.abstract_modifier),
      alias(kw("FINAL"), $.final_modifier),
      alias(kw("OVERRIDE"), $.override_modifier),
    ),
  __property_definition_modifier: ($) =>
    choice(
      seq(
        $.__property_access_modifier,
        optional($.__property_class_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
        optional($.__property_serialization_modifier),
      ),
      seq(
        $.__property_class_modifier,
        optional($.__property_access_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
        optional($.__property_serialization_modifier),
      ),
      seq(
        alias(kw("OVERRIDE"), $.override_modifier),
        optional($.__property_serialization_modifier),
      ),
      $.__property_serialization_modifier,
    ),
  __property_access_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),
  __property_class_modifier: ($) =>
    choice(
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("ABSTRACT"), $.abstract_modifier),
      alias(kw("FINAL"), $.final_modifier),
    ),
  __property_serialization_modifier: ($) =>
    choice(
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),

  __property_type_phrase: ($) =>
    seq(
      optional(kw("AS")),
      optional(kw("CLASS")),
      field("type", $._type_or_string),
      optional($.__method_extent_phrase),
    ),

  __method_modifier: ($) =>
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
  __method_modifier_no_abstract: ($) =>
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

  __constructor_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
    ),

  __method_return_type: ($) =>
    choice(
      field("type", alias(kw("VOID"), $.identifier)),
      seq(
        optional(kw("CLASS")),
        field("type", $._type_or_string),
        optional($.__method_extent_phrase),
      ),
    ),

  __method_variable_type_phrase: ($) =>
    seq(
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
      ),
      optional($.__method_extent_phrase),
    ),

  __method_extent_phrase: ($) =>
    prec.right(seq(kw("EXTENT"), optional($.__method_extent_size))),
  __method_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.preprocessor_reference),
      $.identifier,
    ),
  __method_table_parameter: ($) =>
    seq(
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      choice(
        seq(
          kw("TABLE"),
          optional(kw("FOR")),
          field("table", $._identifier_or_qualified_name),
          repeat($.__method_table_parameter_option),
        ),
        seq(
          kw("TABLE-HANDLE"),
          field("table_handle", $.identifier),
          repeat($.__method_handle_parameter_option),
        ),
        seq(
          kw("DATASET"),
          optional(kw("FOR")),
          field("dataset", $._identifier_or_qualified_name),
          repeat($.__method_table_parameter_option),
        ),
        seq(
          kw("DATASET-HANDLE"),
          field("dataset_handle", $.identifier),
          repeat($.__method_handle_parameter_option),
        ),
      ),
    ),
  __method_table_parameter_option: ($) =>
    choice(
      alias(kw("APPEND"), $.append),
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("BY-REFERENCE"), $.by_reference),
    ),
  __method_handle_parameter_option: ($) =>
    choice(
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("BY-REFERENCE"), $.by_reference),
    ),
});
