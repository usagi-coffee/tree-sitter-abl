const _list = (rule, separator) => seq(rule, repeat(seq(separator, rule)));

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
      choice($.variable_assignment, $.function_call_statement),

    conditions: ($) =>
      _list(seq(optional("NOT"), $.expression), choice("AND", "OR")),

    /// Comments
    comment: ($) => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),

    /// Primitives
    primitive_type: ($) =>
      choice(
        "LOGICAL",
        "INTEGER",
        "CHARACTER",
        "DECIMAL",
        "DATE",
        "DATETIME",
        "DATETIME-TZ",
        "INT64",
        "LONGCHAR",
        "MEMPTR",
        "RAW",
        "RECID",
        "ROWID",
        "HANDLE",
        "COM-HANDLE"
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
      seq(choice("NO-UNDO", "INITIAL"), optional($.expression)),

    variable_definition: ($) =>
      seq(
        choice("DEFINE", "DEF"),
        choice("VARIABLE", "VAR"),
        field("name", $.identifier),
        "AS",
        field("type", $.primitive_type),
        repeat($.variable_tuning),
        $.terminator
      ),

    variable_assignment: ($) => seq($.assignment, $.terminator),

    buffer_definition: ($) =>
      seq(
        "DEFINE BUFFER",
        field("name", $.identifier),
        "FOR",
        optional("TEMP-TABLE"),
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
        "IF",
        field("conditions", $.conditions),
        "THEN DO:",
        repeat($.statement),
        $.block_terminator,
        optional(repeat(choice($.else_do_statement, $.else_do_if_statement)))
      ),

    else_do_statement: ($) =>
      seq("ELSE DO:", repeat($.statement), $.block_terminator),

    else_do_if_statement: ($) =>
      seq(
        "ELSE IF",
        field("conditions", $.conditions),
        "THEN DO:",
        repeat($.statement),
        $.block_terminator
      ),

    if_then_statement: ($) =>
      seq(
        "IF",
        field("conditions", $.conditions),
        "THEN",
        $.terminated_statement,
        optional($.else_then_statement)
      ),

    else_then_statement: ($) => seq("ELSE", $.terminated_statement),

    ternary_expression: ($) =>
      prec.right(
        seq(
          "IF",
          field("conditions", $.conditions),
          "THEN",
          field("then", $.expression),
          "ELSE",
          field("else", $.expression)
        )
      ),

    /// Loop statements
    loop_statement: ($) =>
      choice($.repeat_statement, $.do_while_statement, $.do_statement),

    repeat_statement: ($) =>
      seq("REPEAT:", repeat($.statement), $.block_terminator),

    do_while_statement: ($) =>
      seq(
        "DO WHILE",
        $.conditions,
        ":",
        repeat($.statement),
        $.block_terminator
      ),

    do_statement: ($) =>
      seq(
        "DO",
        $.assignment,
        "TO",
        $.number_literal,
        ":",
        repeat($.statement),
        $.block_terminator
      ),

    /// Procedures
    procedure_terminator: ($) => /END PROCEDURE\./i,
    procedure_statement: ($) =>
      seq(
        "PROCEDURE",
        $.identifier,
        optional("PRIVATE"),
        ":",
        repeat($.statement),
        $.procedure_terminator
      ),

    /// Functions
    function_terminator: ($) => choice($.block_terminator, /END FUNCTION\./i),
    function_parameter_mode: ($) => choice("INPUT", "OUTPUT"),
    function_parameter: ($) =>
      seq($.function_parameter_mode, $.identifier, "AS", $.primitive_type),

    function_statement: ($) =>
      seq(
        "FUNCTION",
        field("name", $.identifier),
        seq("RETURNS", field("return_type", $.primitive_type)),
        seq("(", optional(_list($.function_parameter, ",")), ")"),
        $.terminator,
        repeat($.statement),
        $.function_terminator
      ),

    return_statement: ($) => seq("RETURN", $.expression, $.terminator),

    /// Objects
    object_property: ($) =>
      seq(
        $.identifier,
        repeat1(seq(/:/, choice($.identifier, $.function_call)))
      ),

    /// ABL queries
    where_clause: ($) => seq("WHERE", field("conditions", $.conditions)),

    query_tuning: ($) =>
      choice("NO-LOCK", "SHARE-LOCK", "EXCLUSIVE-LOCK", "NO-WAIT", "NO-ERROR"),

    /// FOR statement
    sort_order: ($) => choice("DESCENDING"),
    sort_column: ($) =>
      seq(field("column", $.identifier), optional($.sort_order)),

    sort_clause: ($) => seq(optional("BREAK"), "BY", repeat1($.sort_column)),

    for_statement: ($) =>
      seq(
        "FOR",
        field("type", choice("EACH", "FIRST", "LAST")),
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
        "FIND",
        field("type", optional(choice("FIRST", "LAST", "NEXT", "PREV"))),
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

    assign_statement: ($) => seq("ASSIGN", repeat($.assignment), $.terminator),
  },
});
