/// <reference types="tree-sitter-cli/dsl" />

const { kw } = require("./grammar/helpers/keywords");
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
  "SUPER",
  "TARGET-PROCEDURE",
  "THIS-OBJECT",
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
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n|~[ \t]*/,
    $.comment,
    $.constant,
    $.argument_reference,
  ],
  word: ($) => $.identifier,
  conflicts: ($) => [
    // There are many statements where x ( ) has different meanings (aggregate/accum)
    [$._primary_expression, $.function_call],
    // INPUT starts either an argument direction or the screen-buffer INPUT function.
    [$.__input_expression_prefix, $.argument],
    // WITH NO-VALIDATE is valid both as prompt_for_with_phrase and as frame_phrase option
    [$.__prompt_for_with_phrase, $.frame_phrase],
    // NOT ENTERED field: NOT can be unary, or part of the ENTERED expression.
    [$.entered_expression],
    // Shared [NOT] ENTERED phrase must preserve both keyword-as-identifier spans.
    [$.__entered_operator],
    // ENABLE/DISABLE field[N] can be confused with function_call
    [$.__enable_item, $.function_call],
    [$.__disable_item, $.function_call],
    // DISPLAY field (TOTAL): field expr vs binary_expression that continues after field
    [$.__display_aggregate_primary_expression, $.binary_expression],
    // BUTTON in alert-box phrase vs DEFINE BUTTON keyword
    [$.__view_as_alert_box],
    // DISPLAY x IN WINDOW w ; DISPLAY x IN FRAME y - both can work
    [$.__display_record, $.widget_qualified_name, $._primary_expression],
    // Field / Column / Handle can be just an identifier
    [$.__widget_entry],

    // DEFINE modifiers prefix conflicts
    // Conflicts approach has slightly better state reduction (~500) than doing it conflicts free
    [
      $.__buffer_modifier,
      $.__class_property_access_modifier,
      $.__data_source_access_modifier,
      $.__dataset_modifier,
      $.__event_access_modifier,
      $.__query_modifier,
      $.__temp_table_modifier,
      $.__variable_modifier,
    ],
    [$.__class_property_access_modifier, $.__event_access_modifier],
    [$.__class_property_access_modifier, $.__event_access_modifier, $.__variable_modifier],
    [
      $.__buffer_modifier,
      $.__class_property_class_modifier,
      $.__data_source_static,
      $.__event_type_modifier,
      $.__query_modifier,
      $.__variable_modifier,
    ],
    [$.__class_property_class_modifier, $.__event_type_modifier],
    [$.__class_property_class_modifier, $.__event_type_modifier, $.__variable_modifier],
    // SUBSCRIBE/UNSUBSCRIBE can start with PROCEDURE/PROC which may also be parsed as identifier-like expression.
    [$.__unsubscribe_prefix, $._identifier_or_qualified_name],
    // Shared identifier/access/call wrapper can compete with direct function call parse at `identifier(` sites.
    [$._identifier_or_access, $.function_call],
    // ON TAB TAB. vs ON TAB OF widget: both start with a UI event name token.
    // Requires runtime dispatch since disambiguation needs 2-token lookahead.
    [$.__on_key_label, $.__on_ui_event],
  ],
  inline: ($) => [
    $.__find_record_name,
    $.__find_index_name,
    $.__assign_record_name,
    $.__temp_table_like_name,
    $._identifier_or_array_access,
    $._parameter_direction,
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
      include_file_reference: ($) => $.__include_file_reference,
      __include_file_reference: ($) =>
        seq(
          "{",
          field("file", $.__include_file_target),
          optional(field("arguments", $.__include_arguments)),
          "}",
          optional("."),
        ),
      include_expression: ($) => prec(1, $.__include_file_reference),
      include_statement: ($) => $.__include_file_reference,
      __include_arguments: ($) =>
        choice(
          repeat1(field("argument", alias($._include_argument_value, $.include_argument))),
          repeat1(field("argument", alias($.include_named_argument, $.include_argument))),
        ),
      include_named_argument: ($) =>
        seq("&", field("name", $.identifier), seq("=", field("value", $._include_argument_value))),
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
            $.preprocessor_name,
            $.argument_reference,
          ),
        ),

      // Preprocessor
      global_define_preprocessor_directive: ($) =>
        seq(
          token(prec(1, /&GLOBAL-DEFINE/i)),
          field("name", $.identifier),
          field("value", $.preprocessor_value),
        ),
      scoped_define_preprocessor_directive: ($) =>
        seq(
          token(prec(1, /&SCOPED-DEFINE/i)),
          field("name", $.identifier),
          field("value", $.preprocessor_value),
        ),
      if_preprocessor_directive: ($) =>
        seq(
          token(/&IF/i),
          $.__if_preprocessor_condition_then,
          field("then_branch", repeat1(field("value", $.__if_preprocessor_branch_value))),
          optional($.__if_preprocessor_branches),
          token(/&ENDIF/i),
        ),
      if_preprocessor_directive_statement: ($) =>
        choice(
          alias($.__if_preprocessor_if_statement, $.if_branch),
          alias($.__if_preprocessor_then_statement, $.then_branch),
          alias($.__if_preprocessor_elseif_statement, $.elseif_branch),
          alias($.__if_preprocessor_else_statement, $.else_branch),
          alias($.__if_preprocessor_endif_statement, $.endif_branch),
        ),
      __if_preprocessor_if_statement: ($) =>
        prec.right(seq(token(prec(1, /&IF/i)), field("condition", $._expression))),
      __if_preprocessor_then_statement: ($) => token(prec(1, /&THEN/i)),
      __if_preprocessor_elseif_statement: ($) =>
        prec.right(seq(token(prec(1, /&ELSEIF/i)), field("condition", $._expression))),
      __if_preprocessor_else_statement: ($) => token(prec(1, /&ELSE/i)),
      __if_preprocessor_endif_statement: ($) => token(prec(1, /&ENDIF/i)),
      __if_preprocessor_elseif_branch: ($) =>
        seq(
          token(/&ELSEIF/i),
          $.__if_preprocessor_condition_then,
          field("then_branch", repeat1(field("value", $.__if_preprocessor_branch_value))),
        ),
      __if_preprocessor_branches: ($) =>
        choice(
          seq(
            field("elseif_branch", $.__if_preprocessor_elseif_branch),
            optional($.__if_preprocessor_branches),
          ),
          field("else_branch", $.__if_preprocessor_else_branch),
        ),
      __if_preprocessor_condition_then: ($) =>
        seq(field("condition", $._expression), token(/&THEN/i)),
      __if_preprocessor_else_branch: ($) =>
        seq(token(/&ELSE/i), repeat1(field("value", $.__if_preprocessor_branch_value))),
      __if_preprocessor_branch_value: ($) =>
        choice($.string_literal, $.preprocessor_name, $.argument_reference, $.number_literal),
      message_preprocessor_directive: ($) =>
        seq(token(prec(1, /&MESSAGE/i)), field("value", $.preprocessor_value)),
      undefine_preprocessor_directive: ($) =>
        seq(token(prec(1, /&UNDEFINE/i)), field("name", $.identifier)),
      preprocessor_value: ($) => token(/[^\n]+(?:~\s*\n[^\n]+)*/),
      __include_file_target: ($) => choice($.include_file_path, $.argument_reference),
      include_file_path: ($) =>
        seq(optional($.preprocessor_name), alias($.__include_file_name, $.identifier)),
      __include_file_name: ($) => /[A-Za-z0-9_\\/.-]+\.[A-Za-z][A-Za-z0-9]*/,

      // Constants
      constant: ($) => token(prec(-1, /\{&[^}\r\n]+\}[ \t]*\r?\n/)),
      preprocessor_name: ($) =>
        prec(
          1,
          seq(
            $.__preprocessor_name_prefix,
            optional(seq("=", field("value", $.__preprocessor_name_value))),
            "}",
          ),
        ),
      __preprocessor_name_prefix: ($) => seq("{", "&", $.identifier),
      __preprocessor_name_value: ($) =>
        choice(
          $._identifier_or_qualified_name,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
          $.boolean_literal,
          $.preprocessor_name,
          $.argument_reference,
          $.parenthesized_identifier,
        ),
      argument_reference: ($) => token(/\{(?:[0-9]+|\*)\}/),

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
          optional(token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i)),
        ),
      null_literal: ($) => token("?"),
      boolean_literal: ($) => choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),
      procedure_name: ($) => /[A-Za-z0-9_\\/.-]+\.pl?/i,
      // Unquoted opsys-file paths, used only by INPUT FROM / OUTPUT TO targets.
      opsys_file: ($) => token(/(?:\.{1,2})?\/[A-Za-z0-9_.\-/~]*[A-Za-z0-9_\-/]/),

      // Types
      generic_type: ($) => seq($._simple_type_name, "<", $._simple_type_name, ">"),
      _simple_type_name: ($) =>
        choice($.scoped_name, $.qualified_name, $.nested_type_name, $.identifier),
      _type_name: ($) => choice($.generic_type, $._simple_type_name),
      _type_or_string: ($) => choice($._type_name, $.string_literal),
      _identifier_or_qualified_name: ($) =>
        choice(
          $.macro_concatenated_name,
          $.identifier,
          $.qualified_name,
          alias(kw("PROCEDURE", { offset: 4 }), $.identifier),
          alias(kw("INTERFACE"), $.identifier),
        ),
      _identifier_or_array_access: ($) => choice($._identifier_or_qualified_name, $.array_access),
      _identifier_or_access: ($) =>
        choice($._identifier_or_qualified_name, $.array_access, $.object_access),
      _identifier_or_access_or_call: ($) => choice($._identifier_or_access, $.function_call),
      macro_concatenated_name: ($) =>
        token(
          /[_\p{L}][\p{L}\p{N}_\-&]*(\{(?:&[0-9A-Za-z_-]+|[0-9A-Za-z_-]+)\}[\p{L}\p{N}_\-&]*)+/i,
        ),

      _widgets: ($) => prec.right(alias(choice(...WIDGETS, kw("FRAME")), $.identifier)),
      _events: ($) =>
        choice(
          $.identifier,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
        ),
      _program_target: ($) =>
        choice(
          field("program", $.identifier),
          field("program", $.string_literal),
          $._value_expression,
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
            optional($.__assignment_statement_tail),
            $._terminator,
          ),
        ),
      __assignment_statement_tail: ($) =>
        choice(
          seq($.widget_phrase, optional(alias(kw("NO-ERROR"), $.no_error))),
          alias(kw("NO-ERROR"), $.no_error),
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
          prec("not", seq($._not_keyword, $._expression)),
        ),
      _not_keyword: ($) => kw("NOT"),
      binary_expression: ($) => binary_expression($, $._expression, $._comparison_operator),

      // _statement_expression excludes `=` from comparison operators to disambiguate
      // assignment vs equality at the statement level. Without this, `x = 5.` could
      // parse as either assignment_statement or expression_statement (equality check).
      // By excluding `=` here, expression_statement cannot match `x = 5.`, forcing it
      // to parse as assignment_statement.
      _statement_expression: ($) =>
        choice(
          alias($.binary_expression_no_eq, $.binary_expression),
          $.unary_expression,
          $._statement_primary_expression,
        ),
      // excludes `=` to disambiguate assignment vs equality comparison at statement level.
      _comparison_operator_no_eq: ($) => choice(...COMPARISON_OPERATORS),
      __multiplicative_operator: ($) => choice("*", "/", kw("MOD"), kw("MODULO")),
      __additive_operator: ($) => choice("+", "-"),
      // binary_expression without `=` comparison.
      binary_expression_no_eq: ($) =>
        binary_expression($, $._statement_expression, $._comparison_operator_no_eq),

      // Accessors
      _object_access_plain: ($) =>
        seq(field("left", $._object_access_plain_left), $._object_access_tail),
      _object_access_plain_left: ($) =>
        choice($._identifier_or_qualified_name, $.system_handle_identifier),
      _object_access_widget: ($) =>
        seq(
          field("widget", alias($._widgets, $.identifier)),
          field("left", $._identifier_or_qualified_name),
          $._object_access_tail,
        ),
      _object_access_handle: ($) =>
        prec.right(
          1,
          seq(
            field("handle", $.__object_access_handle_type),
            field("name", $._identifier_or_qualified_name),
            $._object_access_tail,
          ),
        ),
      __object_access_handle_type: ($) =>
        prec(-1, choice(alias(kw("TEMP-TABLE"), $.identifier), alias(kw("BUFFER"), $.identifier))),
      object_access: ($) =>
        choice(
          $._object_access_widget,
          $._object_access_handle,
          $._object_access_plain,
          seq(field("left", $._object_access_expression_left), $._object_access_tail),
        ),
      _object_access_expression_left: ($) =>
        choice($.function_call, $.parenthesized_expression, $.new_expression),

      scoped_name: ($) =>
        seq(
          field("left", $.identifier),
          repeat1(
            seq($._namedoublecolon, field("right", alias($._identifier_immediate, $.identifier))),
          ),
        ),

      qualified_name: ($) =>
        seq(
          field("left", $._qualified_name_left),
          repeat1(seq($._namedot, field("right", alias($._identifier_immediate, $.identifier)))),
        ),
      _qualified_name_left: ($) =>
        choice($.macro_concatenated_name, $.identifier, $.preprocessor_name),

      nested_type_name: ($) =>
        seq(
          field("left", $.identifier),
          repeat1(seq($._nameplus, field("right", alias($._identifier_immediate, $.identifier)))),
        ),

      // Array
      array_initializer: ($) => seq("[", optional($._expressions), "]"),

      array_access: ($) =>
        seq(
          field("array", choice($._identifier_or_qualified_name, $.object_access, $.scoped_name)),
          "[",
          field("index", optional($._array_subscript)),
          "]",
        ),
      _array_subscript: ($) =>
        choice(
          $._expressions,
          seq(field("start", $._expression), kw("FOR"), field("count", $._expression)),
        ),

      // Callables
      arguments: ($) => seq("(", optional($._argument_list), ")"),
      _argument_list: ($) => seq($.argument, repeat(seq(",", $.argument))),
      argument: ($) =>
        seq(
          optional(prec.dynamic(1, field("direction", $._parameter_direction))),
          $.__argument_body,
        ),
      __argument_body: ($) =>
        seq(
          choice(
            seq(
              choice(kw("TABLE"), kw("BUFFER"), kw("TABLE-HANDLE"), kw("DATASET-HANDLE")),
              field("name", choice($._identifier_or_qualified_name, $.object_access)),
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
              $.system_handle_identifier,
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
        choice($._identifier_or_qualified_name, $.object_access, $.function_call, $.scoped_name),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_\-&#%]*/i),
      system_handle_identifier: ($) =>
        alias(
          token(prec(1, new RegExp(`(${SYSTEM_HANDLE_WORDS.map(escape_regex).join("|")})`, "i"))),
          $.identifier,
        ),
      _label: ($) => prec.right(1, seq(field("label", $.identifier), alias($._colon, ":"))),
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_\-%]*/i),
      _alias_name: ($) => choice($.identifier, $.string_literal, $._value_expression),
      _os_filename: ($) => choice($.string_literal, $._identifier_or_access_or_call),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
      _object_access_tail: ($) =>
        repeat1(
          seq(
            $._object_access_separator,
            field("right", alias($._identifier_immediate, $.identifier)),
          ),
        ),
      _object_access_separator: ($) => choice($._namecolon, token.immediate("?:")),
      _identifier_or_string_literal: ($) => choice($.identifier, $.string_literal),
      _value_expression: ($) =>
        seq($.__value_expression_prefix, "(", field("value", $._expression), ")"),
      __value_expression_prefix: ($) => kw("VALUE"),
      _terminator: ($) => choice($._terminator_dot, ";"),
      _no_error_terminator: ($) => seq(optional($.__no_error), $._terminator),
      __no_error: ($) => alias(kw("NO-ERROR"), $.no_error),

      // Contains non-core statement-specific shared rules
      ...require("./grammar/core/common")(ctx),
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
    prec.left("multiplication", seq(expression, $.__multiplicative_operator, expression)),
    prec.left("add", seq(expression, $.__additive_operator, expression)),
    prec.left("compare", seq(expression, comparison_operator, expression)),
    prec.left("logical", seq(expression, $._logical_operator, expression)),
  );
}
