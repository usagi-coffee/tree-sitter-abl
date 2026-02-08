/// <reference types="tree-sitter-cli/dsl" />

const path = require("path");
const { kw, collect_keyword_words } = require("./grammar/helpers/keywords");
const precedences = require("./grammar/precedences");

const COMPARISON_OPERATORS = [
  "<>",
  ">",
  "<",
  ">=",
  "<=",
  kw("BEGINS"),
  kw("MATCHES"),
  kw("EQ"),
  kw("NE"),
  kw("GT"),
  kw("LT"),
  kw("GE"),
  kw("LE"),
];

const LABEL_KEYWORD_WORDS = collect_keyword_words(
  path.join(__dirname, "grammar"),
  // Label exceptions
  [
    "DO",
    "FOR",
    "REPEAT",
    "FINALLY",
    "CASE",
    "ACTIVE-WINDOW",
    "CLIPBOARD",
    "COLOR-TABLE",
    "COMPILER",
    "CURRENT-WINDOW",
    "DEBUGGER",
    "DEFAULT-WINDOW",
    "ERROR-STATUS",
    "FILE-INFO",
    "FOCUS",
    "FONT-TABLE",
    "LAST-EVENT",
    "RCODE-INFO",
    "SELF",
    "SESSION",
    "SOURCE-PROCEDURE",
    "TARGET-PROCEDURE",
    "THIS-PROCEDURE",
  ],
);

const WIDGETS = [
  kw("WINDOW"),
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
];

const SYSTEM_HANDLE_WORDS = [
  "ACTIVE-WINDOW",
  "CLIPBOARD",
  "COLOR-TABLE",
  "COMPILER",
  "CURRENT-WINDOW",
  "DEBUGGER",
  "DEFAULT-WINDOW",
  "ERROR-STATUS",
  "FILE-INFO",
  "FOCUS",
  "FONT-TABLE",
  "LAST-EVENT",
  "RCODE-INFO",
  "SELF",
  "SESSION",
  "SOURCE-PROCEDURE",
  "TARGET-PROCEDURE",
  "THIS-PROCEDURE",
];

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
    $.argument_reference,
  ],
  word: ($) => $.identifier,
  conflicts: ($) => [
    // There are many statements where x ( ) has different meanings (aggregate/accum)
    [$._primary_expression, $.function_call],
    // DISPLAY x IN WINDOW w ; DISPLAY x IN FRAME y - both can work
    [$.__display_record, $.widget_qualified_name, $._primary_expression],
    // Field / Column / Handle can be just an identifier
    [$.__widget_entry],

    // DEFINE modifiers prefix conflicts
    // Conflicts approach has slightly better state reduction (~500) than doing it conflicts free
    [
      $.__buffer_modifier,
      $.__property_access_modifier,
      $.__data_source_access_modifier,
      $.__dataset_modifier,
      $.__event_access_modifier,
      $.__query_modifier,
      $.__temp_table_modifier,
      $.__variable_modifier,
    ],
    [$.__property_access_modifier, $.__event_access_modifier],
    [
      $.__property_access_modifier,
      $.__dataset_modifier,
      $.__temp_table_modifier,
      $.__variable_modifier,
    ],
    [$.__property_access_modifier, $.__variable_modifier],
    [
      $.__property_access_modifier,
      $.__event_access_modifier,
      $.__variable_modifier,
    ],
    [
      $.__buffer_modifier,
      $.__property_class_modifier,
      $.__data_source_static,
      $.__event_type_modifier,
      $.__query_modifier,
      $.__variable_modifier,
    ],
    [$.__property_class_modifier, $.__variable_modifier],
    [$.__property_class_modifier, $.__event_type_modifier],
    [
      $.__property_class_modifier,
      $.__event_type_modifier,
      $.__variable_modifier,
    ],
  ],
  inline: ($) => [
    $.__find_record_name,
    $.__find_index_name,
    $.__repeat_record,
    $.__assign_record_name,
    $.__temp_table_field_name,
    $.__temp_table_like_name,
    $.system_handle_identifier,
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
            /\{\{&[^}\r\n]+\}[^\s}\r\n]*\.i[ \t]*\}[ \t]*\r?\n/i,
            /\{[^\s}\r\n]*\.i[ \t]*\}[ \t]*\r?\n/i,
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
      include_statement: ($) => seq(alias($.include_expression, $.include)),
      include_argument: ($) =>
        choice($.include_named_argument, $._include_argument_value),
      include_named_argument: ($) =>
        seq(
          "&",
          field("name", $.identifier),
          optional(seq("=", field("value", $._include_argument_value))),
        ),
      _include_argument_value: ($) =>
        prec(
          1,
          choice(
            $.function_call,
            $.binary_expression,
            $.parenthesized_expression,
            $._identifier_or_qualified_name,
            alias(kw("NEW"), $.identifier),
            alias(kw("WINDOW"), $.identifier),
            $.object_access,
            $.array_access,
            $.string_literal,
            $.number_literal,
            alias($._signed_number_literal, $.number_literal),
            $.boolean_literal,
            alias($.constant_expression, $.constant),
            $.argument_reference,
          ),
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
          $._identifier_or_qualified_name,
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
      boolean_literal: ($) =>
        choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),
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
        choice(
          $.macro_concatenated_name,
          $.identifier,
          $.qualified_name,
          alias(kw("INTERFACE"), $.identifier),
        ),
      macro_concatenated_name: ($) =>
        token(/[_\p{L}][\p{L}\p{N}_\-&]*(\{(?:&[0-9A-Za-z_-]+|[0-9A-Za-z_-]+)\})+/i),

      _widgets: ($) =>
        prec.right(alias(choice(...WIDGETS, kw("FRAME")), $.identifier)),
      _stream_phrase: ($) =>
        seq(
          choice(kw("STREAM"), kw("STREAM-HANDLE")),
          field("stream", $.identifier),
        ),
      _events: ($) =>
        choice(
          $.identifier,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
        ),

      // Operators
      assignment_operator: ($) => choice("=", "+=", "-=", "*=", "/="),
      _logical_operator: ($) => choice(kw("AND"), kw("OR")),
      _comparison_operator: ($) => choice("=", ...COMPARISON_OPERATORS),

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
          $.object_access,
          $._identifier_or_qualified_name,
          $.scoped_name,
          $.widget_qualified_name,
          $.array_access,
          $.function_call,
          $.system_handle_identifier,
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
      _comparison_operator_no_eq: ($) => choice(...COMPARISON_OPERATORS),
      // binary_expression without `=` comparison.
      binary_expression_no_eq: ($) =>
        binary_expression(
          $,
          $._statement_expression,
          $._comparison_operator_no_eq,
        ),

      // Accessors
      _object_access_plain: ($) =>
        seq(
          field(
            "left",
            choice($._identifier_or_qualified_name, $.system_handle_identifier),
          ),
          $._object_access_tail,
        ),
      _object_access_widget: ($) =>
        seq(
          field("widget", alias($._widgets, $.identifier)),
          field("left", $._identifier_or_qualified_name),
          $._object_access_tail,
        ),
      object_access: ($) =>
        choice(
          $._object_access_widget,
          $._object_access_plain,
          seq(
            field(
              "left",
              choice(
                $.function_call,
                $.parenthesized_expression,
                $.new_expression,
              ),
            ),
            $._object_access_tail,
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

      // Array
      array_initializer: ($) => seq("[", optional($._expressions), "]"),
      _array_target: ($) =>
        choice($._identifier_or_qualified_name, $.object_access, $.scoped_name),

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
      arguments: ($) => seq("(", optional($._argument_list), ")"),
      _argument_list: ($) => seq($.argument, repeat(seq(",", $.argument))),
      argument: ($) =>
        seq(
          optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
          choice(
            seq(
              choice(
                kw("TABLE"),
                kw("BUFFER"),
                kw("TABLE-HANDLE"),
                kw("DATASET-HANDLE"),
              ),
              field(
                "name",
                choice($._identifier_or_qualified_name, $.object_access),
              ),
            ),
            field("name", $._expression),
          ),
          optional(seq(kw("AS"), field("type", $._type_name))),
          optional(kw("BY-REFERENCE")),
        ),

      function_call: ($) =>
        seq(
          field(
            "function",
            choice(
              $._identifier_or_qualified_name,
              $.object_access,
              $.scoped_name,
            ),
          ),
          $.arguments,
        ),

      widget_qualified_name: ($) =>
        seq(
          field(
            "target",
            choice(
              $._identifier_or_qualified_name,
              $.scoped_name,
              $.object_access,
              $.function_call,
            ),
          ),
          kw("IN"),
          $._widgets,
          field("widget", $.identifier),
        ),

      _window_handle: ($) =>
        choice(
          $._identifier_or_qualified_name,
          $.object_access,
          $.function_call,
          $.scoped_name,
        ),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_\-&]*/i),
      label_keyword: ($) =>
        token(
          prec(
            1,
            new RegExp(
              `(${LABEL_KEYWORD_WORDS.map(escape_regex).join("|")})\\s*:`,
              "i",
            ),
          ),
        ),
      system_handle_identifier: ($) =>
        alias(
          token(
            prec(
              1,
              new RegExp(
                `(${SYSTEM_HANDLE_WORDS.map(escape_regex).join("|")})`,
                "i",
              ),
            ),
          ),
          $.identifier,
        ),
      _label_identifier: ($) => $.identifier,
      _label: ($) =>
        prec.right(
          1,
          choice(
            seq(field("label", $.identifier), alias($._colon, ":")),
            field("label", alias($.label_keyword, $.identifier)),
          ),
        ),
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_-]*/i),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
      _object_access_tail: ($) =>
        repeat1(
          seq(
            choice($._namecolon, token.immediate("?:")),
            field("right", alias($._identifier_immediate, $.identifier)),
          ),
        ),
      handle_reference: ($) =>
        seq(
          kw("TEMP-TABLE"),
          field("name", $._identifier_or_qualified_name),
          $._object_access_tail,
        ),

      _terminator: ($) => choice($._terminator_dot, ";"),

      // Contains $._expression and $._primary_expression aggregates
      ...require("./grammar/core/expressions")(ctx),
      // Contains only $._statement aggregate and statement costs
      ...require("./grammar/core/statements")(ctx),
    };
  })(),
});

// Helpers
function escape_regex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
