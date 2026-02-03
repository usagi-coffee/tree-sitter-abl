/// <reference types="tree-sitter-cli/dsl" />

const { kw } = require("./grammar/helpers/keywords");
const precedences = require("./grammar/precedences");

// prettier-ignore
const comparison_operators = [ "<>", ">", "<", ">=", "<=", kw("BEGINS"), kw("MATCHES"), kw("EQ"), kw("NE"), kw("GT"), kw("LT"), kw("GE"), kw("LE")];

module.exports = grammar({
  name: "abl",

  externals: ($) => [
    $._namedot,
    $._namecolon,
    $._namedoublecolon,
    $._nameplus,
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
    // There are many statements where x ( ) has different meanings (aggregate/accum)
    [$._primary_expression, $.function_call],
    // DISPLAY x IN WINDOW w ; DISPLAY x IN FRAME y - both can work
    [$.__display_record, $._in_frame_target, $._primary_expression],
    // DISPLAY items vs frame phrase (WITH ...)
    [$.__display_items, $.frame_phrase],
    // Field / Column / Handle can be just an identifier
    [$.__widget_entry],
    // Just IDENTIFIER + optionals
    [$.__prompt_for_record_body, $.__prompt_for_fields_body],
    [$.__update_field, $.__update_record],
  ],
  inline: ($) => [
    $.__find_record_name,
    $.__find_index_name,
    $.__repeat_record,
    $.__assign_record_name,
    $.__temp_table_field_name,
    $.__temp_table_like_name,
  ],

  precedences: ($) => precedences($),

  rules: (() => {
    const ctx = { kw };
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
      number_literal: ($) => token(/([0-9]+(\.[0-9]+)?|\.[0-9]+)/),
      _signed_number_literal: ($) => token(/[+-]([0-9]+(\.[0-9]+)?|\.[0-9]+)/),
      date_literal: ($) => token(/[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}/),
      string_literal: ($) =>
        seq(
          $._escaped_string,
          optional(
            token.immediate(
              /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
            ),
          ),
        ),
      null_literal: ($) => token("?"),
      boolean_literal: ($) => token(/TRUE|FALSE|YES|NO/i),
      file_name: ($) => /[A-Za-z0-9_\\/.-]+\.i/i,
      procedure_name: ($) => /[A-Za-z0-9_\\/.-]+\.pl?/i,

      // Types
      generic_type: ($) =>
        seq($._simple_type_name, "<", $._simple_type_name, ">"),
      _simple_type_name: ($) =>
        choice(
          $.scoped_name,
          $.qualified_name,
          $.nested_type_name,
          $.identifier,
        ),
      _type_name: ($) => choice($.generic_type, $._simple_type_name),
      _type_or_string: ($) => choice($._type_name, $.string_literal),
      _identifier_or_qualified_name: ($) =>
        choice($.identifier, $.qualified_name),

      _widgets: ($) =>
        prec.right(
          alias(
            choice(
              kw("WINDOW"),
              kw("FRAME"),
              kw("BUTTON"),
              kw("FILL-IN"),
              kw("TOGGLE-BOX"),
              kw("RADIO-SET"),
              kw("EDITOR"),
              kw("SELECTION-LIST"),
              kw("COMBO-BOX"),
              kw("SLIDER"),
              kw("RECTANGLE"),
              kw("TEXT"),
              kw("IMAGE"),
              kw("BROWSE"),
              kw("QUERY"),
              kw("SUB-MENU"),
              kw("MENU-ITEM"),
              kw("MENU"),
            ),
            $.identifier,
          ),
        ),
      _events: ($) => choice($.identifier, $.string_literal, $.number_literal),

      // Operators
      assignment_operator: ($) => choice("=", "+=", "-=", "*=", "/="),
      _logical_operator: ($) => choice(kw("AND"), kw("OR")),
      _comparison_operator: ($) => choice("=", ...comparison_operators),

      // Assignabless
      assignment_statement: ($) =>
        prec.right(
          seq(
            field("left", $._assignable),
            field("operator", $.assignment_operator),
            field("right", choice($.array_initializer, $._expression)),
            optional($.widget_phrase),
            optional(alias(kw("NO-ERROR"), $.no_error)),
            $._terminator,
          ),
        ),

      _assignable: ($) =>
        choice(
          $.identifier,
          $.qualified_name,
          $.object_access,
          $.array_access,
          $.function_call,
        ),

      // Expressions
      parenthesized_expression: ($) => seq("(", $._expression, ")"),
      _expressions: ($) => seq($._expression, repeat(seq(",", $._expression))),
      unary_expression: ($) =>
        choice(
          prec("unary", seq(choice("+", "-"), $._expression)),
          prec("not", seq(kw("NOT"), $._expression)),
        ),
      binary_expression: ($) =>
        binary_expression($, $._expression, $._comparison_operator),

      // _statement_expression excludes `=` from comparison operators to disambiguate
      // assignment vs equality at the statement level. Without this, `x = 5.` could
      // parse as either assignment_statement or expression_statement (equality check).
      // By excluding `=` here, expression_statement cannot match `x = 5.`, forcing it
      // to parse as assignment_statement.
      _statement_expression: ($) =>
        choice(
          alias($.binary_expression_no_eq, $.binary_expression),
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
        prec.right(
          seq(
            optional(field("widget", alias($._widgets, $.identifier))),
            field("left", $._identifier_or_qualified_name),
            repeat1(
              seq(
                choice($._namecolon, token.immediate("?:")),
                field("right", alias($._identifier_immediate, $.identifier)),
              ),
            ),
            optional(seq(kw("IN"), $._widgets, field("in", $.identifier))),
          ),
        ),

      scoped_name: ($) =>
        seq(
          field("left", $.identifier),
          repeat1(
            seq(
              $._namedoublecolon,
              field("right", alias($._identifier_immediate, $.identifier)),
            ),
          ),
        ),

      qualified_name: ($) =>
        seq(
          field("left", $.identifier),
          repeat1(
            seq(
              $._namedot,
              field("right", alias($._identifier_immediate, $.identifier)),
            ),
          ),
        ),

      nested_type_name: ($) =>
        seq(
          field("left", $.identifier),
          repeat1(
            seq(
              $._nameplus,
              field("right", alias($._identifier_immediate, $.identifier)),
            ),
          ),
        ),

      object_access_expression: ($) =>
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
        seq(
          optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
          optional(choice(kw("TABLE"), kw("BUFFER"))),
          field("name", $._expression),
          optional(seq(kw("AS"), field("type", $._type_name))),
          optional(kw("BY-REFERENCE")),
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

      frame_qualified_name: ($) =>
        seq(
          $._in_frame_target,
          kw("IN"),
          kw("FRAME"),
          field("frame", $.identifier),
        ),

      _in_frame_target: ($) =>
        choice(
          $.qualified_name,
          $.identifier,
          $.scoped_name,
          $.object_access,
          $.function_call,
        ),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_\-&]*/i),
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_-]*/i),
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

function binary_expression($, expression, comparison_operator) {
  return choice(
    prec.left(
      "multiplication",
      seq(expression, choice("*", "/", kw("MOD"), kw("MODULO")), expression),
    ),
    prec.left("add", seq(expression, choice("+", "-"), expression)),
    prec.left("compare", seq(expression, comparison_operator, expression)),
    prec.left("logical", seq(expression, $._logical_operator, expression)),
  );
}
