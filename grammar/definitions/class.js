module.exports = ({ kw, tkw }) => ({
  class_definition: ($) =>
    seq(
      repeat($.__class_option),
      kw("CLASS"),
      field("name", $._type_name),
      repeat($.__class_option),
      choice($._colon, $._terminator_dot),
      repeat($.class_body_item),
      tkw("END"),
      optional(tkw("CLASS")),
      $._terminator,
    ),

  class_body_item: ($) =>
    choice(
      $.variable_definition,
      $.temp_table_definition,
      $.work_table_definition,
      $.workfile_definition,
      $.stream_definition,
      $.image_definition,
      $.buffer_definition,
      $.query_definition,
      $.dataset_definition,
      $.button_definition,
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
      $.annotation_statement,
      $.preprocessor_directive,
      $.include,
    ),

  method_definition: ($) =>
    choice(
      seq(
        kw("METHOD"),
        repeat($.__method_modifier_no_abstract),
        $.__method_return_type,
        field("name", $.identifier),
        $.method_parameter_list,
        choice($._colon, $._terminator_dot),
        $.method_body,
      ),
      seq(
        kw("METHOD"),
        repeat($.__method_modifier_no_abstract),
        kw("ABSTRACT"),
        repeat($.__method_modifier_no_abstract),
        $.__method_return_type,
        field("name", $.identifier),
        $.method_parameter_list,
        $._terminator_dot,
      ),
    ),

  constructor_definition: ($) =>
    seq(
      kw("CONSTRUCTOR"),
      repeat($.__constructor_modifier),
      field("name", $.identifier),
      $.method_parameter_list,
      $._colon,
      $.constructor_body,
    ),

  destructor_definition: ($) =>
    seq(
      kw("DESTRUCTOR"),
      optional($.__destructor_access),
      field("name", $.identifier),
      $.destructor_parameter_list,
      $._colon,
      $.destructor_body,
    ),

  method_parameter_list: ($) =>
    seq(
      "(",
      optional(seq($.method_parameter, repeat(seq(",", $.method_parameter)))),
      ")",
    ),

  method_parameter: ($) =>
    choice(
      seq(
        optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
        field("name", $.identifier),
        $.__method_variable_type_clause,
        optional(alias($.__method_no_undo, $.no_undo)),
      ),
      $.__method_table_parameter,
    ),

  method_body: ($) =>
    seq(repeat($._statement), tkw("END"), optional(tkw("METHOD")), $._terminator),

  constructor_body: ($) =>
    seq(
      repeat($._statement),
      tkw("END"),
      optional(choice(tkw("CONSTRUCTOR"), tkw("METHOD"))),
      $._terminator,
    ),

  destructor_body: ($) =>
    seq(
      repeat($._statement),
      tkw("END"),
      optional(tkw("DESTRUCTOR")),
      $._terminator,
    ),

  destructor_parameter_list: ($) => seq("(", ")"),

  property_definition: ($) =>
    seq(
      kw("DEFINE"),
      optional(alias($.__variable_access_modifier, $.access_modifier)),
      optional(alias($.__variable_static_modifier, $.static_modifier)),
      optional(
        alias(
          $.__variable_serialization_modifier,
          $.serialization_modifier,
        ),
      ),
      repeat($.__property_modifier),
      kw("PROPERTY"),
      field("name", $.identifier),
      $.__property_type_clause,
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
    choice($.__property_get_clause, $.__property_set_clause),

  __property_get_clause: ($) =>
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

  __property_set_clause: ($) =>
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

  property_set_parameter_list: ($) =>
    seq("(", $.property_set_parameter, ")"),

  property_set_parameter: ($) =>
    seq(
      field("name", $.identifier),
      $.__method_variable_type_clause,
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
    choice(
      kw("ABSTRACT"),
      kw("FINAL"),
      kw("OVERRIDE"),
    ),

  __property_type_clause: ($) =>
    seq(
      optional(kw("AS")),
      optional(kw("CLASS")),
      field("type", $._type_or_string),
      optional($.__method_extent_clause),
    ),

  __property_initial_option: ($) =>
    seq(
      $.__property_initial_keyword,
      choice($._expression, seq("[", optional($._expression_list), "]")),
    ),

  __property_initial_keyword: ($) =>
    choice(kw("INITIAL"), alias(token(seq(/INIT(IAL)?/i, /\s+/)), "INITIAL")),

  __property_no_undo: ($) => token(/NO-UNDO/i),

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
        optional($.__method_extent_clause),
      ),
    ),

  __method_variable_type_clause: ($) =>
    seq(
      choice(
        seq(
          kw("AS"),
          optional(kw("CLASS")),
          field("type", $._type_or_string),
        ),
        seq(kw("LIKE"), field("like", $.__method_field_name)),
      ),
      optional($.__method_extent_clause),
    ),

  __method_extent_clause: ($) =>
    prec.right(seq(kw("EXTENT"), optional($.__method_extent_size))),
  __method_extent_size: ($) =>
    choice($.number_literal, $.constant, $.identifier),
  __method_field_name: ($) => choice($.qualified_name, $.identifier),
  __method_no_undo: ($) => token(/NO-UNDO/i),
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
    choice(
      token(/APPEND/i),
      token(/BIND/i),
      token(/BY-VALUE/i),
      token(/BY-REFERENCE/i),
    ),
  __method_handle_parameter_option: ($) =>
    choice(token(/BIND/i), token(/BY-VALUE/i), token(/BY-REFERENCE/i)),
});
