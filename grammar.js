/// <reference types="tree-sitter-cli/dsl" />

import commonRules from "./grammar/core/common.js";
import coreExpressions from "./grammar/core/expressions.js";
import coreStatements from "./grammar/core/statements.js";
import expressions from "./grammar/expressions/index.js";
import { kw } from "./grammar/helpers/keywords.js";
import phrases from "./grammar/phrases/index.js";
import precedences from "./grammar/precedences/index.js";
import statements from "./grammar/statements/index.js";

const COMPARISON_OPERATORS = [
  "<>",
  ">",
  "<",
  ">=",
  "<=",
  kw("BEGINS"),
  kw("MATCHES"),
  kw("CONTAINS"),
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

const MACRO = `\\{(?:&[0-9A-Za-z_-]+|[0-9A-Za-z_-]+)\\}`;
const NAME_CHARS = `[\\p{L}\\p{N}_\\-&#%$]`;
const MACRO_CONCATENATED_NAME = new RegExp(
  `[_\\p{L}]${NAME_CHARS}*(?:${MACRO}${NAME_CHARS}*)+` +
    `|(?:${MACRO})+${NAME_CHARS}+(?:${MACRO}${NAME_CHARS}*)*`,
  "i",
);

export default grammar({
  name: "abl",

  externals: ($) => [
    $._namedot,
    $._namecolon,
    $._namedoublecolon,
    $._nameplus,
    $._colon,
    $._terminator_dot,
    $.string_literal,
    $.block_comment,
  ],
  extras: ($) => [/[\s\f\uFEFF\u2060\u200B]|\\\r?\n|~[ \t]*/, $.comment, $.argument_reference],
  word: ($) => $.identifier,
  conflicts: ($) => [
    // There are many statements where x ( ) has different meanings (aggregate/accum)
    [$._primary_expression, $.function_call],
    // INPUT starts either an argument direction or the screen-buffer INPUT function.
    [$.__input_expression_prefix, $.argument],
    // `INPUT STREAM s` opens an INPUT statement, while `INPUT STREAM s:HANDLE`
    // can also begin an INPUT expression whose operand is a stream handle.
    [$.__input_expression_prefix, $._input_stream_prefix],
    // After EXPORT, STREAM can introduce the statement's output stream or the
    // first exported expression in `STREAM s:attribute` form.
    [$.__export_statement_head],
    // After SET, STREAM can introduce the statement's input stream or begin a
    // stream-handle field expression.
    [$.__set_prefix],
    // UNDERLINE has the same optional statement stream before its field list.
    [$.__underline_prefix],
    // WITH NO-VALIDATE is valid both as prompt_for_with_phrase and as frame_phrase option
    [$.__prompt_for_with_phrase, $.__frame_option],
    // Shared [NOT] ENTERED phrase must preserve both keyword-as-identifier spans.
    [$.__entered_operator],
    // ENABLE/DISABLE field[N] can be confused with function_call
    [$.__enable_item, $.function_call],
    [$.__disable_item, $.function_call],
    // Field / Column / Handle can be just an identifier
    [$.__widget_entry],
    // VIEW/HIDE only: a bare name before IN WINDOW cannot be told apart from
    // one before IN FRAME/IN BROWSE with a single token of lookahead; only
    // what follows IN settles it. Scoped to its own symbol so the fork does
    // not reach the shared __widget_entry/__widget_handle used elsewhere.
    [$.__view_hide_widget_ref],
    // `ON … PERSISTENT RUN chx IN THIS-PROCEDURE (hb).` -- on the `(` the
    // parser must choose between the trigger's argument list and a call on the
    // context that precedes it. Both are alive at that token.
    [$.__on_context_value, $.function_call],
    // `DYNAMIC-FUNCTION("f" IN h:PARENT)` -- on the IN after an argument the
    // parser must choose between the argument's own IN clause and a widget
    // qualifier, which expects IN WINDOW. Both are alive at that token and only
    // what follows settles it, so it is decided at parse time.
    [$.__argument_body, $.__widget_qualified_name_separator],
    // `DYNAMIC-FUNCTION(pNom IN h)` has the same ambiguity after a bare name,
    // before the argument expression has reduced to __argument_body.
    [$.__argument_in_handle, $.__widget_qualified_name_separator],
    // `a::c` off a bare name is a scoped_name; the object-access tail reads the
    // same `::` for the receivers scoped_name cannot take, so on that token
    // both are alive and only the receiver settles it -- which the parser has
    // already reduced away. A precedence was tried first and does not resolve
    // it: this is a shift/reduce on the token, not an ordering of rules.
    [$._identifier_or_qualified_name, $.scoped_name],
    // `METHOD {&PACKAGE-PROTECTED} OVERRIDE VOID Foo():` -- on the `{` the
    // parser must decide whether the modifier list continues with a macro or
    // has ended and something else opens on a brace. Both readings are still
    // alive at that token, and the choice is only settled by what follows the
    // macro, so it is made at parse time rather than by an associativity that
    // would fix one reading and lose the other.
    [$.__class_method_definition_prefix],
    // Function definitions require parameter names, while prototypes may omit
    // them. The forms diverge only after the closing parenthesis.
    [$.__function_parameter, $.__function_definition_parameter],
    // In `METHOD CHARACTER EXTENT M()`, M is the method name; in
    // `METHOD CHARACTER EXTENT kMax M()`, the first name is the extent size.
    [$.__class_method_return_extent_phrase],

    // DEFINE modifiers prefix conflicts
    // Conflicts approach has slightly better state reduction (~500) than doing it conflicts free
    [$.__dataset_modifier, $.__temp_table_modifier, $._member_access_modifier],
    [
      $.__dataset_modifier,
      $.__temp_table_modifier,
      $._buffer_query_modifier,
      $._member_access_modifier,
    ],
    [
      $.__data_source_access_modifier,
      $.__dataset_modifier,
      $.__temp_table_modifier,
      $._buffer_query_modifier,
      $._member_access_modifier,
    ],
    [
      $._buffer_query_modifier,
      $.__class_property_class_modifier,
      $.__data_source_static,
      $.__event_type_modifier,
      $.__variable_modifier,
    ],
    [$.__class_property_class_modifier, $.__event_type_modifier],
    [$.__class_property_class_modifier, $.__event_type_modifier, $.__variable_modifier],
  ],
  inline: ($) => [
    $.__find_record_name,
    $.__find_index_name,
    $.__assign_record_name,
    $.__temp_table_like_name,
    $.__browse_flag_option,
    $._identifier_or_array_access,
    $._parameter_direction,
    $.__buffer_compare_compares,
    $.__call_argument,
    $.__underline_field,
    $.__put_control,
    $.__export_expression,
    $.__system_help_position,
    $.__include_file_target,
    $.__include_arguments,
    $.__for_by_phrase,
    $.system_handle_identifier,
  ],

  precedences: ($) => precedences($),

  rules: (() => {
    const ctx = { kw };
    return {
      source_code: ($) => optional($.__source_statements),
      __source_statements: ($) => prec.right(seq($._statement, optional($.__source_statements))),

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
      __include_file_reference: ($) => seq($.__include_file_opener, "}", optional(".")),
      __include_file_opener: ($) =>
        seq(
          "{",
          field("file", $.__include_file_target),
          optional(field("arguments", $.__include_arguments)),
        ),
      include_expression: ($) => $.__include_file_reference,
      include_statement: ($) => $.__include_file_reference,
      __include_arguments: ($) => choice($.__include_arguments_values, $.__include_arguments_named),
      __include_arguments_values: ($) =>
        prec.right(
          seq(
            field("argument", alias($._include_argument_value, $.include_argument)),
            optional($.__include_arguments_values),
          ),
        ),
      __include_arguments_named: ($) =>
        prec.right(
          seq(
            field("argument", alias($.include_named_argument, $.include_argument)),
            optional($.__include_arguments_named),
          ),
        ),
      include_named_argument: ($) =>
        seq("&", field("name", $.identifier), seq("=", field("value", $._include_argument_value))),
      _include_argument_value: ($) =>
        choice(
          $.function_call,
          $.binary_expression,
          $.parenthesized_expression,
          $._identifier_or_qualified_name,
          alias($._new_keyword, $.identifier),
          alias(kw("WINDOW"), $.identifier),
          alias($._in_keyword, $.identifier),
          $.object_access,
          $.array_access,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
          $.boolean_literal,
          $.preprocessor_name,
          $.argument_reference,
          alias($.__include_operator_argument, $.comparison_operator),
        ),
      __include_operator_argument: ($) => choice("<>", ">=", "<=", "=", ">", "<"),

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
      if_preprocessor_directive: ($) => seq($.__if_preprocessor_directive_prefix, token(/&ENDIF/i)),
      __if_preprocessor_directive_prefix: ($) =>
        seq(
          token(/&IF/i),
          $.__if_preprocessor_condition_then,
          field("then_branch", $.__if_preprocessor_branch_values),
          optional($.__if_preprocessor_branches),
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
          field("then_branch", $.__if_preprocessor_branch_values),
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
      __if_preprocessor_else_branch: ($) => seq(token(/&ELSE/i), $.__if_preprocessor_branch_values),
      __if_preprocessor_branch_value: ($) =>
        choice($.string_literal, $.preprocessor_name, $.argument_reference, $.number_literal),
      __if_preprocessor_branch_values: ($) =>
        prec.right(
          seq(
            field("value", $.__if_preprocessor_branch_value),
            optional($.__if_preprocessor_branch_values),
          ),
        ),
      message_preprocessor_directive: ($) =>
        seq(token(prec(1, /&MESSAGE/i)), field("value", $.preprocessor_value)),
      undefine_preprocessor_directive: ($) =>
        seq(token(prec(1, /&UNDEFINE/i)), field("name", $.identifier)),
      preprocessor_value: ($) => token(/[^\n]+(?:~\s*\n[^\n]+)*/),
      __include_file_target: ($) => choice($.include_file_path, $.argument_reference),
      include_file_path: ($) =>
        seq(optional($.preprocessor_name), alias($.__include_file_name, $.identifier)),
      __include_file_name: ($) =>
        /[A-Za-z0-9_!\\/.-](?:[A-Za-z0-9_!\\/.-]|\{&[0-9A-Za-z_-]+\})*\.[A-Za-z][A-Za-z0-9]*/,

      // Constants
      // Must outrank `{` only when a macro occupies an entire statement line.
      __macro_statement: ($) => token(prec(2, /\{&[^}\r\n]+\}[ \t]*\r?\n/)),
      preprocessor_name: ($) => prec(1, seq($.__preprocessor_name_prefix, "}")),
      __preprocessor_name_prefix: ($) =>
        seq(
          "{",
          "&",
          $.identifier,
          optional(seq("=", field("value", $.__preprocessor_name_value))),
        ),
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
      ...statements(ctx),
      ...expressions(ctx),
      ...phrases(ctx),

      // Literals
      number_literal: ($) => token(/([0-9]+(\.[0-9]+)?|\.[0-9]+)/),
      _signed_number_literal: ($) => token(/[+-]([0-9]+(\.[0-9]+)?|\.[0-9]+)/),
      date_literal: ($) => token(/[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}/),
      null_literal: ($) => token("?"),
      boolean_literal: ($) => choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),
      procedure_name: ($) => /[A-Za-z0-9_\\/.-]+\.pl?/i,
      // Unquoted opsys-file paths, used only by INPUT FROM / OUTPUT TO targets.
      opsys_file: ($) => token(/(?:\.{1,2})?\/[A-Za-z0-9_.\-/~]*[A-Za-z0-9_\-/]/),

      _for_keyword: ($) => kw("FOR"),
      _to_keyword: ($) => kw("TO"),
      _in_keyword: ($) => kw("IN"),
      _define_keyword: ($) => kw("DEFINE", { offset: 3 }),
      _end_keyword: ($) => kw("END"),
      _by_keyword: ($) => kw("BY"),
      _as_keyword: ($) => kw("AS"),
      _no_undo_keyword: ($) => kw("NO-UNDO"),
      _of_keyword: ($) => kw("OF"),
      _like_keyword: ($) => kw("LIKE"),
      _row_keyword: ($) => kw("ROW"),
      _new_keyword: ($) => kw("NEW"),
      _dataset_keyword: ($) => kw("DATASET"),
      _on_keyword: ($) => kw("ON"),
      _at_keyword: ($) => kw("AT"),
      _using_keyword: ($) => kw("USING"),
      _help_keyword: ($) => kw("HELP"),
      _delete_keyword: ($) => kw("DELETE"),
      _close_keyword: ($) => kw("CLOSE"),
      _with_keyword: ($) => kw("WITH"),
      _routine_access_modifier: ($) =>
        choice(
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
          alias(kw("PUBLIC"), $.access_modifier),
        ),

      // Types
      generic_type: ($) => seq($.__generic_type_prefix, ">"),
      __generic_type_prefix: ($) =>
        seq($._simple_type_name, "<", $._type_name, optional($.__generic_type_arguments_tail)),
      __generic_type_arguments_tail: ($) =>
        seq(",", $._type_name, optional($.__generic_type_arguments_tail)),
      _simple_type_name: ($) =>
        choice(
          $.scoped_name,
          $.qualified_name,
          $.nested_type_name,
          $.identifier,
          $.macro_concatenated_name,
        ),
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
      macro_concatenated_name: ($) => token(MACRO_CONCATENATED_NAME),

      _widgets: ($) =>
        prec.right(alias(choice(...WIDGETS, kw("FRAME", { offset: 4 })), $.identifier)),
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
        prec.right(seq($.__assignment_statement_body, $._no_error_terminator)),
      __assignment_statement_body: ($) =>
        seq(
          field("left", $._assignable),
          field("operator", $.assignment_operator),
          field("right", choice($.array_initializer, $._expression)),
          optional($.widget_phrase),
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
          $.preprocessor_name,
        ),

      // Expressions
      parenthesized_expression: ($) => seq($._parenthesized_expression_prefix, ")"),
      _parenthesized_expression_prefix: ($) => seq("(", $._expression),
      _expressions: ($) => seq($._expression, optional($.__expressions_tail)),
      __expressions_tail: ($) => seq(",", $._expression, optional($.__expressions_tail)),
      unary_expression: ($) =>
        choice(
          prec("unary", seq($.__unary_sign, $._expression)),
          prec("not", seq($._not_keyword, $._expression)),
        ),
      __unary_sign: ($) => choice("+", "-"),
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
      _object_access_plain_prefix: ($) =>
        field("left", choice($._object_access_plain_left, $._object_access_expression_left)),
      _object_access_plain_left: ($) =>
        choice(
          $._identifier_or_qualified_name,
          $.system_handle_identifier,
          $.preprocessor_name,
          $.scoped_name,
        ),
      _object_access_widget_prefix: ($) =>
        seq(
          field("widget", alias($._widgets, $.identifier)),
          field("left", choice($._identifier_or_qualified_name, $.preprocessor_name)),
        ),
      _object_access_handle_prefix: ($) =>
        prec.right(
          seq(
            field("handle", $.__object_access_handle_type),
            field("name", $._identifier_or_qualified_name),
          ),
        ),
      __object_access_handle_type: ($) =>
        choice(
          alias(kw("TEMP-TABLE"), $.identifier),
          alias(kw("BUFFER"), $.identifier),
          alias(kw("DATA-SOURCE"), $.identifier),
          alias(kw("STREAM"), $.identifier),
        ),
      object_access: ($) => seq($._object_access_prefix, $._object_access_tail),
      _object_access_prefix: ($) =>
        choice(
          $._object_access_widget_prefix,
          $._object_access_handle_prefix,
          $._object_access_plain_prefix,
        ),
      _object_access_expression_left: ($) =>
        choice($.function_call, $.parenthesized_expression, $.new_expression, $.array_access),

      // Preserve a flat tree for chained .NET names such as `Pkg::Type::Member`.
      scoped_name: ($) => prec.left(seq(field("left", $.identifier), $.__scoped_name_tail)),
      __scoped_name_tail: ($) =>
        prec.right(
          seq(
            $._namedoublecolon,
            field("right", alias($._identifier_immediate, $.identifier)),
            optional($.__scoped_name_tail),
          ),
        ),

      qualified_name: ($) => seq(field("left", $._qualified_name_left), $.__qualified_name_tail),
      __qualified_name_tail: ($) =>
        seq(
          $._namedot,
          field("right", alias($._identifier_immediate, $.identifier)),
          optional($.__qualified_name_tail),
        ),
      _qualified_name_left: ($) =>
        choice(
          $.macro_concatenated_name,
          $.identifier,
          $.preprocessor_name,
          alias(kw("INTERFACE"), $.identifier),
        ),

      nested_type_name: ($) => seq(field("left", $._nested_type_left), $.__nested_type_tail),
      __nested_type_tail: ($) =>
        seq(
          $._nameplus,
          field("right", alias($._identifier_immediate, $.identifier)),
          optional($.__nested_type_tail),
        ),
      _nested_type_left: ($) => choice($.qualified_name, $.identifier),

      // Array
      array_initializer: ($) => seq($.__array_initializer_prefix, "]"),
      __array_initializer_prefix: ($) => seq("[", optional($._expressions)),

      array_access: ($) => seq($.__array_access_prefix, "]"),
      __array_access_prefix: ($) =>
        seq(
          field("array", choice($._identifier_or_qualified_name, $.object_access, $.scoped_name)),
          "[",
          field("index", $._array_subscript),
        ),
      _array_subscript: ($) =>
        choice(
          $._expressions,
          seq(field("start", $._expression), $._for_keyword, field("count", $._expression)),
        ),

      // Callables
      arguments: ($) => seq($.__arguments_prefix, ")"),
      __arguments_prefix: ($) => seq("(", optional($._argument_list)),
      // COM calls use empty comma-delimited slots for omitted positional arguments.
      // deopt: recurse
      _argument_list: ($) =>
        choice(
          seq($.argument, repeat(seq(",", optional($.argument)))),
          repeat1(seq(",", optional($.argument))),
        ),
      argument: ($) =>
        seq(
          optional(prec.dynamic(1, field("direction", $._parameter_direction))),
          $.__argument_body,
        ),
      __argument_body: ($) =>
        seq(
          choice(
            seq(field("name", $._identifier_or_qualified_name), $.__argument_in_handle),
            seq(
              choice(
                seq(
                  choice(kw("TABLE"), kw("BUFFER"), kw("TABLE-HANDLE"), kw("DATASET-HANDLE")),
                  field(
                    "name",
                    choice(
                      $._identifier_or_qualified_name,
                      $.object_access,
                      $.function_call,
                      $.binary_expression,
                    ),
                  ),
                ),
                field("name", $._expression),
              ),
              optional($.__argument_in_handle),
            ),
          ),
          optional(seq($._as_keyword, field("type", $._type_name))),
          optional(choice(kw("BY-REFERENCE"), kw("BY-VALUE"), kw("APPEND"), kw("BIND"))),
        ),
      __argument_in_handle: ($) =>
        seq(
          $._in_keyword,
          field(
            "in_handle",
            choice(
              $._identifier_or_qualified_name,
              $.system_handle_identifier,
              $.object_access,
              $.array_access,
              $.parenthesized_expression,
              $.function_call,
            ),
          ),
        ),

      function_call: ($) =>
        seq(
          field(
            "function",
            choice(
              $._identifier_or_qualified_name,
              alias($.__symbolic_routine_name, $.identifier),
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
          $.__widget_qualified_name_separator,
          $._widgets,
          field("widget", choice($.identifier, $.preprocessor_name)),
        ),
      __widget_qualified_name_separator: ($) => $._in_keyword,

      _window_handle: ($) =>
        choice(
          $._identifier_or_qualified_name,
          $.system_handle_identifier,
          $.object_access,
          $.function_call,
          $.scoped_name,
          $.preprocessor_name,
        ),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_\-&#%$!]*/i),

      // Routine names accept initials and operators that remain illegal in data identifiers.
      _routine_name: ($) =>
        choice(
          $.identifier,
          $.qualified_name,
          alias($.__symbolic_routine_name, $.identifier),
          alias($.__operator_routine_name, $.identifier),
        ),
      __symbolic_routine_name: ($) => token(/[!#$%][\p{L}\p{N}_\-&#%$!]*/i),

      __numeric_routine_name: ($) => token(/[0-9][\p{N}\-]*[\p{L}][\p{L}\p{N}_\-&#%$!]*/i),

      __operator_routine_name: ($) =>
        token(/[_\p{L}][\p{L}\p{N}_\-&#%$!]*[*+\/][\p{L}\p{N}_\-&#%$!*+\/]*/i),

      __dash_routine_name: ($) => token(/-[\p{L}][\p{L}\p{N}_\-&#%$!]*/i),

      _unquoted_name_initial: ($) =>
        choice(
          alias($.__symbolic_routine_name, $.identifier),
          alias($.__numeric_routine_name, $.identifier),
        ),
      _routine_name_initial: ($) =>
        choice($._unquoted_name_initial, alias($.__dash_routine_name, $.identifier)),
      system_handle_identifier: ($) =>
        alias(
          token(prec(1, new RegExp(`(${SYSTEM_HANDLE_WORDS.map(escape_regex).join("|")})`, "i"))),
          $.identifier,
        ),
      _label: ($) => seq(field("label", $.identifier), alias($._colon, ":")),
      // `!` is excluded after `.` and `:` because it is legal only in routine names.
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_\-&#%$]*/i),
      _alias_name: ($) => choice($.identifier, $.string_literal, $._value_expression),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
      _object_access_tail: ($) =>
        // deopt: recurse
        repeat1(
          choice(
            seq(
              $._object_access_separator,
              field("right", alias($._identifier_immediate, $.identifier)),
            ),
            seq($._namedoublecolon, field("member", alias($._identifier_immediate, $.identifier))),
          ),
        ),
      _object_access_separator: ($) => choice($._namecolon, token.immediate("?:")),
      _identifier_or_string_literal: ($) => choice($.identifier, $.string_literal),
      _value_expression: ($) => seq($.__value_expression_opener, ")"),
      __value_expression_opener: ($) => seq(kw("VALUE"), "(", field("value", $._expression)),
      _terminator: ($) => choice($._terminator_dot, ";"),
      _no_error_terminator: ($) => seq(optional($.__no_error), $._terminator),
      __no_error: ($) => alias(kw("NO-ERROR"), $.no_error),

      // Contains non-core statement-specific shared rules
      ...commonRules(ctx),
      // Contains $._expression and $._primary_expression aggregates
      ...coreExpressions(ctx),
      // Contains only $._statement aggregate and statement costs
      ...coreStatements(ctx),
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
