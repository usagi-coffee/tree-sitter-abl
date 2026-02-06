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
      $.procedure_forward_definition,
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
      alias($.include_expression, $.include),
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
      optional($.__destructor_access),
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
        optional(alias($.__method_no_undo, $.no_undo)),
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
          alias($.__property_initial_option, $.initial_option),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
          alias($.__property_no_undo, $.no_undo),
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
      optional(alias($.__method_no_undo, $.no_undo)),
    ),

  __class_option: ($) =>
    choice(
      seq(kw("INHERITS"), field("super", $._type_name)),
      seq(
        kw("IMPLEMENTS"),
        field("interface", $._type_name),
        repeat(seq(",", field("interface", $._type_name))),
      ),
      kw("USE-WIDGET-POOL"),
      kw("ABSTRACT"),
      kw("FINAL"),
      kw("SERIALIZABLE"),
    ),

  __property_modifier: ($) =>
    choice(kw("ABSTRACT"), kw("FINAL"), kw("OVERRIDE")),
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

  __property_initial_option: ($) =>
    seq(
      $.__property_initial_keyword,
      choice($._expression, seq("[", optional($._expressions), "]")),
    ),

  __property_initial_keyword: ($) => kw("INITIAL", { offset: 4 }),

  __property_no_undo: ($) => kw("NO-UNDO"),

  __method_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
      kw("STATIC"),
      kw("ABSTRACT"),
      kw("OVERRIDE"),
      kw("FINAL"),
    ),
  __method_modifier_no_abstract: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
      kw("STATIC"),
      kw("OVERRIDE"),
      kw("FINAL"),
    ),

  __constructor_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
      kw("STATIC"),
    ),

  __destructor_access: ($) => kw("PUBLIC"),

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
        seq(kw("LIKE"), field("like", $.__method_field_name)),
      ),
      optional($.__method_extent_phrase),
    ),

  __method_extent_phrase: ($) =>
    prec.right(seq(kw("EXTENT"), optional($.__method_extent_size))),
  __method_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.identifier,
    ),
  __method_field_name: ($) => $._identifier_or_qualified_name,
  __method_no_undo: ($) => kw("NO-UNDO"),
  __method_table_parameter: ($) =>
    seq(
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      choice(
        seq(
          kw("TABLE"),
          optional(kw("FOR")),
          field("table", $.__method_record_name),
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
          field("dataset", $.__method_record_name),
          repeat($.__method_table_parameter_option),
        ),
        seq(
          kw("DATASET-HANDLE"),
          field("dataset_handle", $.identifier),
          repeat($.__method_handle_parameter_option),
        ),
      ),
    ),
  __method_record_name: ($) => $._identifier_or_qualified_name,
  __method_table_parameter_option: ($) =>
    choice(kw("APPEND"), kw("BIND"), kw("BY-VALUE"), kw("BY-REFERENCE")),
  __method_handle_parameter_option: ($) =>
    choice(kw("BIND"), kw("BY-VALUE"), kw("BY-REFERENCE")),
});
