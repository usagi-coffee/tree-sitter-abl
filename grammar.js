const _list = (rule, separator) => seq(rule, repeat(seq(separator, rule)));

function kw(keyword) {
  if (keyword.toUpperCase() != keyword) {
    throw new Error(`Expected upper case keyword got ${keyword}`);
  }

  return alias(reserved(createCaseInsensitiveRegex(keyword)), keyword);
}

module.exports = grammar({
  name: "abl",

  extras: ($) => [$.comment, /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/],
  word: ($) => $.identifier,

  rules: {
    source_code: ($) => repeat($.statement),

    /// Main
    identifier: ($) => /[A-z_]{1}[A-z-_|0-9]*/i,
    terminator: ($) => /\s*\./i,
    block_terminator: ($) => choice(/END\./i),

    null_expression: ($) => /\?/,

    expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.string_literal,
        $.number_literal,
        $.null_expression,
        $.comparison,
        $.object_property,
        $.function_call,
        $.ternary_expression,
        $.identifier
      ),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    comparator: ($) => choice("<", "<=", "<>", "=", ">", ">="),
    comparison: ($) =>
      prec.left(
        seq(prec.left($.expression), $.comparator, prec.right($.expression))
      ),

    statement: ($) =>
      choice(
        $.variable_definition,
        $.variable_assignment,
        $.buffer_definition,
        $.procedure_statement,
        $.function_statement,
        $.function_call_statement,
        $.return_statement,
        $.if_statement,
        $.loop_statement,
        $.for_statement,
        $.find_statement,
        $.abl_statement,
        prec.left(-1, $.block_terminator)
      ),

    terminated_statement: ($) =>
      choice(
        $.variable_assignment,
        $.function_call_statement,
        $.return_statement,
        $.abl_statement
      ),

    conditions: ($) =>
      _list(
        seq(optional(kw("NOT")), $.expression),
        choice(kw("AND"), kw("OR"))
      ),

    /// Comments
    comment: ($) => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),

    /// Primitives
    primitive_type: ($) =>
      choice(
        kw("LOGICAL"),
        kw("INTEGER"),
        kw("CHARACTER"),
        kw("DECIMAL"),
        kw("DATE"),
        kw("DATETIME"),
        kw("DATETIME-TZ"),
        kw("INT64"),
        kw("LONGCHAR"),
        kw("MEMPTR"),
        kw("RAW"),
        kw("RECID"),
        kw("ROWID"),
        kw("HANDLE"),
        kw("COM-HANDLE")
      ),

    number_literal: ($) => /[0-9]+/i,
    string_literal: ($) =>
      seq(choice($.double_quoted_string, $.single_quoted_string)),

    double_quoted_string: ($) =>
      seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"'),

    single_quoted_string: ($) =>
      seq("'", repeat(choice(/[^'\\]+/, /\\./)), "'"),

    /// Variables
    assignment: ($) =>
      seq(prec.left($.identifier), "=", prec.right($.expression)),

    variable_tuning: ($) =>
      seq(choice(kw("NO-UNDO"), kw("INITIAL")), optional($.expression)),

    variable_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        choice(kw("VARIABLE"), kw("VAR")),
        field("name", $.identifier),
        kw("AS"),
        field("type", $.primitive_type),
        repeat($.variable_tuning),
        $.terminator
      ),

    variable_assignment: ($) => seq($.assignment, $.terminator),

    buffer_definition: ($) =>
      seq(
        kw("DEFINE BUFFER"),
        field("name", $.identifier),
        kw("FOR"),
        optional(kw("TEMP-TABLE")),
        field("table", $.identifier),
        $.terminator
      ),

    /// Function
    function_call_statement: ($) => seq($.function_call, $.terminator),
    function_call_argument: ($) =>
      prec.right(seq($.expression, repeat(seq(",", $.expression)))),

    function_call: ($) =>
      prec.right(
        1,
        seq(
          field("function", $.identifier),
          seq("(", optional($.function_call_argument), ")")
        )
      ),

    /// IF statement
    if_statement: ($) => choice($.if_do_statement, $.if_then_statement),

    if_do_statement: ($) =>
      seq(
        kw("IF"),
        field("conditions", $.conditions),
        kw("THEN DO:"),
        repeat($.statement),
        $.block_terminator,
        optional(repeat(choice($.else_do_statement, $.else_do_if_statement)))
      ),

    else_do_statement: ($) =>
      seq(kw("ELSE DO:"), repeat($.statement), $.block_terminator),

    else_do_if_statement: ($) =>
      seq(
        kw("ELSE IF"),
        field("conditions", $.conditions),
        kw("THEN DO:"),
        repeat($.statement),
        $.block_terminator
      ),

    if_then_statement: ($) =>
      seq(
        kw("IF"),
        field("conditions", $.conditions),
        kw("THEN"),
        $.terminated_statement,
        optional($.else_then_statement)
      ),

    else_then_statement: ($) => seq("ELSE", $.terminated_statement),

    ternary_expression: ($) =>
      prec.right(
        seq(
          kw("IF"),
          field("conditions", $.conditions),
          kw("THEN"),
          field("then", $.expression),
          kw("ELSE"),
          field("else", $.expression)
        )
      ),

    /// Loop statements
    loop_statement: ($) =>
      choice($.repeat_statement, $.do_while_statement, $.do_statement),

    repeat_statement: ($) =>
      seq(kw("REPEAT:"), repeat($.statement), $.block_terminator),

    do_while_statement: ($) =>
      seq(
        kw("DO WHILE"),
        $.conditions,
        ":",
        repeat($.statement),
        $.block_terminator
      ),

    do_statement: ($) =>
      seq(
        kw("DO"),
        $.assignment,
        kw("TO"),
        $.number_literal,
        ":",
        repeat($.statement),
        $.block_terminator
      ),

    /// Procedures
    procedure_terminator: ($) => /END PROCEDURE\./i,
    procedure_statement: ($) =>
      seq(
        kw("PROCEDURE"),
        $.identifier,
        optional("PRIVATE"),
        ":",
        repeat($.statement),
        $.procedure_terminator
      ),

    /// Functions
    function_terminator: ($) => choice($.block_terminator, /END FUNCTION\./i),
    function_parameter_mode: ($) => choice(kw("INPUT"), kw("OUTPUT")),
    function_parameter: ($) =>
      seq($.function_parameter_mode, $.identifier, kw("AS"), $.primitive_type),

    function_statement: ($) =>
      seq(
        kw("FUNCTION"),
        field("name", $.identifier),
        seq(kw("RETURNS"), field("return_type", $.primitive_type)),
        seq("(", optional(_list($.function_parameter, ",")), ")"),
        $.terminator,
        repeat($.statement),
        $.function_terminator
      ),

    return_statement: ($) => seq(kw("RETURN"), $.expression, $.terminator),

    /// Objects
    object_property: ($) =>
      seq(
        $.identifier,
        repeat1(seq(/:/, choice($.identifier, $.function_call)))
      ),

    /// ABL queries
    where_clause: ($) => seq(kw("WHERE"), field("conditions", $.conditions)),

    query_tuning: ($) =>
      choice(
        kw("NO-LOCK"),
        kw("SHARE-LOCK"),
        kw("EXCLUSIVE-LOCK"),
        kw("NO-WAIT"),
        kw("NO-ERROR")
      ),

    /// FOR statement
    sort_order: ($) => choice(kw("DESCENDING")),
    sort_column: ($) =>
      seq(field("column", $.identifier), optional($.sort_order)),

    sort_clause: ($) =>
      seq(optional(kw("BREAK")), kw("BY"), repeat1($.sort_column)),

    for_statement: ($) =>
      seq(
        kw("FOR"),
        field("type", choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
        field("table", $.identifier),
        optional($.where_clause),
        repeat($.query_tuning),
        optional($.sort_clause),
        ":",
        repeat($.statement),
        $.block_terminator
      ),

    // FIND statement
    find_statement: ($) =>
      seq(
        kw("FIND"),
        field(
          "type",
          optional(choice(kw("FIRST"), kw("LAST"), kw("NEXT"), kw("PREV")))
        ),
        field("table", $.identifier),
        optional($.where_clause),
        repeat($.query_tuning),
        $.terminator
      ),

    /// ABL statements
    abl_statement: ($) =>
      choice(
        $.assign_statement,
        seq(
          field("statement", $.identifier),
          repeat($.expression),
          $.terminator
        )
      ),

    assign_statement: ($) =>
      seq(kw("ASSIGN"), repeat($.assignment), $.terminator),
  },
});

function reserved(regex) {
  return token(prec(1, new RegExp(regex)));
}

function createCaseInsensitiveRegex(word) {
  return new RegExp(
    word
      .split("")
      .map((letter) => `[${letter.toLowerCase()}${letter.toUpperCase()}]`)
      .join("")
  );
}
