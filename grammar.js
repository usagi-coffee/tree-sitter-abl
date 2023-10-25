const PREC = {
  UNARY: 7,
  EXP: 6,
  MULTI: 5,
  ADD: 4,
  COMPARE: 3,
  LOGICAL: 2
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

  externals: ($) => [$._namedot],
  extras: ($) => [$.comment, $.include, /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/],
  word: ($) => $.identifier,
  supertypes: ($) => [$._expression, $._statement],

  rules: {
    source_code: ($) => repeat($._statement),
    body: ($) => repeat1($._statement),

    /// Main
    identifier: ($) => /[A-z_]{1}[A-z-_|0-9]*/i,
    file_name: ($) => /[A-z-_|0-9]+\.[i]/i,

    qualified_name: ($) =>
      seq($.identifier, repeat1(seq(alias($._namedot, "."), $.identifier))),

    _terminator: ($) => /\s*\./i,
    _block_terminator: ($) => seq(kw("END"), "."),

    null_expression: ($) => /\?/,
    boolean_literal: ($) =>
      choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),

    _expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.unary_expression,
        $.boolean_literal,
        $._string_literal,
        $.number_literal,
        $.null_expression,
        $._binary_expression,
        $.qualified_name,
        $.object_access,
        $.function_call,
        $.ternary_expression,
        $.available_expression,
        $.accumulate_expression,
        $.ambiguous_expression,
        $.current_changed_expression,
        $.locked_expression,
        $.input_expression,
        $.can_find_expression,
        $.identifier
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    _logical_operator: ($) => prec.left(choice(kw("AND"), kw("OR"))),
    logical_expression: ($) =>
      prec.right(
        PREC.LOGICAL,
        seq($._expression, $._logical_operator, $._expression)
      ),

    _unary_minus_expressions: ($) =>
      choice(
        $.identifier,
        $.number_literal,
        $.function_call,
        $.qualified_name,
        $.object_access,
        $.parenthesized_expression
      ),

    unary_expression: ($) =>
      choice(
        prec.left(
          PREC.UNARY,
          seq(kw("-"), prec.left($._unary_minus_expressions))
        ),
        prec.left(
          PREC.LOGICAL,
          seq(kw("NOT"), prec.left(PREC.LOGICAL, $._expression))
        )
      ),

    ambiguous_expression: ($) => seq(kw("AMBIGUOUS"), $._expression),
    current_changed_expression: ($) =>
      seq(kw("CURRENT-CHANGED"), $._expression),
    locked_expression: ($) => seq(kw("LOCKED"), $._expression),
    input_expression: ($) =>
      seq(
        kw("INPUT"),
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        field("field", choice($.identifier, $.qualified_name))
      ),

    _additive_operator: ($) => choice("+", "-"),
    additive_expression: ($) =>
      prec.left(
        PREC.ADD,
        choice(seq($._expression, $._additive_operator, $._expression))
      ),

    _multiplicative_operator: ($) => choice("*", "/"),
    multiplicative_expression: ($) =>
      prec.left(
        PREC.MULTI,
        choice(seq($._expression, $._multiplicative_operator, $._expression))
      ),

    _comparison_operator: ($) =>
      choice(
        "<",
        "<=",
        "<>",
        "=",
        ">",
        ">=",
        kw("LT"),
        kw("LE"),
        kw("NE"),
        kw("EQ"),
        kw("GT"),
        kw("GE"),
        kw("BEGINS"),
        kw("MATCHES"),
        kw("CONTAINS")
      ),
    comparison_expression: ($) =>
      prec.left(
        PREC.COMPARE,
        seq($._expression, $._comparison_operator, $._expression)
      ),

    _binary_expression: ($) =>
      choice(
        $.additive_expression,
        $.multiplicative_expression,
        $.comparison_expression,
        $.logical_expression
      ),

    _statement: ($) =>
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
        $.class_statement,
        $._if_statement,
        $._loop_statement,
        $.for_statement,
        $.find_statement,
        $.transaction_statement,
        $._stream_statement,
        $.case_statement,
        $.input_close_statement,
        $.output_close_statement,
        $.assign_statement,
        $.catch_statement,
        $.finally_statement,
        $.accumulate_statement,
        $.abl_statement
      ),

    _terminated_statement: ($) =>
      choice(
        $.variable_assignment,
        $.function_call_statement,
        $.return_statement,
        $.abl_statement
      ),

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
        field("name", $.identifier),
        field("value", $.double_quoted_string)
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

    number_literal: ($) => /[0-9]+/,
    _string_literal: ($) =>
      seq(choice($.double_quoted_string, $.single_quoted_string)),

    double_quoted_string: ($) =>
      seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"'),

    single_quoted_string: ($) =>
      seq("'", repeat(choice(/[^'\\]+/, /\\./)), "'"),

    /// Variables
    assignment: ($) =>
      seq(prec.left($.identifier), "=", prec.right($._expression)),

    variable_tuning: ($) =>
      seq(choice(kw("NO-UNDO"), kw("INITIAL")), optional($._expression)),

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
        $._terminator
      ),

    variable_assignment: ($) => seq($.assignment, $._terminator),

    buffer_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        kw("BUFFER"),
        field("name", $.identifier),
        kw("FOR"),
        optional(kw("TEMP-TABLE")),
        field("table", $.identifier),
        $._terminator
      ),

    /// Function
    function_call_statement: ($) => seq($.function_call, $._terminator),
    function_call_argument: ($) =>
      prec.right(seq($._expression, repeat(seq(",", $._expression)))),

    function_call: ($) =>
      prec.right(
        1,
        seq(
          field("function", $.identifier),
          seq("(", optional($.function_call_argument), ")")
        )
      ),

    /// IF statement
    _if_statement: ($) => choice($.if_do_statement, $.if_then_statement),

    if_do_statement: ($) =>
      seq(
        kw("IF"),
        field("condition", $._expression),
        kw("THEN"),
        kw("DO"),
        ":",
        optional($.body),
        $._block_terminator,
        optional(repeat(choice($.else_do_statement, $.else_do_if_statement)))
      ),

    else_do_statement: ($) =>
      seq(kw("ELSE"), kw("DO"), ":", optional($.body), $._block_terminator),

    else_do_if_statement: ($) =>
      seq(
        kw("ELSE"),
        kw("IF"),
        field("condition", $._expression),
        kw("THEN"),
        kw("DO"),
        ":",
        optional($.body),
        $._block_terminator
      ),

    if_then_statement: ($) =>
      seq(
        kw("IF"),
        field("condition", $._expression),
        kw("THEN"),
        $._terminated_statement,
        optional(repeat($.else_then_if_statement)),
        optional($.else_then_statement)
      ),

    else_then_if_statement: ($) =>
      seq(
        kw("ELSE"),
        kw("IF"),
        field("condition", $._expression),
        kw("THEN"),
        $._terminated_statement
      ),
    else_then_statement: ($) => seq(kw("ELSE"), $._terminated_statement),

    ternary_expression: ($) =>
      prec.right(
        seq(
          kw("IF"),
          field("condition", $._expression),
          kw("THEN"),
          field("then", $._expression),
          kw("ELSE"),
          field("else", $._expression)
        )
      ),

    /// Loop statements
    _loop_statement: ($) =>
      choice($.repeat_statement, $.do_while_statement, $.do_statement),

    repeat_statement: ($) =>
      seq(kw("REPEAT"), ":", optional($.body), $._block_terminator),

    do_while_statement: ($) =>
      seq(
        kw("DO"),
        kw("WHILE"),
        field("condition", $._expression),
        ":",
        optional($.body),
        $._block_terminator
      ),

    do_statement: ($) =>
      seq(
        kw("DO"),
        $.assignment,
        kw("TO"),
        $._expression,
        ":",
        optional($.body),
        $._block_terminator
      ),

    /// Procedures
    _procedure_terminator: ($) => seq(kw("END"), kw("PROCEDURE"), "."),
    procedure_statement: ($) =>
      seq(
        kw("PROCEDURE"),
        $.identifier,
        optional(kw("PRIVATE")),
        ":",
        optional($.body),
        choice($._block_terminator, $._procedure_terminator)
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
        $._terminator
      ),

    /// Functions
    _function_terminator: ($) =>
      choice(
        $._block_terminator,
        seq(kw("END"), kw("FUNCTION"), $._terminator)
      ),
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
        choice(":", $._terminator),
        optional($.body),
        $._function_terminator
      ),

    return_statement: ($) =>
      seq(kw("RETURN"), optional($._expression), $._terminator),

    /// Classes
    class_statement: ($) =>
      seq(
        kw("CLASS"),
        field(
          "name",
          choice($._string_literal, $.identifier, $.qualified_name)
        ),
        repeat(
          choice(
            seq(
              kw("INHERITS"),
              field(
                "inherits",
                choice($._string_literal, $.identifier, $.qualified_name)
              )
            ),
            $.implements,
            $.use_widget_pool,
            $.abstract,
            $.final,
            $.serializable
          )
        ),
        ":",
        optional($.body),
        kw("END"),
        optional(kw("CLASS")),
        $._terminator
      ),

    implements: ($) =>
      seq(
        kw("IMPLEMENTS"),
        _list(choice($._string_literal, $.identifier, $.qualified_name), ",")
      ),

    use_widget_pool: ($) => kw("USE-WIDGET-POOL"),
    abstract: ($) => kw("ABSTRACT"),
    final: ($) => kw("FINAL"),
    serializable: ($) => kw("SERIALIZABLE"),

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
        $._terminator
      ),

    input_close_statement: ($) =>
      seq(
        kw("INPUT"),
        optional(
          choice(
            seq(kw("STREAM"), field("stream", $.identifier)),
            seq(kw("STREAM-HANDLE"), field("stream_handle", $.identifier))
          )
        ),
        kw("CLOSE"),
        $._terminator
      ),

    output_close_statement: ($) =>
      seq(
        kw("OUTPUT"),
        optional(
          choice(
            seq(kw("STREAM"), field("stream", $.identifier)),
            seq(kw("STREAM-HANDLE"), field("stream_handle", $.identifier))
          )
        ),
        kw("CLOSE"),
        $._terminator
      ),

    _stream_statement: ($) =>
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
        field("target", $._expression),
        $._terminator
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
        field("target", $._expression),
        $._terminator
      ),

    do_block: ($) => seq(kw("DO"), ":", optional($.body), $._block_terminator),

    _case_terminator: ($) =>
      choice($._block_terminator, seq(kw("END"), kw("CASE"), $._terminator)),

    _case_branch_body: ($) =>
      choice(
        $.do_block,
        $.repeat_statement,
        $.for_statement,
        $._terminated_statement
      ),

    case_when_branch: ($) =>
      seq(
        kw("WHEN"),
        field("value", $._expression),
        kw("THEN"),
        field("body", $._case_branch_body)
      ),
    case_otherwise_branch: ($) =>
      seq(kw("OTHERWISE"), field("body", $._case_branch_body)),

    case_body: ($) =>
      seq(repeat1($.case_when_branch), optional($.case_otherwise_branch)),

    case_statement: ($) =>
      seq(
        kw("CASE"),
        $.identifier,
        ":",
        optional($.case_body),
        $._case_terminator
      ),

    /// ABL queries
    where_clause: ($) => seq(kw("WHERE"), field("condition", $._expression)),

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
      seq(
        field("column", choice($.function_call, $.identifier)),
        optional($.sort_order)
      ),

    sort_clause: ($) =>
      seq(optional(kw("BREAK")), kw("BY"), repeat1($.sort_column)),

    for_statement: ($) =>
      seq(
        kw("FOR"),
        field("type", choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
        field("table", $.identifier),
        optional($.of),
        optional($.where_clause),
        repeat($.query_tuning),
        optional($.sort_clause),
        ":",
        optional($.body),
        $._block_terminator
      ),

    // FIND statement
    find_statement: ($) =>
      seq(
        kw("FIND"),
        field(
          "type",
          optional(
            choice(
              kw("FIRST"),
              kw("LAST"),
              kw("NEXT"),
              kw("PREV"),
              kw("CURRENT")
            )
          )
        ),
        field("table", $.identifier),
        optional($.of),
        optional($.where_clause),
        repeat($.query_tuning),
        $._terminator
      ),

    can_find_expression: ($) =>
      seq(
        kw("CAN-FIND"),
        "(",
        optional(choice(kw("FIRST"), kw("LAST"))),
        field("table", $.identifier),
        optional(field("constant", $._expression)),
        repeat(
          choice(
            $.query_tuning,
            $.of,
            $.where_clause,
            seq(
              alias($._using_first, $.using),
              repeat(alias($._using_and, $.using))
            )
          )
        ),
        ")"
      ),

    of: ($) => seq(kw("OF"), choice($.identifier, $.qualified_name)),
    _using_first: ($) =>
      seq(
        kw("USING"),
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        field("field", $.identifier)
      ),
    _using_and: ($) =>
      seq(
        kw("AND"),
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        field("field", $.identifier)
      ),

    // DO TRANSACTION statement
    transaction_statement: ($) =>
      seq(
        kw("DO"),
        kw("TRANSACTION"),
        ":",
        optional($.body),
        $._block_terminator
      ),

    /// ABL statements
    abl_statement: ($) =>
      seq(
        field("statement", $.identifier),
        repeat($._expression),
        $._terminator
      ),

    assign_statement: ($) =>
      seq(
        kw("ASSIGN"),
        repeat($.assignment),
        optional("NO-ERROR"),
        $._terminator
      ),

    catch_statement: ($) =>
      seq(
        kw("CATCH"),
        field("variable", $.identifier),
        kw("AS"),
        field(
          "type",
          seq(optional(kw("CLASS")), choice($.identifier, $.qualified_name))
        ),
        ":",
        optional($.body),
        kw("END"),
        optional(kw("CATCH")),
        $._terminator
      ),

    finally_statement: ($) =>
      seq(
        kw("FINALLY"),
        ":",
        optional($.body),
        kw("END"),
        optional(kw("FINALLY")),
        $._terminator
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
        choice($._expression, $.identifier),
        seq(
          "(",
          seq($.accumulate_aggregate, repeat(seq(" ", $.accumulate_aggregate))),
          ")"
        ),
        $._terminator
      ),

    accumulate_expression: ($) =>
      seq(kw("ACCUM"), $.accumulate_aggregate, prec.left($._expression)),

    // Available
    available_expression: ($) =>
      seq(
        choice(kw("AVAIL"), kw("AVAILABLE")),
        choice($.parenthesized_expression, $.identifier)
      )
  }
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
