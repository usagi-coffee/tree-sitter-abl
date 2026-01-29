module.exports = ({ kw, tkw }) => ({
  class_definition: ($) =>
    seq(repeat($.__class_option), kw("CLASS"), $.__class_body, $._terminator),

  __class_body: ($) =>
    seq(
      field("name", $._type_name),
      repeat($.__class_option),
      choice($._colon, $._terminator_dot),
      repeat($.__class_body_item),
      tkw("END"),
      optional(tkw("CLASS")),
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
      $.data_source_definition,
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
        choice($._colon, $._terminator_dot),
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
      $._colon,
      alias($.__constructor_body, $.body),
    ),

  destructor_definition: ($) =>
    seq(
      kw("DESTRUCTOR"),
      optional($.__destructor_access),
      field("name", $.identifier),
      alias($.__destructor_parameters, $.parameters),
      $._colon,
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
    seq(
      repeat($._statement),
      tkw("END"),
      optional(tkw("METHOD")),
      $._terminator,
    ),

  __constructor_body: ($) =>
    seq(
      repeat($._statement),
      tkw("END"),
      optional(choice(tkw("CONSTRUCTOR"), tkw("METHOD"))),
      $._terminator,
    ),

  __destructor_body: ($) =>
    seq(
      repeat($._statement),
      tkw("END"),
      optional(tkw("DESTRUCTOR")),
      $._terminator,
    ),

  __destructor_parameters: ($) => seq("(", ")"),

  property_definition: ($) =>
    seq(
      kw("DEFINE"),
      optional(alias($.__variable_access_modifier, $.access_modifier)),
      optional(alias($.__variable_static_modifier, $.static_modifier)),
      optional(
        alias($.__variable_serialization_modifier, $.serialization_modifier),
      ),
      repeat($.__property_modifier),
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
      repeat1($.property_accessor),
    ),

  property_accessor: ($) =>
    choice($.__property_get_phrase, $.__property_set_phrase),

  __property_get_phrase: ($) =>
    seq(
      optional(alias($.__variable_access_modifier, $.access_modifier)),
      tkw("GET"),
      choice(
        $._terminator_dot,
        seq(
          $._colon,
          repeat($._statement),
          tkw("END"),
          optional(tkw("GET")),
          $._terminator,
        ),
      ),
    ),

  __property_set_phrase: ($) =>
    seq(
      optional(alias($.__variable_access_modifier, $.access_modifier)),
      tkw("SET"),
      optional($.property_set_parameter_list),
      choice(
        $._terminator_dot,
        seq(
          $._colon,
          repeat($._statement),
          tkw("END"),
          optional(tkw("SET")),
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

  __property_initial_keyword: ($) =>
    choice(kw("INITIAL"), alias(token(seq(/INIT(IAL)?/i, /\s+/)), "INITIAL")),

  __property_no_undo: ($) => tkw("NO-UNDO"),

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
      tkw("VOID"),
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
  __method_field_name: ($) => choice($.qualified_name, $.identifier),
  __method_no_undo: ($) => tkw("NO-UNDO"),
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
  __method_record_name: ($) => choice($.qualified_name, $.identifier),
  __method_table_parameter_option: ($) =>
    choice(tkw("APPEND"), tkw("BIND"), tkw("BY-VALUE"), tkw("BY-REFERENCE")),
  __method_handle_parameter_option: ($) =>
    choice(tkw("BIND"), tkw("BY-VALUE"), tkw("BY-REFERENCE")),
});
