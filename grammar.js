/// <reference types="tree-sitter-cli/dsl" />

// DO NOT CHANGE THESE TO USE PRECEDENCE
// Keyword that requires whitespace after
const kw = (w) =>
  seq(alias(token(new RegExp(w, "i")), w), token.immediate(/\s+/));
// Token keyword that does not require whitespace
const tkw = (w, a = w) => alias(token(new RegExp(w, "i")), a);

// prettier-ignore
const comparison_operators = [ "<>", ">", "<", ">=", "<=", kw("BEGINS"), kw("MATCHES"), kw("EQ"), kw("NE"), kw("GT"), kw("LT"), kw("GE"), kw("LE")];

const PREC = { LOGICAL: 1, NOT: 2, COMPARE: 3, ADD: 4, MULT: 5, UNARY: 6 };

module.exports = grammar({
  name: "abl",

  externals: ($) => [
    $._namedot,
    $._namecolon,
    $._namedoublecolon,
    $._colon,
    $._terminator_dot,
    $._escaped_string,
    $.block_comment,
  ],
  extras: ($) => [
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/,
    $.comment,
    $.include,
    $.constant,
  ],
  word: ($) => $.identifier,
  conflicts: ($) => [
    // Core disambiguations
    [$._statement, $.if_statement],
    [$._expression, $._statement_expression],
    [$._primary_expression, $._assignable],
    [$._primary_expression, $.function_call],
    [$._primary_expression, $.__display_item, $.function_call],

    // DEFINE * disambiguation
    [
      $.__buffer_access_modifier,
      $.__data_source_access_modifier,
      $.__dataset_access_modifier,
      $.__event_access_modifier,
      $.__query_access_modifier,
      $.__temp_table_access_modifier,
      $.__variable_access_modifier,
    ],
    [
      $.__buffer_access_modifier,
      $.__dataset_access_modifier,
      $.__event_access_modifier,
      $.__query_access_modifier,
      $.__temp_table_access_modifier,
      $.__variable_access_modifier,
    ],
    [
      $.__dataset_access_modifier,
      $.__temp_table_access_modifier,
      $.__variable_access_modifier,
    ],
    [$.__data_source_access_modifier, $.__event_access_modifier],
    [$.__data_source_static_modifier, $.__event_static_modifier],
    [$.__event_access_modifier, $.__variable_access_modifier],
    [$.__event_static_modifier, $.__variable_static_modifier],
    [
      $.__dataset_static_modifier,
      $.__temp_table_static_modifier,
      $.__variable_static_modifier,
    ],
    [$.__property_modifier, $.__event_abstract_modifier],
    [$.__property_modifier, $.__event_override_modifier],

    // Specific disambiguations
    [$._primary_expression, $.__in_frame_target],
    [$.__prompt_for_record_body, $.__prompt_for_field_target],
    [$.__frame_option_down],
    [$.__update_record_body, $.__update_field_target],
    [$.__set_record_body, $.__set_field_target],
  ],
  inline: ($) => [],

  rules: (() => {
    const ctx = { PREC, kw, tkw };
    return {
      source_code: ($) => repeat($._statement),

      // Comments
      line_comment: ($) => token(seq("//", /[^\r\n]*/)),
      comment: ($) => choice($.line_comment, $.block_comment),

      // Includes
      include: ($) =>
        token(
          choice(
            /\{\{&[^}\r\n]+\}[^\s}\r\n]*\.i[ \t]*\}\.?[ \t]*\r?\n/i,
            /\{[^\s}\r\n]*\.i[ \t]*\}\.?[ \t]*\r?\n/i,
          ),
        ),
      include_expression: ($) =>
        seq(
          "{",
          field("file", $._include_file_reference),
          repeat(field("argument", $.include_argument)),
          "}",
          optional("."),
        ),
      include_argument: ($) =>
        choice($.include_named_argument, $._include_argument_value),
      include_named_argument: ($) =>
        seq(
          "&",
          field("name", $.identifier),
          optional(seq("=", field("value", $._include_argument_value))),
        ),
      _include_argument_value: ($) =>
        choice(
          $.qualified_name,
          $.identifier,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
          $.boolean_literal,
          alias($.constant_expression, $.constant),
          $.argument_reference,
          $.parenthesized_identifier,
        ),

      // Preprocessor
      preprocessor_directive: ($) => token(/&[^\n]*(?:~\s*\n[^\n]*)*/i),
      _include_file_reference: ($) =>
        seq(optional(alias($.constant_expression, $.constant)), $.file_name),

      // Constants
      constant: ($) => token(/\{&[^\}\r\n]+\}[ \t]*\r?\n/),
      constant_expression: ($) =>
        seq(
          "{&",
          $.identifier,
          optional(seq("=", field("value", $.__constant_value))),
          "}",
        ),
      __constant_value: ($) =>
        choice(
          $.qualified_name,
          $.identifier,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
          $.boolean_literal,
          alias($.constant_expression, $.constant),
          $.argument_reference,
          $.parenthesized_identifier,
        ),
      argument_reference: ($) => token(/\{[0-9A-Za-z_-]+\}/),

      // Re-exports
      ...require("./grammar/statements")(ctx),
      ...require("./grammar/expressions")(ctx),
      ...require("./grammar/phrases")(ctx),

      // Literals
      number_literal: ($) => token(prec(-1, /([0-9]+(\.[0-9]+)?|\.[0-9]+)/)),
      _signed_number_literal: ($) =>
        token(prec(1, /[+-]([0-9]+(\.[0-9]+)?|\.[0-9]+)/)),
      date_literal: ($) =>
        token(prec(1, /[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}/)),
      string_literal: ($) =>
        seq(
          $._escaped_string,
          optional(
            token.immediate(
              /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
            ),
          ),
        ),
      null_literal: ($) => "?",
      boolean_literal: ($) => token(/TRUE|FALSE|YES|NO/i),
      file_name: ($) => /[A-Za-z0-9_\\/.-]+\.i/i,
      procedure_name: ($) => /[A-Za-z0-9_\\/.-]+\.p/i,

      // Types
      generic_type: ($) =>
        seq($._simple_type_name, "<", $._simple_type_name, ">"),
      _simple_type_name: ($) =>
        choice($.scoped_name, $.qualified_name, $.identifier),
      _type_name: ($) => choice($.generic_type, $._simple_type_name),
      _type_or_string: ($) => choice($._type_name, $.string_literal),

      // Operators
      assignment_operator: ($) => choice("=", "+=", "-=", "*=", "/="),
      _logical_operator: ($) => choice(kw("AND"), kw("OR")),
      _comparison_operator: ($) => choice("=", ...comparison_operators),

      // Assignabless
      _assignable: ($) =>
        choice(
          $.identifier,
          $.qualified_name,
          $.object_access,
          $.array_access,
          $.function_call,
          $.in_frame_expression,
        ),

      // Expressions
      parenthesized_expression: ($) => seq("(", $._expression, ")"),
      _expressions: ($) => seq($._expression, repeat(seq(",", $._expression))),
      unary_expression: ($) =>
        choice(
          prec(PREC.UNARY, seq(choice("+", "-"), $._expression)),
          prec(PREC.NOT, seq(tkw("NOT"), $._expression)),
        ),
      // Turns out this stupid split to __ reduces state counts dramatically
      binary_expression: ($) => $.__binary_expression,
      __binary_expression: ($) =>
        binary_expression($, $._expression, $._comparison_operator),

      // _statement_expression excludes `=` from comparison operators to disambiguate
      // assignment vs equality at the statement level. Without this, `x = 5.` could
      // parse as either assignment_statement or expression_statement (equality check).
      // By excluding `=` here, expression_statement cannot match `x = 5.`, forcing it
      // to parse as assignment_statement.
      _statement_expression: ($) =>
        choice(
          alias($.binary_expression_no_eq, $.binary_expression),
          $.conditional_expression,
          $.unary_expression,
          $._primary_expression,
        ),
      // excludes `=` to disambiguate assignment vs equality comparison at statement level.
      _comparison_operator_no_eq: ($) => choice(...comparison_operators),
      // binary_expression without `=` comparison.
      binary_expression_no_eq: ($) =>
        binary_expression(
          $,
          $._statement_expression,
          $._comparison_operator_no_eq,
        ),

      // Accessors
      object_access: ($) =>
        prec(
          1,
          seq(
            field("left", choice($.identifier, $.qualified_name)),
            repeat1(
              seq(
                choice($._namecolon, token.immediate("?:")),
                field("right", alias($._identifier_immediate, $.identifier)),
              ),
            ),
          ),
        ),
      scoped_name: ($) => accessor($, $._namedoublecolon),
      qualified_name: ($) => accessor($, $._namedot),

      object_access_expression: ($) =>
        prec(
          1,
          seq(
            field(
              "left",
              choice(
                $.function_call,
                $.parenthesized_expression,
                $.new_expression,
              ),
            ),
            repeat1(seq($._namecolon, field("right", $.identifier))),
          ),
        ),

      // Array
      array_initializer: ($) => seq("[", optional($._expressions), "]"),
      _array_target: ($) =>
        choice($.identifier, $.qualified_name, $.object_access, $.scoped_name),

      array_access: ($) =>
        seq(
          field("array", $._array_target),
          "[",
          optional($._array_subscript),
          "]",
        ),
      _array_subscript: ($) =>
        choice(
          $._expressions,
          seq(
            field("start", $._expression),
            kw("FOR"),
            field("count", $._expression),
          ),
        ),

      // Callables
      arguments: ($) =>
        seq("(", optional(seq($.argument, repeat(seq(",", $.argument)))), ")"),
      argument: ($) =>
        choice(
          // Stream keywords as values (e.g., SEEK(OUTPUT))
          field("value", choice(tkw("INPUT"), tkw("OUTPUT"))),
          // Regular arguments with optional direction
          seq(
            optional(choice(tkw("INPUT"), tkw("OUTPUT"), tkw("INPUT-OUTPUT"))),
            optional(tkw("TABLE")),
            field("value", $._expression),
            optional(tkw("BY-REFERENCE")),
          ),
        ),

      function_call: ($) =>
        seq(
          field(
            "function",
            choice(
              $.identifier,
              $.qualified_name,
              $.object_access,
              $.scoped_name,
            ),
          ),
          $.arguments,
        ),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_\-&]*/u),
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_-]*/u),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
      _terminator: ($) => choice($._terminator_dot, ";"),

      // Contains $._expression and $._primary_expression aggregates
      ...require("./grammar/core/expressions")(ctx),
      // Contains only $._statement aggregate and statement costs
      ...require("./grammar/core/statements")(ctx),
    };
  })(),
});

// Helpers

function accessor($, ...separators) {
  return prec(
    1,
    seq(
      field("left", $.identifier),
      repeat1(
        seq(
          separators.length > 1 ? choice(...separators) : separators[0],
          field("right", alias($._identifier_immediate, $.identifier)),
        ),
      ),
    ),
  );
}

function binary_expression($, expression, comparison_operator) {
  return choice(
    prec.left(
      PREC.MULT,
      seq(expression, choice("*", "/", kw("MOD"), kw("MODULO")), expression),
    ),
    prec.left(PREC.ADD, seq(expression, choice("+", "-"), expression)),
    prec.left(PREC.COMPARE, seq(expression, comparison_operator, expression)),
    prec.left(PREC.LOGICAL, seq(expression, $._logical_operator, expression)),
  );
}
