/// <reference types="tree-sitter-cli/dsl" />

import commonRules from "./grammar/core/common.js";
import coreExpressions from "./grammar/core/expressions.js";
import coreStatements from "./grammar/core/statements.js";
import expressions from "./grammar/expressions/index.js";
import { kw } from "./grammar/helpers/keywords.js";
import { label_identifier, numeric_identifier } from "./grammar/helpers/label-keywords.js";
import keywordRules, {
  COMPARISON_OPERATORS,
  WIDGETS,
  inline as inlineKeywords,
} from "./grammar/keywords.js";
import phrases from "./grammar/phrases/index.js";
import precedences from "./grammar/precedences/index.js";
import statements from "./grammar/statements/index.js";

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
const NAME_CHARS = `[A-Za-z0-9_\\-&#%$]`;
const MACRO_CONCATENATED_NAME = new RegExp(
  `[_A-Za-z]${NAME_CHARS}*(?:${MACRO}${NAME_CHARS}*)+` +
    `|(?:${MACRO})+${NAME_CHARS}+(?:${MACRO}${NAME_CHARS}*)*`,
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
    $._macro_extra_start,
    $._macro_extra_payload,
    $._macro_extra_default,
    $._preprocessor_start,
    $._label_start,
    $._escape,
    $._end_of_file,
    $._block_end,
    $._include_string_literal,
  ],
  extras: ($) => [
    /[\s\f\uFEFF\u2060\u200B]/,
    $.comment,
    $.argument_reference,
    $.constant,
    $._escape,
  ],
  word: ($) => $.identifier,
  conflicts: ($) => [
    // f(A<B,C> BY-VALUE) can contain a generic type with a passing modifier
    // or two comparisons when BY-VALUE is an identifier. Keep both parses.
    [$.__argument_generic_type_prefix, $._qualified_identifier],
    // The same argument ambiguity applies to scoped names, e.g. ns::A<B,C>.
    [$.__argument_generic_type_prefix, $._expression],
    // f(A+B<C,D> BY-VALUE) also permits a nested type or arithmetic comparisons.
    [$._qualified_identifier, $._nested_type_left],
    // There are many statements where x ( ) has different meanings (aggregate/accum)
    [$._expression, $.function_call],
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
    // not reach the shared widget-entry and bare-handle branches used elsewhere.
    [$.__view_hide_widget_ref],
    // `ON … PERSISTENT RUN chx IN THIS-PROCEDURE (hb).` -- on the `(` the
    // parser must choose between the trigger's argument list and a call on the
    // context that precedes it. Both are alive at that token.
    [$.__on_context_value, $.function_call],
    // `DYNAMIC-FUNCTION(pNom IN h)` has the same ambiguity after a bare name,
    // before the argument expression has reduced to __argument_body.
    [$.__argument_in_handle, $.__widget_qualified_name_separator],
    // `DYNAMIC-FUNCTION(ENTRY(2,c) IN h)` against
    // `trashcan:LOAD-IMAGE("a") IN FRAME y` -- on the IN after a call the
    // parser must choose between the argument's own IN clause and a widget
    // qualifier. A precedence was tried first and cannot resolve it: it fixes
    // one reading for every call, and only the token after IN tells them apart.
    [$.__argument_body, $.widget_qualified_name, $._expression],
    [$.widget_qualified_name, $._expression],
    // `a::c` off a bare name is a scoped_name; the object-access tail reads the
    // same `::` for the receivers scoped_name cannot take, so on that token
    // both are alive and only the receiver settles it -- which the parser has
    // already reduced away. A precedence was tried first and does not resolve
    // it: this is a shift/reduce on the token, not an ordering of rules.
    [$._qualified_identifier, $.scoped_name],
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
      $.__temp_table_modifier,
    ],
    [$.__class_property_class_modifier, $.__event_type_modifier],
    [$.__class_property_class_modifier, $.__event_type_modifier, $.__variable_modifier],
    [$.__class_property_class_modifier, $.__temp_table_modifier, $.__variable_modifier],
    [$.__class_property_class_modifier, $.__variable_modifier],
    // A {&NAME} macro accessor modifier looks the same whether it starts a
    // new GET/SET accessor or, degenerately, continues the previous one; only
    // the keyword that follows (GET/SET) settles it.
    [$.property_definition],
    // EXTENT with no size, immediately followed by a {&NAME} accessor
    // modifier, looks the same as EXTENT sized by that same {&NAME} macro
    // until the token after the closing '}' settles which one it was.
    [$._extent_phrase],
    // DEFINE STATIC PROTECTED/PRIVATE ... reads the same up to the access
    // modifier whether it is temp-table's own STATIC-then-access ordering or
    // another DEFINE's shared _member_access_modifier chain; only what
    // follows settles it.
    [$.__temp_table_modifier, $._member_access_modifier],
  ],
  inline: ($) => [
    ...inlineKeywords($),
    $._label,
    $.__widget_name,
    $.__frame_identifier,
    $._frame_name,
    $.__frame_color_value,
    $.__frame_column_keyword,
    $._list_item_pairs_phrase,
    $._list_items_phrase,
    $._parenthesized_value,
    $._display_space_phrase,
    $._serialization_modifier,
    $._position_length,
    $._except_fields,
    $._initial_value,
    $._object_access_plain_left,
    $._object_access_expression_left,
    $._object_access_plain_prefix,
    $._alert_box_title_value,
    $._alert_buttons_phrase,
    $.__include_file_reference,
    $._format_label,
    $._comparison_operator_no_eq,
    $._generic_type_arguments_tail,
    $._simple_type_name,
    $._identifier_or_string_literal,
    $._as_type_name_phrase,
    $._window_handle,
    $._block_option,
    $._echo_phrase,
    $._on_phrase_action,
    $._primary_expression,
    $._events,
    $.__preprocessor_name_value,
    $._identifier_or_access_or_call,
    $._format_validate,
    $._collate_body,
    $._identifier_or_access,
    $._format_format,
    $._object_access_handle_prefix,
    $._object_access_widget_prefix,
    $._format_colon_to,
    $.__temp_table_like_name,
    $.__browse_flag_option,
    $.__browse_option_expression,
    $.__class_property_accessor_modifier,
    $.__compile_page_size_option,
    $.__compile_page_width_option,
    $.__prompt_for_font_option,
    $.__system_dialog_initial_dir_option,
    $.__system_dialog_title_option,
    $.__display_keyword_identifier,
    $._identifier_or_array_access,
    $._unquoted_name_initial,
    $._routine_name_initial,
    $._parameter_direction,
    $._dos_unix_command,
    $.__buffer_compare_compares,
    $.__call_argument,
    $.__system_help_position,
    $.__include_file_target,
    $.__include_arguments,
    $.__for_by_phrase,
    $._find_record_option,
    $._method_modifier_no_abstract,
    $._method_definition_signature,
    $.system_handle_identifier,
  ],

  precedences: ($) => precedences($),

  rules: (() => {
    const ctx = { kw };
    return {
      // A complete statement list can consume EOF too, preserving the statement
      // interpretation of a standalone include instead of making it an expression.
      source_code: ($) => optional(seq($._statements, optional($._end_of_file))),
      _statements: ($) => prec.right(seq($._statement, optional($._statements))),

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
      // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
      __include_file_opener: ($) =>
        seq(
          "{",
          field("file", $.__include_file_target),
          optional(field("arguments", $.__include_arguments)),
        ),
      include_expression: ($) => $.__include_file_reference,
      include_statement: ($) => seq(optional($._label), $.__include_file_reference),
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
        seq(
          "&",
          field(
            "name",
            choice(
              alias($.__include_argument_name, $.identifier),
              $.preprocessor_name,
              $.argument_reference,
              $.macro_concatenated_name,
            ),
          ),
          "=",
          field("value", $._include_argument_value),
        ),
      __include_argument_name: ($) => token(/[A-Za-z0-9_\-.&#%$!]+/),
      // oxlint-disable-next-line tree-sitter-optimize/body-extraction
      _include_argument_value: ($) =>
        choice(
          $.function_call,
          $.binary_expression,
          $.parenthesized_expression,
          $._qualified_identifier,
          alias($._kw_new, $.identifier),
          alias($._kw_window, $.identifier),
          alias($._kw_in, $.identifier),
          $.system_handle_identifier,
          $.object_access,
          $.array_access,
          $.string_literal,
          alias($._include_string_literal, $.string_literal),
          $.number_literal,
          alias($._signed_number_literal, $.number_literal),
          $.boolean_literal,
          $.preprocessor_name,
          $.argument_reference,
          alias($.__include_operator_argument, $.comparison_operator),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/token-packing
      __include_operator_argument: ($) => choice("<>", ">=", "<=", "=", ">", "<"),

      // Preprocessor
      global_define_preprocessor_directive: ($) =>
        seq(token(prec(1, /&GLOBAL-DEFINE/i)), $.__define_preprocessor_body),
      scoped_define_preprocessor_directive: ($) =>
        seq(token(prec(1, /&SCOPED-DEFINE/i)), $.__define_preprocessor_body),
      __define_preprocessor_body: ($) =>
        seq(field("name", $.identifier), field("value", $.preprocessor_value)),
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
      __if_preprocessor_branches: ($) =>
        choice(
          seq(
            field(
              "elseif_branch",
              seq(
                token(/&ELSEIF/i),
                $.__if_preprocessor_condition_then,
                field("then_branch", $.__if_preprocessor_branch_values),
              ),
            ),
            optional($.__if_preprocessor_branches),
          ),
          field("else_branch", seq(token(/&ELSE/i), $.__if_preprocessor_branch_values)),
        ),
      __if_preprocessor_condition_then: ($) =>
        seq(field("condition", $._expression), token(/&THEN/i)),
      __if_preprocessor_branch_values: ($) =>
        prec.right(
          seq(
            field(
              "value",
              choice($.string_literal, $.preprocessor_name, $.argument_reference, $.number_literal),
            ),
            optional($.__if_preprocessor_branch_values),
          ),
        ),
      message_preprocessor_directive: ($) =>
        seq(token(prec(1, /&MESSAGE/i)), field("value", $.preprocessor_value)),
      undefine_preprocessor_directive: ($) =>
        seq(token(prec(1, /&UNDEFINE/i)), field("name", $.identifier)),
      // AppBuilder region markers carry optional metadata on the same line.
      analyze_suspend_preprocessor_directive: ($) =>
        seq(
          token(prec(1, /&ANALYZE-SUSPEND/i)),
          optional(field("value", alias($._analyze_preprocessor_value, $.preprocessor_value))),
        ),
      analyze_resume_preprocessor_directive: ($) =>
        seq(
          token(prec(1, /&ANALYZE-RESUME/i)),
          optional(field("value", alias($._analyze_preprocessor_value, $.preprocessor_value))),
        ),
      _analyze_preprocessor_value: ($) => token.immediate(/[^\r\n]+(?:~[ \t]*\r?\n[^\r\n]+)*/),
      preprocessor_value: ($) => token(/[^\n]+(?:~\s*\n[^\n]+)*/),
      __include_file_target: ($) => choice($.include_file_path, $.argument_reference),
      include_file_path: ($) =>
        seq(optional($.preprocessor_name), alias($.__include_file_name, $.identifier)),
      __include_file_name: ($) =>
        /[A-Za-z0-9_!\\/.-](?:[A-Za-z0-9_!\\/.-]|\{&[0-9A-Za-z_-]+\})*\.[A-Za-z][A-Za-z0-9]*/,

      // Extra macros retain their names and any default or annotation payload.
      constant: ($) =>
        seq(
          $._macro_extra_start,
          choice($.identifier, $.number_literal, alias($._numeric_identifier, $.identifier)),
          optional(
            choice(
              seq(
                "=",
                field(
                  "value",
                  choice(
                    $.identifier,
                    $.string_literal,
                    $.number_literal,
                    alias($._signed_number_literal, $.number_literal),
                    alias(token(prec(1, /TRUE|FALSE|YES|NO/i)), $.boolean_literal),
                    alias($._macro_extra_default, $.preprocessor_value),
                  ),
                ),
              ),
              field("value", alias($._macro_extra_payload, $.preprocessor_value)),
            ),
          ),
          "}",
        ),

      // Constants
      preprocessor_name: ($) => prec(1, seq($.__preprocessor_name_prefix, "}")),
      __preprocessor_name_prefix: ($) =>
        seq(
          // The external opener signals value contexts; the internal opener
          // preserves contextual lexing of macro-prefixed include paths and names.
          // oxlint-disable-next-line tree-sitter-optimize/choice-product-extraction
          choice(seq("{", "&"), $._preprocessor_start),
          // {&2 = "default"} defaults positional include argument 2 when
          // the caller omits it; {&NAME} refers to a named one.
          // oxlint-disable-next-line tree-sitter-optimize/shared-choice, tree-sitter-optimize/alternative-extraction, tree-sitter-optimize/choice-product-extraction
          choice($.identifier, $.number_literal, alias($._numeric_identifier, $.identifier)),
          optional(seq("=", field("value", $.__preprocessor_name_value))),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-dispatcher-boundary
      __preprocessor_name_value: ($) =>
        choice(
          $._qualified_identifier,
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

      ...keywordRules(ctx),

      // Types
      generic_type: ($) => seq($.__generic_type_prefix, ">"),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
      __generic_type_prefix: ($) =>
        // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
        seq($._simple_type_name, "<", $._generic_type_arguments),
      // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
      _generic_type_arguments_tail: ($) => seq(",", $._generic_type_arguments),
      _generic_type_arguments: ($) => seq($._type_name, optional($._generic_type_arguments_tail)),
      _simple_type_name: ($) =>
        choice(
          $.scoped_name,
          $.qualified_name,
          $.nested_type_name,
          $.identifier,
          $.macro_concatenated_name,
        ),
      _type_name: ($) => choice($.generic_type, $._simple_type_name, $.preprocessor_name),
      _type_or_string: ($) => choice($._type_name, $.string_literal),
      _qualified_identifier: ($) =>
        choice(
          $.macro_concatenated_name,
          $.identifier,
          $.qualified_name,
          alias($._kw_procedure, $.identifier),
          alias($._kw_interface, $.identifier),
        ),
      // BUFFER and TABLE-HANDLE can be identifiers in assignments, receivers,
      // and unnamed arguments, as well as parameter and handle-type markers.
      // TODO: Support marker identifiers in ASSIGN and compound/parenthesized
      // expressions without broadening expression states; preserve assignment
      // boundaries such as ASSIGN x = Buffer y = 1.
      // oxlint-disable-next-line tree-sitter-optimize/shared-keyword-alias-choice-inline
      _bare_marker_identifier: ($) =>
        choice(alias($._kw_buffer, $.identifier), alias($._kw_table_handle, $.identifier)),
      // oxlint-disable-next-line tree-sitter-optimize/short-shared-category-name, tree-sitter-optimize/inline-mixed-symbol-choice-boundary
      _identifier_or_array_access: ($) => choice($._qualified_identifier, $.array_access),
      // oxlint-disable-next-line tree-sitter-optimize/choice-subset, tree-sitter-optimize/inline-mixed-symbol-choice-boundary
      _identifier_or_access: ($) =>
        choice($._qualified_identifier, $.array_access, $.object_access),
      // oxlint-disable-next-line tree-sitter-optimize/short-shared-category-name, tree-sitter-optimize/inline-mixed-symbol-choice-boundary
      _identifier_or_access_or_call: ($) => choice($._identifier_or_access, $.function_call),
      macro_concatenated_name: ($) => token(MACRO_CONCATENATED_NAME),

      _widgets: ($) =>
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        prec.right(alias(choice(...WIDGETS, kw("FRAME", { offset: 4 })), $.identifier)),
      // oxlint-disable-next-line tree-sitter-optimize/choice-subset
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
      // oxlint-disable-next-line tree-sitter-optimize/choice-subset
      assignment_operator: ($) => choice("=", "+=", "-=", "*=", "/="),
      _logical_operator: ($) => choice($._kw_and, $._kw_or),
      _comparison_operator: ($) => choice("=", ...COMPARISON_OPERATORS),

      // Assignabless
      assignment_statement: ($) =>
        prec.right(seq($.__assignment_statement_body, $._no_error_terminator)),
      __assignment_statement_body: ($) =>
        seq(
          field("left", $._assignable),
          field("operator", $.assignment_operator),
          field("right", choice($._assignment_value, $._bare_marker_identifier)),
          optional($.widget_phrase),
        ),

      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
      _assignment_value: ($) => choice($.array_initializer, $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
      _assignable: ($) =>
        choice(
          $.object_access,
          $._qualified_identifier,
          $.scoped_name,
          $.widget_qualified_name,
          $.array_access,
          $.function_call,
          $.system_handle_identifier,
          $.preprocessor_name,
        ),

      // Expressions
      parenthesized_expression: ($) => seq($._parenthesized_expression_prefix, ")"),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
      _parenthesized_expression_prefix: ($) => seq("(", $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/shared-recursion
      _expressions: ($) => seq($._expression, optional(seq(",", $._expressions))),
      unary_expression: ($) =>
        choice(
          prec("unary", seq($.__unary_sign, $._expression)),
          prec("not", seq($._kw_not, $._expression)),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
      __unary_sign: ($) => choice("+", "-"),
      binary_expression: ($) => binary_expression($, $._expression, $._comparison_operator),
      // _statement_expression excludes `=` from comparison operators to disambiguate
      // assignment vs equality at the statement level. Without this, `x = 5.` could
      // parse as either assignment_statement or expression_statement (equality check).
      // By excluding `=` here, expression_statement cannot match `x = 5.`, forcing it
      // to parse as assignment_statement.
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline, tree-sitter-optimize/shared-symbol-alias-choice-inline
      _statement_expression: ($) =>
        choice(
          alias($.binary_expression_no_eq, $.binary_expression),
          $.unary_expression,
          $._primary_expression,
        ),
      // excludes `=` to disambiguate assignment vs equality comparison at statement level.
      _comparison_operator_no_eq: ($) => choice(...COMPARISON_OPERATORS),
      __multiplicative_operator: ($) => choice("*", "/", kw("MOD"), kw("MODULO")),
      // Preserve the binary form's precedence when its operator reduces separately.
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      __additive_operator: ($) => prec("add", choice("+", "-")),
      // binary_expression without `=` comparison.
      // Keep additive tokens in the statement boundary so malformed macro comments
      // preserve recovery into a following assignment.
      binary_expression_no_eq: ($) =>
        binary_expression(
          $,
          $._statement_expression,
          $._comparison_operator_no_eq,
          // oxlint-disable-next-line tree-sitter-optimize/shared-choice
          choice("+", "-"),
        ),

      // Accessors
      _object_access_plain_prefix: ($) =>
        field("left", choice($._object_access_plain_left, $._object_access_expression_left)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-mixed-symbol-choice-boundary
      _object_access_plain_left: ($) =>
        choice(
          $._qualified_identifier,
          $._bare_marker_identifier,
          $.system_handle_identifier,
          $.preprocessor_name,
          $.scoped_name,
        ),
      // oxlint-disable-next-line tree-sitter-optimize/body-extraction
      _object_access_widget_prefix: ($) =>
        prec(
          "object_widget_prefix",
          choice(
            seq(
              field("widget", alias($._widgets, $.identifier)),
              // oxlint-disable-next-line tree-sitter-optimize/shared-choice
              field("left", choice($._qualified_identifier, $.preprocessor_name)),
            ),
            seq(
              field("widget", alias(kw("FRAME", { offset: 4 }), $.identifier)),
              field("left", alias($._numeric_identifier, $.identifier)),
            ),
          ),
        ),
      _object_access_handle_prefix: ($) =>
        prec.right(
          seq(
            field("handle", $.__object_access_handle_type),
            field("name", $._qualified_identifier),
          ),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
      __object_access_handle_type: ($) =>
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("TEMP-TABLE"), $.identifier),
          alias($._kw_buffer, $.identifier),
          alias($._kw_data_source, $.identifier),
          alias($._kw_stream, $.identifier),
        ),
      object_access: ($) => seq($._object_access_prefix, $._object_access_tail),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
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
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline, tree-sitter-optimize/shared-symbol-alias-choice-inline
      _qualified_name_left: ($) =>
        choice(
          $.macro_concatenated_name,
          $.identifier,
          $.preprocessor_name,
          alias($._kw_interface, $.identifier),
        ),

      nested_type_name: ($) => seq(field("left", $._nested_type_left), $.__nested_type_tail),
      __nested_type_tail: ($) =>
        seq(
          $._nameplus,
          field("right", alias($._identifier_immediate, $.identifier)),
          optional($.__nested_type_tail),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-field-choice, tree-sitter-optimize/single-use-shared-choice-inline
      _nested_type_left: ($) => choice($.qualified_name, $.identifier),

      // Array
      array_initializer: ($) => seq($._array_initializer_prefix, "]"),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
      _array_initializer_prefix: ($) => seq("[", optional($._expressions)),

      array_access: ($) => seq($.__array_access_prefix, "]"),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-field-choice-sequence
      __array_access_prefix: ($) =>
        seq(
          field("array", choice($._qualified_identifier, $.object_access, $.scoped_name)),
          "[",
          field("index", $._array_subscript),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
      _array_subscript: ($) =>
        choice(
          $._expressions,
          seq(field("start", $._expression), $._kw_for, field("count", $._expression)),
        ),

      // Callables
      arguments: ($) => seq($.__arguments_prefix, ")"),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence, tree-sitter-optimize/non-empty-tail-extraction
      __arguments_prefix: ($) => seq("(", optional($.argument), optional($.__arguments_comma_tail)),
      // COM calls use empty comma-delimited slots for omitted positional arguments.
      // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
      __arguments_comma_tail: ($) =>
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(",", optional($.argument), optional($.__arguments_comma_tail)),
      argument: ($) =>
        seq(
          optional(prec.dynamic(1, field("direction", $._parameter_direction))),
          $.__argument_body,
        ),
      __argument_body: ($) =>
        seq(
          choice(
            seq(field("name", $._qualified_identifier), $.__argument_in_handle),
            seq(
              choice(
                seq(
                  choice($._kw_table, $._kw_buffer, $._kw_table_handle, $._kw_dataset_handle),
                  field(
                    "name",
                    choice(
                      $._qualified_identifier,
                      $.object_access,
                      $.function_call,
                      $.binary_expression,
                    ),
                  ),
                ),
                field(
                  "name",
                  choice(
                    $._expression,
                    alias($.__argument_generic_type, $.generic_type),
                    $._bare_marker_identifier,
                  ),
                ),
              ),
              optional($.__argument_in_handle),
            ),
          ),
          optional($.__argument_type_passing),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
      __argument_type_passing: ($) =>
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
          seq($._kw_as, field("type", $._type_name), optional($.__argument_passing)),
          $.__argument_passing,
        ),
      __argument_passing: ($) =>
        choice(
          kw("BY-REFERENCE"),
          kw("BY-VALUE"),
          kw("APPEND"),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          kw("BIND"),
        ),
      __argument_generic_type: ($) => seq($.__argument_generic_type_prefix, ">"),
      // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
      __argument_generic_type_prefix: ($) =>
        seq(
          choice(
            $.scoped_name,
            $.qualified_name,
            alias($.__argument_nested_type, $.nested_type_name),
            $.identifier,
            $.macro_concatenated_name,
          ),
          "<",
          $._generic_type_arguments,
        ),
      // Share the expression '+' token so a+b remains addition in arguments.
      __argument_nested_type: ($) =>
        seq(field("left", $._nested_type_left), $.__argument_nested_type_tail),
      __argument_nested_type_tail: ($) =>
        seq(
          "+",
          field("right", alias($._identifier_immediate, $.identifier)),
          optional($.__argument_nested_type_tail),
        ),
      __argument_in_handle: ($) =>
        seq(
          $._kw_in,
          field(
            "in_handle",
            choice(
              $._qualified_identifier,
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
              $._qualified_identifier,
              alias($.__symbolic_name, $.identifier),
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
            choice($._qualified_identifier, $.scoped_name, $.object_access, $.function_call),
          ),
          $.__widget_qualified_name_separator,
          choice(
            seq($._widgets, field("widget", choice($.identifier, $.preprocessor_name))),
            seq(
              alias(kw("FRAME", { offset: 4 }), $.identifier),
              field("widget", alias($._numeric_identifier, $.identifier)),
            ),
          ),
        ),
      __widget_qualified_name_separator: ($) => $._kw_in,

      _window_handle: ($) =>
        choice(
          $._qualified_identifier,
          $.system_handle_identifier,
          $.object_access,
          $.function_call,
          $.scoped_name,
          $.preprocessor_name,
        ),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_A-Za-z][A-Za-z0-9_\-&#%$!]*/),

      // Routine names accept initials and operators that remain illegal in data identifiers.
      // oxlint-disable-next-line tree-sitter-optimize/shared-symbol-alias-choice-inline
      _routine_name: ($) =>
        choice(
          $.identifier,
          $.qualified_name,
          alias($.__symbolic_name, $.identifier),
          alias($.__operator_name, $.identifier),
        ),
      __symbolic_name: ($) => token(/[!#$%][A-Za-z0-9_\-&#%$!]*/),

      _numeric_identifier: ($) => numeric_identifier(),

      __numeric_name: ($) => token(/[0-9][0-9\-]*[A-Za-z][A-Za-z0-9_\-&#%$!]*/),

      __operator_name: ($) => token(/[_A-Za-z][A-Za-z0-9_\-&#%$!]*[*+\/][A-Za-z0-9_\-&#%$!*+\/]*/),

      __dash_name: ($) => token(/-[A-Za-z][A-Za-z0-9_\-&#%$!]*/),

      _unquoted_name_initial: ($) =>
        choice(alias($.__symbolic_name, $.identifier), alias($.__numeric_name, $.identifier)),
      _routine_name_initial: ($) =>
        choice($._unquoted_name_initial, alias($.__dash_name, $.identifier)),
      system_handle_identifier: ($) =>
        alias(
          token(prec(1, new RegExp(`(${SYSTEM_HANDLE_WORDS.map(escape_regex).join("|")})`, "i"))),
          $.identifier,
        ),
      _label: ($) =>
        seq(
          $._label_start,
          field("label", alias($._label_identifier, $.identifier)),
          alias($._colon, ":"),
        ),
      // `!` is excluded after `.` and `:` because it is legal only in routine names.
      _identifier_immediate: ($) => token.immediate(/[_A-Za-z][A-Za-z0-9_\-&#%$]*/),
      _alias_name: ($) => choice($.identifier, $.string_literal, $._value_expression),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
      // oxlint-disable-next-line tree-sitter-optimize/recursive-choice-item-extraction
      _object_access_tail: ($) =>
        seq(
          choice(
            seq(
              $._object_access_separator,
              field("right", alias($._identifier_immediate, $.identifier)),
            ),
            seq($._namedoublecolon, field("member", alias($._identifier_immediate, $.identifier))),
          ),
          optional($._object_access_tail),
        ),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
      _object_access_separator: ($) => choice($._namecolon, token.immediate("?:")),
      // oxlint-disable-next-line tree-sitter-optimize/choice-subset, tree-sitter-optimize/short-shared-category-name
      _identifier_or_string_literal: ($) => choice($.identifier, $.string_literal),
      _value_expression: ($) => seq($._value_expression_opener, ")"),
      _aliased_value_expression: ($) => alias($._value_expression, $.value_expression),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
      _value_expression_opener: ($) => seq($._kw_value, "(", field("value", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
      _terminator: ($) => choice($._terminator_dot, ";", $._end_of_file),
      // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
      _no_error_terminator: ($) => seq(optional($.__no_error), $._terminator),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      __no_error: ($) => alias(kw("NO-ERROR"), $.no_error),

      // Contains non-core statement-specific shared rules
      _if_preprocessor_statement: ($) =>
        alias($.if_preprocessor_directive_statement, $.if_preprocessor_directive),
      ...commonRules(ctx),
      // Contains $._expression and $._primary_expression aggregates
      ...coreExpressions(ctx),
      // Contains only $._statement aggregate and statement costs
      ...coreStatements(ctx),
      // Labels have different keyword restrictions in blocks and EDITING phrases.
      _label_identifier: ($) => label_identifier(),
      _editing_label_identifier: ($) => label_identifier(true),
    };
  })(),
});

// Helpers
function escape_regex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function binary_expression(
  $,
  expression,
  comparison_operator,
  additive_operator = $.__additive_operator,
) {
  return choice(
    prec.left("multiplication", seq(expression, $.__multiplicative_operator, expression)),
    prec.left("add", seq(expression, additive_operator, expression)),
    prec.left("compare", seq(expression, comparison_operator, expression)),
    prec.left("logical", seq(expression, $._logical_operator, expression)),
  );
}
