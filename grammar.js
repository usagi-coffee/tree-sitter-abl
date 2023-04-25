const _list = (rule, separator) => seq(rule, repeat(seq(separator, rule)));

const comparison_operators = ["<", "<=", "<>", "=", ">", ">="];

const query_tunings = ["NO-LOCK", "NO-WAIT", "SHARE-LOCK", "EXCLUSIVE-LOCK"];

module.exports = grammar({
  name: "abl",

  word: ($) => $.identifier,

  rules: {
    source_code: ($) => repeat($.statement),

    /// Main
    identifier: ($) => /[a-z_]+/,
    terminator: ($) => ".",

    expression: ($) =>
      choice(
        $.string_literal,
        $.number_literal,
        $.comparison,
        $.function_call,
        $.identifier
      ),

    comparison: ($) =>
      seq(
        prec.left($.expression),
        field("comparator", choice(...comparison_operators)),
        prec.right($.expression)
      ),

    statement: ($) =>
      choice(
        $.variable_definition,
        $.variable_assignment,
        $.assign_statement,
        $.for_statement
      ),

    /// Primitives
    primitive_type: ($) => choice("LOGICAL", "INTEGER", "CHARACTER", "DECIMAL"),

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

    variable_definition: ($) =>
      seq(
        choice("DEFINE", "DEF"),
        choice("VARIABLE", "VAR"),
        field("identifier", $.identifier),
        "AS",
        field("type", $.primitive_type),
        $.terminator
      ),

    variable_assignment: ($) => seq($.assignment, $.terminator),

    /// Function
    function_call: ($) =>
      seq(
        field("function", $.identifier),
        seq("(", optional(_list($.expression, ",")), ")")
      ),

    /// ASSIGN statement
    assign_statement: ($) => seq("ASSIGN", repeat($.assignment), $.terminator),

    /// FOR-like
    where_clause: ($) =>
      seq("WHERE", field("conditions", _list($.expression, "AND"))),

    query_tunings: ($) => _list(choice(...query_tunings), " "),

    for_statement: ($) =>
      seq(
        "FOR",
        field("type", choice("EACH", "FIRST", "LAST")),
        field("table", $.identifier),
        optional($.where_clause),
        field("query_tunings", optional($.query_tunings)),
        ":",
        repeat($.statement),
        "END."
      ),
  },
});
