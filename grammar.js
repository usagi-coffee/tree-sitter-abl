const PREC = {
  UNARY: 7,
  EXP: 6,
  MULTI: 5,
  ADD: 4,
  COMPARE: 3,
  LOGICAL: 2,
  EXTRA: -1
};

module.exports = grammar({
  name: "abl",

  externals: ($) => [
    $._namedot,
    $._namecolon,
    $._namedoublecolon,
    $._or_operator,
    $._and_operator,
    $._special_character
  ],
  extras: ($) => [$.comment, $.include, /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/],
  word: ($) => $.identifier,
  supertypes: ($) => [$._expression, $._statement, $._terminated_statement],
  conflicts: ($) => [
    [$.input_expression],
    // DEFINE * conflicts
    ...combinations([
      $.abl_statement,
      $.variable_definition,
      $.buffer_definition,
      $.query_definition,
      $.temp_table_definition,
      $.workfile_definition,
      $.property_definition,
      $.data_source_definition,
      $.event_definition,
      $.dataset_definition
    ])
  ],

  rules: {
    source_code: ($) => repeat($._statement),

    body: ($) => seq(choice(":"), repeat($._statement)),
    dot_body: ($) => seq(choice(":", "."), repeat($._statement)),

    file_name: ($) => /[A-z-_|0-9|\/]+\.[i]/i,
    comment: ($) =>
      choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
    constant: ($) =>
      seq("{", optional("&"), choice($.identifier, $._integer_literal), "}"),

    identifier: ($) => /[A-Z|a-z|\-|\\_]{1}[A-Z|a-z|\-|\\_|0-9]*/i,
    qualified_name: ($) =>
      seq(
        $.identifier,
        repeat1(seq(alias($._namedot, "."), choice($.identifier, "*")))
      ),

    _terminator: ($) => /\s*\./i,
    _block_terminator: ($) => seq(kw("END"), "."),

    null_expression: ($) => /\?/,
    boolean_literal: ($) =>
      choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),
    _integer_literal: ($) => /[0-9]+/,
    _decimal_literal: ($) =>
      seq($._integer_literal, alias($._namedot, "."), $._integer_literal),

    number_literal: ($) => choice($._integer_literal, $._decimal_literal),
    _string_literal: ($) =>
      seq(choice($.double_quoted_string, $.single_quoted_string)),

    date_literal: ($) => /\d{1,2}\/\d{1,2}\/\d{4}|\d{2}/,
    array_literal: ($) =>
      seq("[", repeat(seq($._expression, optional(","))), "]"),

    double_quoted_string: ($) =>
      seq('"', repeat(choice(/[^"\\]+/, /\\./, $._special_character)), '"'),

    single_quoted_string: ($) =>
      seq("'", repeat(choice(/[^'\\]+/, /\\./, $._special_character)), "'"),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    _logical_operator: ($) =>
      prec.left(
        choice(alias($._and_operator, "AND"), alias($._or_operator, "OR"))
      ),
    logical_expression: ($) =>
      prec.right(
        PREC.LOGICAL,
        seq($._expression, $._logical_operator, $._expression)
      ),

    type_tuning: ($) =>
      choice(
        seq(kw("AS"), field("type", choice($.primitive_type, $.identifier))),
        seq(kw("LIKE"), field("type", $.identifier))
      ),

    _unary_minus_expressions: ($) =>
      choice(
        $.identifier,
        $.number_literal,
        $.function_call,
        $.qualified_name,
        $.object_access,
        $.member_access,
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
    temp_table_expression: ($) =>
      seq(kw("TEMP-TABLE"), field("table", choice($._expression))),
    current_changed_expression: ($) =>
      seq(kw("CURRENT-CHANGED"), $._expression),
    locked_expression: ($) => seq(kw("LOCKED"), $._expression),
    dataset_expression: ($) => seq(prec.left(kw("DATASET")), $._expression),
    input_expression: ($) =>
      seq(
        kw("INPUT"),
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        optional(field("field", choice($.identifier, $.qualified_name)))
      ),

    _additive_operator: ($) => choice("+", "-"),
    additive_expression: ($) =>
      prec.left(
        PREC.ADD,
        choice(seq($._expression, $._additive_operator, $._expression))
      ),

    _multiplicative_operator: ($) => choice("*", "/", kw("MODULO")),
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

    array_access: ($) =>
      prec.right(
        1,
        seq(
          field("array", choice($.identifier, $.object_access)),
          "[",
          $._expression,
          "]"
        )
      ),

    /// Includes
    include_argument: ($) =>
      choice(
        seq(
          /\&/,
          field("name", $.identifier),
          "=",
          field("value", $._expression)
        ),
        field("name", $.identifier),
        field("value", $.double_quoted_string),
        $.constant
      ),
    include: ($) =>
      seq(
        "{",
        repeat($.constant),
        $.file_name,
        optional(repeat($.include_argument)),
        "}"
      ),

    primitive_type: ($) =>
      choice(
        kw("VOID"),
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
        kw("COM-HANDLE"),
        seq(kw("CLASS"), choice($.identifier, $.qualified_name)),
        $.qualified_name
      ),

    when_expression: ($) => seq(kw("WHEN"), $._expression),
    assignment: ($) =>
      seq(
        prec.left(
          choice(
            field("name", $.identifier),
            $.qualified_name,
            $.object_access,
            $.member_access
          )
        ),
        "=",
        prec.right($._expression),
        optional($.when_expression)
      ),

    variable_tuning: ($) =>
      seq(
        choice(
          seq(choice(kw("INITIAL"), kw("INIT")), $._expression),
          seq(kw("FORMAT"), $._expression),
          seq(kw("LABEL"), $._expression),
          seq(kw("COLUMN-LABEL"), $._expression),
          seq(kw("DECIMALS"), $._expression),
          seq(kw("EXTENT"), $.number_literal),
          kw("NO-UNDO")
        )
      ),

    scope_tuning: ($) =>
      choice(kw("NEW"), kw("GLOBAL"), kw("SHARED"), kw("STATIC")),
    access_tuning: ($) =>
      choice(
        kw("PRIVATE"),
        kw("PROTECTED"),
        kw("PUBLIC"),
        kw("PACKAGE-PRIVATE"),
        kw("PACKAGE-PROTECTED")
      ),
    serialization_tuning: ($) =>
      choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),

    variable_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.scope_tuning, $.access_tuning, $.serialization_tuning)),
        choice(kw("VARIABLE"), kw("VAR")),
        field("name", $.identifier),
        $.type_tuning,
        repeat($.variable_tuning),
        $._terminator
      ),

    variable_assignment: ($) => seq($.assignment, $._terminator),

    buffer_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.scope_tuning, $.access_tuning)),
        kw("BUFFER"),
        field("name", $.identifier),
        kw("FOR"),
        optional(kw("TEMP-TABLE")),
        field("table", choice($.identifier, $.qualified_name)),
        $._terminator
      ),

    query_definition_tuning: ($) =>
      choice(
        seq(kw("CACHE"), $.number_literal),
        "SCROLLING",
        kw("RCODE-INFORMATION")
      ),
    query_fields: ($) => seq("(", repeat($.identifier), ")"),
    query_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.scope_tuning, $.access_tuning)),
        kw("QUERY"),
        field("name", $.identifier),
        kw("FOR"),
        $.identifier,
        optional(seq(kw("FIELDS"), $.query_fields)),
        optional(seq(kw("EXCEPT"), $.query_fields)),
        repeat($.query_definition_tuning),
        $._terminator
      ),

    function_call_statement: ($) => seq($.function_call, $._terminator),
    _function_call_arguments: ($) =>
      prec.right(
        seq(
          $.function_call_argument,
          repeat(seq(",", $.function_call_argument))
        )
      ),

    argument_mode: ($) =>
      prec.right(
        choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"), kw("DATA-SOURCE"))
      ),

    argument_pass_type: ($) =>
      choice(kw("BY-VALUE"), kw("BY-REFERENCE"), kw("BIND")),
    _function_argument_with_mode: ($) =>
      seq(
        $.argument_mode,
        choice(
          seq(
            choice($.identifier, $.object_access, $.qualified_name),
            optional($.type_tuning)
          ),
          seq(
            choice(
              kw("TABLE"),
              kw("TABLE-HANDLE"),
              kw("DATASET"),
              kw("DATASET-HANDLE")
            ),
            choice($.identifier, $.qualified_name)
          )
        ),
        optional(kw("APPEND")),
        optional($.argument_pass_type)
      ),
    function_call_argument: ($) =>
      prec.right(1, choice($._function_argument_with_mode, $._expression)),

    function_call: ($) =>
      prec.right(
        1,
        seq(
          field(
            "function",
            choice($.identifier, prec.right(2, $.object_access))
          ),
          seq("(", optional($._function_call_arguments), ")"),
          optional(kw("NO-ERROR"))
        )
      ),

    if_statement: ($) =>
      seq(
        kw("IF"),
        field("condition", $._expression),
        kw("THEN"),
        choice($.do_block, $._terminated_statement),
        optional(repeat(choice($.else_if_statement, $.else_statement)))
      ),

    else_if_statement: ($) =>
      seq(
        kw("ELSE"),
        kw("IF"),
        field("condition", $._expression),
        kw("THEN"),
        choice($.do_block, $._terminated_statement)
      ),

    else_statement: ($) =>
      seq(kw("ELSE"), choice($.do_block, $._terminated_statement)),

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

    label: ($) => seq($.identifier, ":"),

    while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),

    repeat_tuning: ($) => choice(seq(kw("WITH"), kw("FRAME"), $.identifier)),

    repeat_statement: ($) =>
      seq(
        optional($.label),
        kw("REPEAT"),
        optional($.to_phrase),
        optional($.while_phrase),
        optional($.on_error_phrase),
        optional($.on_quit_phrase),
        optional($.on_stop_phrase),
        repeat($.repeat_tuning),
        optional($.body),
        $._block_terminator
      ),

    _procedure_terminator: ($) => seq(kw("END"), kw("PROCEDURE"), "."),
    procedure_statement: ($) =>
      seq(
        kw("PROCEDURE"),
        $.identifier,
        optional(kw("PRIVATE")),
        optional(alias($.dot_body, $.body)),
        choice($._block_terminator, $._procedure_terminator)
      ),

    procedure_parameter_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"), kw("RETURN")),
        choice(kw("PARAMETER"), kw("PARAM")),
        field("name", $.identifier),
        $.type_tuning,
        repeat($.variable_tuning),
        $._terminator
      ),

    _function_terminator: ($) =>
      choice(
        $._block_terminator,
        seq(kw("END"), kw("FUNCTION"), $._terminator)
      ),
    function_parameter_mode: ($) => choice(kw("INPUT"), kw("OUTPUT")),
    function_parameter: ($) =>
      seq(
        optional($.function_parameter_mode),
        optional(kw("DATASET")),
        $.identifier,
        choice($.type_tuning, kw("BIND"))
      ),

    function_statement: ($) =>
      seq(
        kw("FUNCTION"),
        field("name", $.identifier),
        seq(
          choice(kw("RETURNS"), kw("RETURN")),
          field("return_type", choice($.primitive_type, $.identifier))
        ),
        optional(seq("(", optional(_list($.function_parameter, ",")), ")")),
        optional(alias($.dot_body, $.body)),
        $._function_terminator
      ),

    return_statement: ($) =>
      seq(kw("RETURN"), optional($._expression), $._terminator),

    interface_body: ($) =>
      seq(
        ":",
        repeat(
          choice(
            $.property_definition,
            $.temp_table_definition,
            $.event_definition,
            $.method_definition,
            $.dataset_definition
          )
        )
      ),

    interface_tuning: ($) => choice($.inherits),
    interface_statement: ($) =>
      seq(
        kw("INTERFACE"),
        field(
          "name",
          choice($._string_literal, $.identifier, $.qualified_name)
        ),
        repeat($.interface_tuning),
        alias($.interface_body, $.body),
        kw("END"),
        optional(kw("INTERFACE")),
        $._terminator
      ),

    property_type: ($) => choice(kw("ABSTRACT"), kw("OVERRIDE")),
    property_tuning: ($) =>
      choice(
        seq(choice(kw("INITIAL"), kw("INIT")), $._expression),
        seq(kw("DECIMALS"), $._expression),
        seq(kw("EXTENT"), $.number_literal),
        kw("NO-UNDO")
      ),

    getter: ($) =>
      seq(
        optional($.access_tuning),
        kw("GET"),
        optional(
          seq(
            optional(seq("(", optional(_list($.function_parameter, ",")), ")")),
            $.body,
            kw("END"),
            optional(kw("GET"))
          )
        ),
        $._terminator
      ),

    setter: ($) =>
      seq(
        optional($.access_tuning),
        kw("SET"),
        optional(seq("(", optional(_list($.function_parameter, ",")), ")")),
        optional(seq($.body, kw("END"), optional(kw("SET")))),
        $._terminator
      ),

    property_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(
          choice(
            $.access_tuning,
            $.scope_tuning,
            $.property_type,
            $.serialization_tuning
          )
        ),
        kw("PROPERTY"),
        field("name", $.identifier),
        $.type_tuning,
        repeat($.property_tuning),
        choice(repeat1(choice($.getter, $.setter)), $._terminator)
      ),

    event_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.access_tuning, $.scope_tuning, $.property_type)),
        kw("EVENT"),
        $.identifier,
        optional(kw("SIGNATURE")),
        kw("VOID"),
        seq("(", optional(_list($.function_parameter, ",")), ")"),
        $._terminator
      ),

    method_tuning: ($) => choice(kw("ABSTRACT"), kw("OVERRIDE"), kw("FINAL")),
    method_definition: ($) =>
      seq(
        kw("METHOD"),
        repeat(choice($.access_tuning, $.scope_tuning, $.method_tuning)),
        field("return_type", choice($.primitive_type, $.identifier)),
        $.identifier,
        seq("(", optional(_list($.function_parameter, ",")), ")"),
        optional(seq($.body, kw("END"), optional(kw("METHOD")))),
        $._terminator
      ),

    data_relation: ($) =>
      seq(
        kw("DATA-RELATION"),
        kw("FOR"),
        _list(choice($.identifier, $.qualified_name), ","),
        kw("RELATION-FIELDS"),
        seq(
          "(",
          optional(_list(choice($.identifier, $.qualified_name), ",")),
          ")"
        )
      ),
    dataset_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.scope_tuning, $.access_tuning)),
        kw("DATASET"),
        field("name", $.identifier),
        kw("FOR"),
        _list(choice($.identifier, $.qualified_name), ","),
        optional($.data_relation),
        $._terminator
      ),

    using_statement: ($) =>
      seq(
        kw("USING"),
        choice($.identifier, $.qualified_name),
        optional(seq(kw("FROM"), choice(kw("ASSEMBLY"), kw("PROPATH")))),
        $._terminator
      ),

    class_body: ($) =>
      seq(
        ":",
        repeat(
          choice(
            $.property_definition,
            $.temp_table_definition,
            $.event_definition,
            $.method_definition,
            $.dataset_definition,
            $.constructor_definition,
            $.destructor_definition,
            $.variable_definition,
            $.query_definition,
            $.buffer_definition,
            $.data_source_definition
          )
        )
      ),

    constructor_definition: ($) =>
      seq(
        kw("CONSTRUCTOR"),
        repeat(choice($.scope_tuning, $.access_tuning)),
        $.identifier,
        seq("(", optional(_list($.function_parameter, ",")), ")"),
        $.body,
        kw("END"),
        optional(kw("CONSTRUCTOR")),
        $._terminator
      ),

    destructor_definition: ($) =>
      seq(
        kw("DESTRUCTOR"),
        repeat($.access_tuning),
        $.identifier,
        seq("(", ")"),
        $.body,
        kw("END"),
        optional(kw("DESTRUCTOR")),
        $._terminator
      ),

    class_tuning: ($) =>
      choice(
        $.inherits,
        $.implements,
        $.use_widget_pool,
        $.abstract,
        $.final,
        $.serializable
      ),

    class_statement: ($) =>
      seq(
        kw("CLASS"),
        field(
          "name",
          choice($._string_literal, $.identifier, $.qualified_name)
        ),
        repeat($.class_tuning),
        alias($.class_body, $.body),
        kw("END"),
        optional(kw("CLASS")),
        $._terminator
      ),

    inherits: ($) =>
      seq(
        kw("INHERITS"),
        _list(choice($._string_literal, $.identifier, $.qualified_name), ",")
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

    new_expression: ($) =>
      prec.right(
        seq(
          kw("NEW"),
          choice($.identifier, $.qualified_name),
          seq("(", optional($._function_call_arguments), ")"),
          optional("NO-ERROR")
        )
      ),

    object_access: ($) =>
      seq(
        field("object", $.identifier),
        repeat1(seq(alias($._namecolon, ":"), field("property", $.identifier)))
      ),

    member_access: ($) =>
      seq(
        field("object", $.identifier),
        repeat1(
          seq(alias($._namedoublecolon, "::"), field("property", $.identifier))
        )
      ),

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

    input_stream_tuning: ($) =>
      choice(
        seq(kw("LOB-DIR"), $._expression),
        kw("BINARY"),
        kw("ECHO"),
        kw("NO-ECHO"),
        choice(seq(kw("MAP"), $._expression), kw("NO-MAP")),
        kw("UNBUFFERED"),
        kw("NO-CONVERT"),
        seq(
          kw("CONVERT"),
          optional(seq(kw("TARGET"), $._expression)),
          optional(seq(kw("SOURCE"), $._expression))
        )
      ),
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
        repeat($.input_stream_tuning),
        $._terminator
      ),

    output_stream_tuning: ($) =>
      choice(
        choice(
          seq(kw("LOB-DIR"), $._expression),
          seq(kw("NUM-COPIES"), $._expression),
          kw("COLLATE"),
          kw("BINARY"),
          choice(kw("LANDSCAPE"), kw("PORTRAIT")),
          kw("APPEND"),
          kw("ECHO"),
          kw("NO-ECHO"),
          kw("KEEP-MESSAGES"),
          choice(seq(kw("MAP"), $._expression), kw("NO-MAP")),
          kw("PAGED"),
          seq(kw("PAGE-SIZE"), $._expression),
          kw("UNBUFFERED"),
          kw("NO-CONVERT"),
          seq(
            kw("CONVERT"),
            optional(seq(kw("TARGET"), $._expression)),
            optional(seq(kw("SOURCE"), $._expression))
          )
        )
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
        repeat($.output_stream_tuning),
        $._terminator
      ),

    on_error_phrase: ($) =>
      seq(
        kw("ON"),
        kw("ERROR"),
        kw("UNDO"),
        field("label", optional($.identifier)),
        ",",
        choice(
          seq(kw("LEAVE"), field("label", optional($.identifier))),
          seq(kw("NEXT"), field("label", optional($.identifier))),
          seq(kw("RETRY"), field("label", optional($.identifier))),
          seq(
            kw("RETURN"),
            choice(seq(kw("ERROR")), kw("NO-APPLY"), $._string_literal)
          ),
          kw("THROW")
        )
      ),

    on_stop_phrase: ($) =>
      seq(
        kw("ON"),
        kw("STOP"),
        kw("UNDO"),
        field("label", optional($.identifier)),
        ",",
        choice(
          seq(kw("LEAVE"), field("label", optional($.identifier))),
          seq(kw("NEXT"), field("label", optional($.identifier))),
          seq(kw("RETRY"), field("label", optional($.identifier))),
          seq(kw("RETURN"), choice(seq(kw("ERROR")), kw("NO-APPLY")))
        )
      ),

    on_quit_phrase: ($) =>
      seq(
        kw("ON"),
        kw("QUIT"),
        optional(seq(kw("UNDO"), optional($.identifier))),
        ",",
        choice(
          seq(kw("LEAVE"), field("label", optional($.identifier))),
          seq(kw("NEXT"), field("label", optional($.identifier))),
          seq(kw("RETRY"), field("label", optional($.identifier))),
          seq(kw("RETURN"), choice(seq(kw("ERROR")), kw("NO-APPLY")))
        )
      ),

    stop_after_phrase: ($) => seq(kw("STOP-AFTER"), $._expression),

    do_tuning: ($) => choice(kw("TRANSACTION")),
    to_phrase: ($) =>
      seq(
        $.assignment,
        kw("TO"),
        $._expression,
        optional(seq("BY", $.number_literal))
      ),

    do_block: ($) =>
      seq(
        optional($.label),
        kw("DO"),
        optional($.to_phrase),
        optional($.while_phrase),
        repeat($.do_tuning),
        optional($.stop_after_phrase),
        optional(choice($.on_error_phrase, $.on_stop_phrase, $.on_quit_phrase)),
        $.body,
        $._block_terminator
      ),

    _case_terminator: ($) =>
      choice($._block_terminator, seq(kw("END"), kw("CASE"), $._terminator)),

    _case_branch_body: ($) =>
      choice($.do_block, field("statement", $._terminated_statement)),

    case_conditon: ($) =>
      seq(optional(seq(kw("OR"), kw("WHEN"))), $._expression),

    case_when_branch: ($) =>
      seq(kw("WHEN"), repeat($.case_conditon), kw("THEN"), $._case_branch_body),
    case_otherwise_branch: ($) => seq(kw("OTHERWISE"), $._case_branch_body),

    case_body: ($) =>
      seq(":", repeat1($.case_when_branch), optional($.case_otherwise_branch)),

    case_statement: ($) =>
      seq(
        kw("CASE"),
        choice($.identifier, $.qualified_name, $.object_access),
        alias($.case_body, $.body),
        $._case_terminator
      ),

    where_clause: ($) => seq(kw("WHERE"), field("condition", $._expression)),

    // HACK: progress spaghetti allows to define tuning order before where clause
    _pre_tuning: ($) => prec.right(1, $.query_tuning),

    query_tuning: ($) =>
      choice(
        kw("NO-LOCK"),
        kw("SHARE-LOCK"),
        kw("EXCLUSIVE-LOCK"),
        kw("NO-WAIT"),
        kw("NO-ERROR"),
        seq(kw("USE-INDEX"), $.identifier),
        $.using
      ),

    sort_order: ($) =>
      choice(kw("ASCENDING"), kw("DESCENDING"), kw("DESC"), kw("ASC")),
    sort_column: ($) =>
      seq(field("column", $._expression), optional($.sort_order)),

    sort_clause: ($) =>
      seq(optional(kw("BREAK")), seq(kw("BY"), repeat1($.sort_column))),

    for_phrase: ($) =>
      seq(
        optional(field("type", choice(kw("EACH"), kw("FIRST"), kw("LAST")))),
        field("table", choice($.identifier, $.qualified_name)),
        optional($.of),
        optional($._pre_tuning),
        optional($.where_clause),
        repeat($.query_tuning),
        optional(repeat($.sort_clause)),
        optional($.on_error_phrase),
        optional($.on_quit_phrase),
        optional($.on_stop_phrase)
      ),

    for_statement: ($) =>
      seq(
        optional($.label),
        kw("FOR"),
        field("type", choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
        field("table", choice($.identifier, $.qualified_name)),
        optional($.of),
        optional($._pre_tuning),
        optional($.where_clause),
        repeat($.query_tuning),
        optional(repeat($.sort_clause)),
        optional($.on_error_phrase),
        optional($.on_quit_phrase),
        optional($.on_stop_phrase),
        repeat(seq(",", $.for_phrase)),
        $.body,
        $._block_terminator
      ),

    _find_type: ($) =>
      choice(kw("FIRST"), kw("LAST"), kw("NEXT"), kw("PREV"), kw("CURRENT")),

    find_statement: ($) =>
      seq(
        kw("FIND"),
        field("type", optional($._find_type)),
        field("table", choice($.identifier, $.qualified_name)),
        optional($.of),
        optional($._pre_tuning),
        optional($.where_clause),
        repeat($.query_tuning),
        $._terminator
      ),

    can_find_expression: ($) =>
      seq(
        kw("CAN-FIND"),
        "(",
        optional(choice(kw("FIRST"), kw("LAST"))),
        field("table", choice($.identifier, $.qualified_name)),
        optional(field("constant", $._expression)),
        repeat(choice($.query_tuning, $.of, $.where_clause)),
        ")"
      ),

    of: ($) => seq(kw("OF"), choice($.identifier, $.qualified_name)),
    using: ($) =>
      seq(
        kw("USING"),
        seq($.using_field, repeat(seq(kw("AND"), $.using_field)))
      ),
    using_field: ($) =>
      seq(
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        field("field", choice($.identifier, $.qualified_name))
      ),

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
        $.body,
        kw("END"),
        optional(kw("CATCH")),
        $._terminator
      ),

    finally_statement: ($) =>
      seq(
        kw("FINALLY"),
        $.body,
        kw("END"),
        optional(kw("FINALLY")),
        $._terminator
      ),

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

    available_expression: ($) =>
      seq(
        choice(kw("AVAIL"), kw("AVAILABLE")),
        choice($.parenthesized_expression, $.identifier)
      ),

    undo_statement: ($) =>
      seq(
        kw("UNDO"),
        field("label", optional($.identifier)),
        ",",
        choice(
          seq(kw("LEAVE"), field("label", optional($.identifier))),
          seq(kw("NEXT"), field("label", optional($.identifier))),
          seq(kw("RETRY"), field("label", optional($.identifier))),
          seq(kw("RETURN"), choice(seq(kw("ERROR")), kw("NO-APPLY"))),
          seq(kw("THROW"), $.new_expression)
        ),
        $._terminator
      ),

    error_scope_statement: ($) =>
      seq(
        choice(kw("ROUTINE-LEVEL"), kw("BLOCK-LEVEL")),
        $.on_error_phrase,
        $._terminator
      ),

    temp_table_tuning: ($) => choice(kw("NO-UNDO"), kw("REFERENCE-ONLY")),
    field_option: ($) =>
      choice(
        seq(kw("COLUMN-LABEL"), $._string_literal),
        seq(kw("LABEL"), $._string_literal),
        seq(kw("FORMAT"), $._string_literal),
        seq(kw("DECIMALS"), $.number_literal),
        seq(kw("EXTENT"), $.number_literal),
        seq(choice(kw("INITIAL"), kw("INIT")), $._expression),
        kw("SERIALIZE-HIDDEN"),
        seq(kw("SERIALIZE-NAME"), $._string_literal),
        seq(kw("XML-DATA-TYPE"), $._string_literal),
        seq(kw("XML-NODE-TYPE"), $._string_literal),
        seq(kw("XML-NODE-NAME"), $._string_literal),
        seq(kw("HELP"), $._string_literal),
        seq(kw("NOT"), kw("CASE-SENSITIVE"))
      ),
    field_definition: ($) =>
      seq(kw("FIELD"), $.identifier, $.type_tuning, repeat($.field_option)),
    index_tuning: ($) =>
      choice(
        seq(choice(kw("IS"), kw("AS")), kw("PRIMARY")),
        seq(choice(kw("IS"), kw("AS")), kw("UNIQUE")),
        seq(choice(kw("IS"), kw("AS")), kw("WORD-INDEX"))
      ),
    index_definition: ($) =>
      prec.left(
        seq(
          kw("INDEX"),
          $.identifier,
          repeat($.index_tuning),
          repeat($.sort_column)
        )
      ),

    workfile_tuning: ($) => kw("NO-UNDO"),
    workfile_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.access_tuning, $.scope_tuning)),
        choice(kw("WORKFILE"), kw("WORK-TABLE")),
        field("name", $.identifier),
        repeat($.workfile_tuning),
        optional($.type_tuning),
        repeat($.field_definition),
        $._terminator
      ),

    temp_table_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        repeat(choice($.scope_tuning, $.access_tuning, $.serialization_tuning)),
        kw("TEMP-TABLE"),
        $.identifier,
        repeat($.temp_table_tuning),
        optional($.type_tuning),
        repeat(choice($.field_definition, $.index_definition)),
        $._terminator
      ),

    widget_field: ($) =>
      seq(
        optional(kw("FIELD")),
        $.identifier,
        optional(seq(kw("IN"), kw("FRAME"), $.identifier))
      ),

    widget_phrase: ($) =>
      prec.left(seq(kw("FRAME"), $.identifier, repeat($.widget_field))),

    on_statement: ($) =>
      seq(
        kw("ON"),
        seq($._expression, repeat(seq(",", $._expression))),
        optional(kw("ANYWHERE")),
        kw("OF"),
        seq($._expression, repeat(seq(",", $._expression))),
        optional(kw("IN")),
        repeat($.widget_phrase),
        $.do_block
      ),

    data_source_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        optional($.access_tuning),
        optional($.scope_tuning),
        kw("DATA-SOURCE"),
        $.identifier,
        kw("FOR"),
        optional(seq(kw("QUERY"), $.identifier)),
        choice(
          seq(
            _list(choice($.identifier, $.qualified_name), ","),
            $._terminator
          ),
          $._terminator
        )
      ),

    prompt_for_statement: ($) =>
      seq(
        kw("PROMPT-FOR"),
        choice($.identifier, $.qualified_name),
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        choice(seq(kw("EDITING"), $.body, $._block_terminator), $._terminator)
      ),

    variable: ($) => choice(field("name", $.identifier), $.assignment),
    var_statement: ($) =>
      seq(
        // FIXME: hack to avoid breaking assignments where identifier begins with var
        kw("VAR "),
        optional(
          choice($.scope_tuning, $.access_tuning, $.serialization_tuning)
        ),
        field(
          "type",
          choice($.primitive_type, $.identifier, $._string_literal)
        ),
        optional(seq("[", optional(field("size", $.number_literal)), "]")),
        repeat(seq($.variable, optional(","))),
        $._terminator
      ),

    image_phrase: ($) =>
      seq(
        choice(kw("IMAGE"), kw("IMAGE-UP")),
        seq(kw("FILE"), $._string_literal),
        optional(
          seq(
            choice(
              kw("IMAGE-SIZE"),
              kw("IMAGE-SIZE-CHARS"),
              kw("IMAGE-SIZE-PIXELS")
            ),
            field("width", $.number_literal),
            kw("BY"),
            field("height", $.number_literal)
          )
        ),
        optional(
          seq(
            kw("FROM"),
            choice(
              seq(kw("X"), $.number_literal, kw("Y"), $.number_literal),
              seq(kw("ROW"), $.number_literal, kw("COLUMN"), $.number_literal)
            )
          )
        )
      ),

    size_phrase: ($) =>
      seq(
        choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
        field("width", $.number_literal),
        kw("BY"),
        field("height", $.number_literal)
      ),

    button_tuning: ($) =>
      choice(
        seq(kw("AUTO-GO"), optional(kw("AUTO-ENDKEY"))),
        kw("DEFAULT"),
        seq(kw("BGCOLOR"), $._expression),
        seq(kw("CONTEXT-HELP-ID"), $._expression),
        seq(kw("DCOLOR"), $._expression),
        kw("DROP-TARGET"),
        seq(kw("FGCOLOR"), $._expression),
        seq(kw("FONT"), $.number_literal),
        seq(kw("IMAGE-DOWN"), $.image_phrase),
        seq(kw("IMAGE"), $.image_phrase),
        seq(kw("IMAGE-UP"), $.image_phrase),
        seq(kw("IMAGE-INSENSITIVE"), $.image_phrase),
        seq(kw("MOUSE-POINTER"), $.identifier),
        seq(kw("LABEL"), $._string_literal),
        seq(kw("LIKE"), $.identifier),
        seq(kw("PFCOLOR"), $._expression),
        seq(kw("NO-FOCUS"), optional(kw("FLAT-BUTTON"))),
        kw("NO-CONVERT-3D-COLORS"),
        seq(kw("TOOLTIP"), $._string_literal),
        $.size_phrase
      ),

    button_definition: ($) =>
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        optional($.access_tuning),
        kw("BUTTON"),
        field("name", $.identifier),
        repeat($.button_tuning),
        $._terminator
      ),

    // Supertypes
    _expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.unary_expression,
        $.boolean_literal,
        $._string_literal,
        $.date_literal,
        $.number_literal,
        $.array_literal,
        $.null_expression,
        $._binary_expression,
        $.qualified_name,
        $.object_access,
        $.member_access,
        $.array_access,
        $.function_call,
        $.ternary_expression,
        $.available_expression,
        $.accumulate_expression,
        $.ambiguous_expression,
        $.temp_table_expression,
        $.current_changed_expression,
        $.locked_expression,
        $.dataset_expression,
        $.input_expression,
        $.can_find_expression,
        $.new_expression,
        $.identifier,
        $.constant
      ),

    _statement: ($) =>
      choice(
        $.var_statement,
        $.variable_definition,
        $.variable_assignment,
        $.buffer_definition,
        $.query_definition,
        $.stream_definition,
        $.procedure_statement,
        $.procedure_parameter_definition,
        $.function_statement,
        $.function_call_statement,
        $.return_statement,
        $.if_statement,
        $.for_statement,
        $.repeat_statement,
        $.find_statement,
        $._stream_statement,
        $.case_statement,
        $.do_block,
        $.input_close_statement,
        $.output_close_statement,
        $.assign_statement,
        $.catch_statement,
        $.finally_statement,
        $.accumulate_statement,
        $.undo_statement,
        $.error_scope_statement,
        $.temp_table_definition,
        $.workfile_definition,
        $.using_statement,
        $.class_statement,
        $.interface_statement,
        $.on_statement,
        $.prompt_for_statement,
        $.dataset_definition,
        $.button_definition,
        $.abl_statement,
        prec.left(PREC.EXTRA, $.label)
      ),

    _terminated_statement: ($) =>
      choice(
        $.variable_definition,
        $.variable_assignment,
        $.buffer_definition,
        $.query_definition,
        $.stream_definition,
        $.function_call_statement,
        $.return_statement,
        $.for_statement,
        $.repeat_statement,
        $.find_statement,
        $._stream_statement,
        $.case_statement,
        $.input_close_statement,
        $.output_close_statement,
        $.assign_statement,
        $.accumulate_statement,
        $.undo_statement,
        $.error_scope_statement,
        $.temp_table_definition,
        $.workfile_definition,
        $.class_statement,
        $.interface_statement,
        $.on_statement,
        $.abl_statement
      )
  }
});

function _list(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

function kw(keyword) {
  if (keyword.toUpperCase() != keyword) {
    throw new Error(`Expected upper case keyword got ${keyword}`);
  }

  return alias(reserved(createCaseInsensitiveRegex(keyword)), keyword);
}

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

function combinations(arr) {
  let result = [];

  // Helper function to generate combinations
  function generateCombination(start, combination) {
    for (let i = start; i < arr.length; i++) {
      combination.push(arr[i]);
      result.push([...combination]);
      generateCombination(i + 1, combination);
      combination.pop();
    }
  }

  generateCombination(0, []);
  return result;
}
