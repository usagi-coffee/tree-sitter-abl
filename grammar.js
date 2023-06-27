const PREC = {
  PRIMARY: 8,

  COMPARE: 7,
  UNARY: 6,
  EXP: 5,
  MULTI: 4,
  ADD: 3,
};

const _list = (rule, separator) => seq(rule, repeat(seq(separator, rule)));

function kw(keyword) {
  if (keyword.toUpperCase() != keyword) {
    throw new Error(`Expected upper case keyword got ${keyword}`);
  }

  return alias(reserved(createCaseInsensitiveRegex(keyword)), keyword);
}

module.exports = grammar({
  name: "abl",

  extras: ($) => [$.comment, $.include, /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/],
  word: ($) => $.identifier,

  rules: {
    source_code: ($) => repeat($.statement),

    /// Main
    identifier: ($) => /[A-z_]{1}[A-z-_|0-9]*/i,
    file_name: ($) => /[A-z-_|0-9]+\.[i]/i,

    // FIXME: ugly hack
    field_identifier: ($) => token.immediate(/\.[A-z_]{1}[A-z-_|0-9]*/),

    terminator: ($) => /\s*\./i,
    block_terminator: ($) => seq(kw("END"), "."),

    null_expression: ($) => /\?/,
    boolean_expression: ($) => choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),

    expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.unary_expression,
        $.boolean_expression,
        $.string_literal,
        $.number_literal,
        $.null_expression,
        $.comparison,
        $.binary_expression,
        $.field_access,
        $.object_access,
        $.function_call,
        $.ternary_expression,
        $.available_expression,
        $.accumulate_expression,
        $.identifier
      ),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    field_access: ($) =>
      seq(field("table", $.identifier), field("field", $.field_identifier)),

    unary_operator: ($) => choice(kw("-"), kw("NOT")),
    unary_expression: ($) =>
      prec(PREC.UNARY, seq($.unary_operator, prec.right($.expression))),

    additive_operator: ($) => choice("+", "-"),
    additive_expression: ($) =>
      prec(
        PREC.ADD,
        choice(
          seq(
            prec.left($.expression),
            $.additive_operator,
            prec.right(PREC.PRIMARY, $.expression)
          )
        )
      ),

    multiplicative_operator: ($) => choice("*", "/"),
    multiplicative_expression: ($) =>
      prec(
        PREC.MULTI,
        choice(
          seq(
            prec.left($.expression),
            $.multiplicative_operator,
            prec.right(PREC.PRIMARY, $.expression)
          )
        )
      ),

    binary_expression: ($) =>
      choice($.additive_expression, $.multiplicative_expression),

    comparator: ($) => choice("<", "<=", "<>", "=", ">", ">=", kw("BEGINS")),
    comparison: ($) =>
      prec(
        PREC.COMPARE,
        seq(prec.left($.expression), $.comparator, prec.right($.expression))
      ),

    statement: ($) =>
      choice(
        $.variable_definition,
        $.variable_assignment,
        $.buffer_definition,
        $.stream_definition,
        $.procedure_statement,
        $.procedure_parameter_definition,
        $.function_statement,
        $.function_call_statement,
        $.return_statement,
        $.if_statement,
        $.loop_statement,
        $.for_statement,
        $.find_statement,
        $.transaction_statement,
        $.stream_statement,
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

    conditions: ($) => _list($.expression, choice(kw("AND"), kw("OR"))),

    /// Comments
    comment: ($) => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),

    /// Includes
    include_argument: ($) =>
      choice(
        seq(
          /\&/,
          field("name", $.identifier),
          "=",
          field("value", $.double_quoted_string)
        ),
        field("name", $.identifier)
      ),
    include: ($) =>
      seq("{", $.file_name, optional(repeat($.include_argument)), "}"),

    /// Primitives
    primitive_type: ($) =>
      choice(
        kw("LOGICAL"),
        kw("INTEGER"),
        kw("INT"),
        kw("CHARACTER"),
        kw("CHAR"),
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
        choice(
          seq(
            kw("AS"),
            field("type", $.primitive_type),
            repeat($.variable_tuning)
          ),
          seq(kw("LIKE"), field("like", $.identifier))
        ),
        $.terminator
      ),

    variable_assignment: ($) => seq($.assignment, $.terminator),

    buffer_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        kw("BUFFER"),
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
        kw("THEN DO"),
        ":",
        repeat($.statement),
        $.block_terminator,
        optional(repeat(choice($.else_do_statement, $.else_do_if_statement)))
      ),

    else_do_statement: ($) =>
      seq(kw("ELSE DO"), ":", repeat($.statement), $.block_terminator),

    else_do_if_statement: ($) =>
      seq(
        kw("ELSE IF"),
        field("conditions", $.conditions),
        kw("THEN DO"),
        ":",
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
      seq(kw("REPEAT"), ":", repeat($.statement), $.block_terminator),

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
    procedure_terminator: ($) => kw("END PROCEDURE."),
    procedure_statement: ($) =>
      seq(
        kw("PROCEDURE"),
        $.identifier,
        optional(kw("PRIVATE")),
        ":",
        repeat($.statement),
        $.procedure_terminator
      ),

    procedure_parameter_definition: ($) =>
      seq(
        kw("DEFINE"),
        choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"), kw("RETURN")),
        kw("PARAMETER"),
        $.identifier,
        kw("AS"),
        $.primitive_type,
        repeat($.variable_tuning),
        $.terminator
      ),

    /// Functions
    function_terminator: ($) =>
      choice($.block_terminator, seq(kw("END FUNCTION"), ".")),
    function_parameter_mode: ($) => choice(kw("INPUT"), kw("OUTPUT")),
    function_parameter: ($) =>
      seq($.function_parameter_mode, $.identifier, kw("AS"), $.primitive_type),

    function_statement: ($) =>
      seq(
        kw("FUNCTION"),
        field("name", $.identifier),
        seq(
          choice(kw("RETURNS"), kw("RETURN")),
          field("return_type", $.primitive_type)
        ),
        seq("(", optional(_list($.function_parameter, ",")), ")"),
        choice(":", $.terminator),
        repeat($.statement),
        $.function_terminator
      ),

    return_statement: ($) =>
      seq(kw("RETURN"), optional($.expression), $.terminator),

    /// Objects
    object_access: ($) =>
      seq(
        $.identifier,
        repeat1(
          seq(
            /:/,
            choice(
              field("property", $.identifier),
              field("method", $.function_call)
            )
          )
        )
      ),

    /// Streams
    stream_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        kw("STREAM"),
        $.identifier,
        $.terminator
      ),

    stream_terminator: ($) =>
      choice(
        seq(kw("INPUT"), kw("CLOSE"), $.terminator),
        seq(kw("INPUT"), kw("STREAM"), $.identifier, kw("CLOSE"), $.terminator),
        seq(kw("OUTPUT"), kw("CLOSE"), $.terminator),
        seq(kw("OUTPUT"), kw("STREAM"), $.identifier, kw("CLOSE"), $.terminator)
      ),

    stream_statement: ($) =>
      choice($.input_stream_statement, $.output_stream_statement),

    input_stream_statement: ($) =>
      seq(
        kw("INPUT"),
        optional(
          seq(
            choice(kw("STREAM"), kw("STREAM-HANDLE")),
            field("source", $.identifier)
          )
        ),
        kw("FROM"),
        field("target", $.expression),
        $.terminator,
        repeat($.statement),
        $.stream_terminator
      ),

    output_stream_statement: ($) =>
      seq(
        kw("OUTPUT"),
        optional(
          seq(
            choice(kw("STREAM"), kw("STREAM-HANDLE")),
            field("source", $.identifier)
          )
        ),
        kw("TO"),
        field("target", $.expression),
        $.terminator,
        repeat($.statement),
        $.stream_terminator
      ),

    /// ABL queries
    where_clause: ($) => seq(kw("WHERE"), field("conditions", $.conditions)),

    query_tuning: ($) =>
      choice(
        kw("NO-LOCK"),
        kw("SHARE-LOCK"),
        kw("EXCLUSIVE-LOCK"),
        kw("NO-WAIT"),
        kw("NO-ERROR"),
        seq(kw("USE-INDEX"), $.identifier)
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

    // DO TRANSACTION statement
    transaction_statement: ($) =>
      seq(kw("DO TRANSACTION"), ":", repeat($.statement), $.block_terminator),

    /// ABL statements
    abl_statement: ($) =>
      choice(
        $.assign_statement,
        $.accumulate_statement,
        seq(
          field("statement", $.identifier),
          repeat($.expression),
          $.terminator
        )
      ),

    assign_statement: ($) =>
      seq(
        kw("ASSIGN"),
        repeat($.assignment),
        optional("NO-ERROR"),
        $.terminator
      ),

    // Accumulate
    accumulate_aggregate: ($) =>
      choice(
        kw("AVERAGE"),
        kw("COUNT"),
        kw("MAXIMUM"),
        kw("MINIMUM"),
        kw("TOTAL"),
        kw("SUB-AVERAGE"),
        kw("SUB-COUNT"),
        kw("SUB-MAXIMUM"),
        kw("SUB-MINIMUM"),
        kw("SUB-TOTAL")
      ),

    accumulate_statement: ($) =>
      seq(
        kw("ACCUMULATE"),
        choice($.expression, $.identifier),
        seq(
          "(",
          seq($.accumulate_aggregate, repeat(seq(" ", $.accumulate_aggregate))),
          ")"
        ),
        $.terminator
      ),

    accumulate_expression: ($) =>
      seq(kw("ACCUM"), $.accumulate_aggregate, prec.left($.expression)),

    // Available
    available_expression: ($) =>
      seq(
        choice(kw("AVAIL "), kw("AVAILABLE ")),
        choice($.parenthesized_expression, $.identifier)
      ),
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
