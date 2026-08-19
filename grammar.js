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
  // Word-index comparison: `FOR EACH wordidx WHERE wordidx.keywords CONTAINS
  // term`. It sits with BEGINS and MATCHES, the other word operators.
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

// Pieces of `macro_concatenated_name`, kept apart so the alternation stays
// readable: a macro reference, and the characters a name is made of.
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
    $._escaped_string,
    $.block_comment,
  ],
  extras: ($) => [/[\s\f\uFEFF\u2060\u200B]|\\\r?\n|~[ \t]*/, $.comment, $.argument_reference],
  word: ($) => $.identifier,
  conflicts: ($) => [
    // There are many statements where x ( ) has different meanings (aggregate/accum)
    [$._primary_expression, $.function_call],
    // INPUT starts either an argument direction or the screen-buffer INPUT function.
    [$.__input_expression_prefix, $.argument],
    // WITH NO-VALIDATE is valid both as prompt_for_with_phrase and as frame_phrase option
    [$.__prompt_for_with_phrase, $.frame_phrase],
    // Shared [NOT] ENTERED phrase must preserve both keyword-as-identifier spans.
    [$.__entered_operator],
    // ENABLE/DISABLE field[N] can be confused with function_call
    [$.__enable_item, $.function_call],
    [$.__disable_item, $.function_call],
    // Field / Column / Handle can be just an identifier
    [$.__widget_entry],
    // `ON … PERSISTENT RUN chx IN THIS-PROCEDURE (hb).` -- on the `(` the
    // parser must choose between the trigger's argument list and a call on the
    // context that precedes it. Both are alive at that token.
    [$.__on_context_value, $.function_call],
    // `DYNAMIC-FUNCTION("f" IN h:PARENT)` -- on the IN after an argument the
    // parser must choose between the argument's own IN clause and a widget
    // qualifier, which expects IN WINDOW. Both are alive at that token and only
    // what follows settles it, so it is decided at parse time.
    [$.__argument_body, $.__widget_qualified_name_separator],
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
          $.__include_file_opener,
          field("file", $.__include_file_target),
          optional(field("arguments", $.__include_arguments)),
          "}",
          optional("."),
        ),
      __include_file_opener: ($) => "{",
      include_expression: ($) => $.__include_file_reference,
      include_statement: ($) => $.__include_file_reference,
      __include_arguments: ($) =>
        choice(
          repeat1(field("argument", alias($._include_argument_value, $.include_argument))),
          repeat1(field("argument", alias($.include_named_argument, $.include_argument))),
        ),
      include_named_argument: ($) =>
        seq("&", field("name", $.identifier), seq("=", field("value", $._include_argument_value))),
      _include_argument_value: ($) =>
        choice(
          $.function_call,
          $.binary_expression,
          $.parenthesized_expression,
          $._identifier_or_qualified_name,
          alias(kw("NEW"), $.identifier),
          alias(kw("WINDOW"), $.identifier),
          alias(kw("IN"), $.identifier),
          $.object_access,
          $.array_access,
          $.string_literal,
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
          $.boolean_literal,
          $.preprocessor_name,
          $.argument_reference,
          // `{lib/compare.i DATE IN < DATE}` -- an include argument is raw
          // text, and this one hands the include a bare comparison operator to
          // drop into `RETURN (v1 {3} v2)`. Spelled out rather than left to a
          // catch-all, so a stray token in an argument list still fails.
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
      // `!` separates a procedure library from the member inside it, as in
      // `{h!Api.i}`, and it is a legal file-name character besides.
      // A macro can sit inside the path too -- `{strings{&Slash}strings.i}` picks the
      // separator at compile time -- so it is part of the same token. The name still
      // has to start on a path character, which leaves a leading macro to the
      // preprocessor_name that already handles it.
      __include_file_name: ($) =>
        /[A-Za-z0-9_!\\/.-](?:[A-Za-z0-9_!\\/.-]|\{&[0-9A-Za-z_-]+\})*\.[A-Za-z][A-Za-z0-9]*/,

      // Constants
      // A macro alone on its line expands to whole statements, terminator included,
      // so none follows it in the source. It outranks `{` to win in statement
      // position; anywhere else `{` still opens a preprocessor_name. It is
      // aliased to `constant`, which is why no rule of that name is needed.
      __macro_statement: ($) => token(prec(2, /\{&[^}\r\n]+\}[ \t]*\r?\n/)),
      preprocessor_name: ($) =>
        prec(
          1,
          seq(
            $.__preprocessor_name_prefix,
            optional(
              seq(
                $.__preprocessor_name_value_separator,
                field("value", $.__preprocessor_name_value),
              ),
            ),
            "}",
          ),
        ),
      __preprocessor_name_prefix: ($) => seq("{", "&", $.identifier),
      __preprocessor_name_value_separator: ($) => "=",
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
      string_literal: ($) => $._escaped_string,
      null_literal: ($) => token("?"),
      boolean_literal: ($) => choice(kw("TRUE"), kw("FALSE"), kw("YES"), kw("NO")),
      procedure_name: ($) => /[A-Za-z0-9_\\/.-]+\.pl?/i,
      // Unquoted opsys-file paths, used only by INPUT FROM / OUTPUT TO targets.
      opsys_file: ($) => token(/(?:\.{1,2})?\/[A-Za-z0-9_.\-/~]*[A-Za-z0-9_\-/]/),

      // Types
      // A generic takes as many type arguments as it declares, and each of them
      // can itself be generic: `Dictionary<CHARACTER, System.Object>`.
      generic_type: ($) =>
        seq($._simple_type_name, "<", $._type_name, repeat(seq(",", $._type_name)), ">"),
      // A data type can be assembled from a macro too: `AS {&longchar}CHAR`
      // selects CHARACTER or LONGCHAR depending on how the file was compiled.
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
      // A name is assembled at compile time from macros and the text around
      // them. The macro may lead -- `{&PREFIX}TITLE` -- but a name character has
      // to follow it, otherwise the text is a plain macro reference.
      macro_concatenated_name: ($) => token(MACRO_CONCATENATED_NAME),

      _widgets: ($) => prec.right(alias(choice(...WIDGETS, kw("FRAME", { offset: 4 })), $.identifier)),
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
      parenthesized_expression: ($) => seq($.__parenthesized_expression_prefix, $._expression, ")"),
      __parenthesized_expression_prefix: ($) => "(",
      _expressions: ($) => seq($._expression, repeat(seq(",", $._expression))),
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
      // Generated screens reach their widgets through a macro, as in
      // `FRAME {&FRAME-NAME}:PARENT`, so the name can be either.
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
      // `BUFFER b:ATTACH-DATA-SOURCE (DATA-SOURCE src:HANDLE, ?, ?).` compiles:
      // a data source is named by its keyword the same way a buffer or a
      // temp-table is, and only those two were read here.
      //
      // STREAM belongs in this list too -- `x = STREAM s:HANDLE.` compiles --
      // but adding it makes `INPUT STREAM s` ambiguous with an INPUT expression
      // followed by a stream handle, which needs a declared conflict rather
      // than a widened list.
      __object_access_handle_type: ($) =>
        prec(
          -1,
          choice(
            alias(kw("TEMP-TABLE"), $.identifier),
            alias(kw("BUFFER"), $.identifier),
            alias(kw("DATA-SOURCE"), $.identifier),
          ),
        ),
      object_access: ($) =>
        seq(
          choice(
            $._object_access_widget_prefix,
            $._object_access_handle_prefix,
            $._object_access_plain_prefix,
          ),
          $._object_access_tail,
        ),
      _object_access_expression_left: ($) =>
        choice($.function_call, $.parenthesized_expression, $.new_expression, $.array_access),

      // Left-associative so `Pkg.Model::A::B` reads as one name rather than
      // nesting: once the tail can also be reached from the object-access side,
      // the repeat has two ways to group and tree-sitter asks which.
      scoped_name: ($) => prec.left(seq(field("left", $.identifier), $.__scoped_name_tail)),
      __scoped_name_tail: ($) =>
        repeat1(
          seq($._namedoublecolon, field("right", alias($._identifier_immediate, $.identifier))),
        ),

      qualified_name: ($) => seq(field("left", $._qualified_name_left), $.__qualified_name_tail),
      __qualified_name_tail: ($) =>
        repeat1(seq($._namedot, field("right", alias($._identifier_immediate, $.identifier)))),
      // INTERFACE is unreserved and databases use it as a table name. Without it
      // here, `interface.ndos` is not a qualified name: the dot ends the
      // statement and the rest of the line becomes another one, with no error
      // node to show for it. _identifier_or_qualified_name already aliases it.
      _qualified_name_left: ($) =>
        choice(
          $.macro_concatenated_name,
          $.identifier,
          $.preprocessor_name,
          alias(kw("INTERFACE"), $.identifier),
        ),

      // `System.Windows.Forms.Control+ControlCollection` -- a nested .NET type
      // is reached off a qualified name, never off a bare one, so requiring an
      // identifier to the left of `+` meant the form never parsed in practice.
      nested_type_name: ($) =>
        seq(
          field("left", choice($.qualified_name, $.identifier)),
          repeat1(seq($._nameplus, field("right", alias($._identifier_immediate, $.identifier)))),
        ),

      // Array
      array_initializer: ($) => seq("[", optional($._expressions), "]"),

      array_access: ($) =>
        seq(
          field("array", choice($._identifier_or_qualified_name, $.object_access, $.scoped_name)),
          $.__array_access_prefix,
          field("index", $._array_subscript),
          "]",
        ),
      __array_access_prefix: ($) => "[",
      _array_subscript: ($) =>
        choice(
          $._expressions,
          seq(field("start", $._expression), kw("FOR"), field("count", $._expression)),
        ),

      // Callables
      arguments: ($) => seq($.__arguments_prefix, optional($._argument_list), ")"),
      __arguments_prefix: ($) => "(",
      // A COM automation method takes its optional parameters by position, and
      // the ones you do not pass are left empty: `nodes:ADD(,,"A", label, 1)`.
      // The list still cannot be empty, so `f()` keeps one reading.
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
            seq(
              choice(kw("TABLE"), kw("BUFFER"), kw("TABLE-HANDLE"), kw("DATASET-HANDLE")),
              // `STRING(BUFFER bufParam:BUFFER-FIELD(ENTRY(i,l)))` -- here BUFFER
              // opens an expression whose method is called, not a parameter
              // being passed, but the keyword is read first either way and the
              // call was left with nowhere to attach. Outside an argument list
              // the same text parses, which is what made the gap so narrow.
              field(
                "name",
                choice(
                  $._identifier_or_qualified_name,
                  $.object_access,
                  $.function_call,
                  // `x = STRING(BUFFER b:NAME + "y").` -- the reference is an
                  // operand here, not a parameter being passed, but BUFFER is
                  // read as the keyword either way and the rest of the
                  // expression was then left with nowhere to go.
                  $.binary_expression,
                ),
              ),
            ),
            field("name", $._expression),
          ),
          // `DYNAMIC-FUNCTION("f" IN h:PARENT)`, `IN pH[1]`, `IN (h)`,
          // `IN WIDGET-HANDLE(x)` -- the clause takes a handle expression, and
          // only a bare or qualified name was read.
          optional(
            seq(
              kw("IN"),
              field(
                "in_handle",
                choice(
                  $._identifier_or_qualified_name,
                  // A bare system handle -- `IN THIS-PROCEDURE`, `IN SESSION`,
                  // `IN ACTIVE-WINDOW`. It has to be listed in its own right:
                  // before object_access appeared here the word simply lexed as
                  // an identifier, but object_access makes the system-handle
                  // token valid at this position, and its higher precedence
                  // then wins and demands a `:` that never comes. Omitting it
                  // silently breaks the commonest spelling of the clause.
                  $.system_handle_identifier,
                  $.object_access,
                  $.array_access,
                  $.parenthesized_expression,
                  $.function_call,
                ),
              ),
            ),
          ),
          optional(seq(kw("AS"), field("type", $._type_name))),
          optional(choice(kw("BY-REFERENCE"), kw("BY-VALUE"), kw("APPEND"), kw("BIND"))),
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
          // Generated screens name the frame through a macro here too:
          // `SELF:BGCOLOR = brlib:BGCOLOR IN FRAME {&FRAME-NAME}.`
          field("widget", choice($.identifier, $.preprocessor_name)),
        ),
      __widget_qualified_name_separator: ($) => kw("IN"),

      // A generated screen names its window through a macro, as in
      // `VIEW FRAME fr IN WINDOW {&WINDOW-NAME}.`
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
      // `!` is a name character like `#`, `%` and `$`. It is what separates a
      // procedure library from the routine inside it, as in `RUN !SelCrit`,
      // and the same spelling turns up in include names.
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_\-&#%$!]*/i),

      // A routine name may open with a character a data symbol may not. The
      // compiler enters the two under different rules: a data symbol whose
      // initial is not a letter is error 257, while FUNCTION !Foo, PROCEDURE
      // !Bar, RUN !Bar and !Foo("a") all compile. Only the initial differs, so
      // this token covers that case alone and can never match what `identifier`
      // matches -- widening `identifier` instead would relax the data contexts,
      // which are correct today.
      //
      // The compiler also accepts `&`, a digit, `*`, `/` and `+` as the
      // initial. They are left out. Real code uses `!` almost
      // exclusively, and each of the others costs more than it is worth here:
      // a digit cannot be told from a number literal, and `&` is how a named
      // include argument opens -- allowing it makes `{f.i &name="x"}` lex as
      // one name and lose the argument (measured: two corpus tests).
      _routine_name: ($) => choice($.identifier, alias($.__symbolic_routine_name, $.identifier)),
      __symbolic_routine_name: ($) => token(/[!#$%][\p{L}\p{N}_\-&#%$!]*/i),

      // A routine name may also open on a digit: `PROCEDURE 4-ITEM-CODE-lookup:`
      // and `RUN 6-FIXED-WEIGHT-calc(...)`. A letter is required somewhere after
      // the digits so the token can never be a number -- `4` and `4-5` do not
      // match, and `4 - 5` still reads as a subtraction. It is wired only where
      // real code needs it, the PROCEDURE name and the RUN target, and
      // deliberately not into the head of a call, where it would be free to
      // take `4-ITEMVAR` out of an expression.
      __numeric_routine_name: ($) => token(/[0-9][\p{N}\-]*[\p{L}][\p{L}\p{N}_\-&#%$!]*/i),
      system_handle_identifier: ($) =>
        alias(
          token(prec(1, new RegExp(`(${SYSTEM_HANDLE_WORDS.map(escape_regex).join("|")})`, "i"))),
          $.identifier,
        ),
      _label: ($) => seq(field("label", $.identifier), alias($._colon, ":")),
      // The name after a name dot or colon is a field, and a field is a data
      // symbol like any other: the compiler takes `&`, `#`, `$` and `%` inside
      // one, so `tt.FIELD#` compiles while this rule rejected it. Only `%` was
      // allowed here, which is narrower than `identifier` for no reason.
      //
      // Deliberately without `!`, which `identifier` above does accept: `!` is
      // legal only in a routine name. In a data symbol the compiler raises
      // error 274, so widening this rule to match `identifier` exactly would
      // accept what the compiler rejects.
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_\-&#%$]*/i),
      _alias_name: ($) => choice($.identifier, $.string_literal, $._value_expression),
      _os_filename: ($) => choice($.string_literal, $._identifier_or_access_or_call),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
      // `pHandles[1]::custnum`, `entity:hBuf::channel` -- a class member
      // reached off a subscript or off an attribute chain rather than off a
      // bare name, which is all `scoped_name` accepts to its left.
      //
      // Taken here rather than by widening that receiver: `scoped_name` is
      // already reachable from `_array_target` and from the object-access left,
      // so putting `array_access` there closes a cycle and the grammar stops
      // generating. Handling the segment in the tail reaches both forms.
      //
      // It matters beyond the parse failure. The scanner only emits `::` where
      // the parser says the token is valid, so with no reading available the
      // two colons fell back to one: inside a FOR EACH that loose colon opened
      // the block in the middle of the WHERE clause, and outside a query
      // `b[1]::c` read as an attribute access with no error at all. The member
      // keeps its own field so the two operators stay distinguishable.
      _object_access_tail: ($) =>
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
      _value_expression: ($) =>
        seq($.__value_expression_opener, field("value", $._expression), ")"),
      __value_expression_opener: ($) => seq(kw("VALUE"), "("),
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
