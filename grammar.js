/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const core_accessors = require("./grammar/core/accessors");
const core_expressions = require("./grammar/core/expressions");
const core_operators = require("./grammar/core/operators");
const core_statements = require("./grammar/core/statements");
const core_extras = require("./grammar/core/extras");

const definitions = require("./grammar/definitions");
const expressions = require("./grammar/expressions");
const statements = require("./grammar/statements");

const PREC = {
  LOGICAL: 1,
  COMPARE: 2,
  ADD: 3,
  MULT: 4,
  UNARY: 5,
};

// DO NOT CHANGE THESE TO USE PRECEDENCE
const kw = (word) =>
  seq(alias(token(new RegExp(word, "i")), word), token.immediate(/\s+/));
const tkw = (word, aliasName = word) =>
  alias(token(new RegExp(word, "i")), aliasName);
const op = (word) =>
  seq(alias(token(new RegExp(word, "i")), word), token.immediate(/\s+/));

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
  extras: ($) => [/\s/, $.comment, $.include_extra, $.constant_extra],
  word: ($) => $.identifier,
  conflicts: ($) => [
    [$._primary_expression, $.function_call],
    [$._statement, $.if_statement],
    [$._primary_expression, $._assignable],
    [$._expression, $._statement_expression],
    // Definitions
    [
      $.__buffer_access_modifier,
      $.__query_access_modifier,
      $.__temp_table_access_modifier,
      $.__variable_access_modifier,
    ],
    [$.__temp_table_access_modifier, $.__variable_access_modifier],
    [$.__temp_table_static_modifier, $.__variable_static_modifier],
  ],
  inline: ($) => [$.class_body_item],

  rules: (() => {
    const ctx = { PREC, kw, tkw, op };
    return {
      source_file: ($) => repeat($._statement),

      ...definitions(ctx),
      ...statements(ctx),
      ...expressions(ctx),

      // Literals
      number_literal: ($) => token(prec(-1, /[0-9]+(\.[0-9]+)?/)),
      date_literal: ($) =>
        token(prec(1, /[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}/)),
      string_literal: ($) => $._escaped_string,
      null_literal: ($) => "?",
      boolean_literal: ($) => token(/TRUE|FALSE|YES|NO/i),
      file_name: ($) => /[A-Za-z0-9_\/.-]+\.i/i,

      // Types
      generic_type: ($) =>
        seq($._simple_type_name, "<", $._simple_type_name, ">"),
      _simple_type_name: ($) =>
        choice($.scoped_name, $.qualified_name, $.identifier),
      _type_name: ($) => choice($.generic_type, $._simple_type_name),
      _type_or_string: ($) => choice($._type_name, $.string_literal),

      // Array
      array_initializer: ($) => seq("[", optional($._expression_list), "]"),
      _array_target: ($) =>
        choice(
          $.identifier,
          $.qualified_name,
          $.object_access,
          $.safe_object_access,
          $.scoped_name,
        ),

      // Assignabless
      _assignable: ($) =>
        choice(
          $.identifier,
          $.qualified_name,
          $.object_access,
          $.safe_object_access,
          $.array_access,
          $.function_call,
        ),

      // Identifiers
      // BE CAREFUL MODIFYING HERE, IDENTIFIER ORDER FOR SOME REASON MATTERS!
      identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_-]*/u),
      _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_-]*/u),
      parenthesized_identifier: ($) => seq("(", $.identifier, ")"),

      // Terminators
      _terminator: ($) => choice($._terminator_dot, ";"),

      ...core_accessors(ctx),
      ...core_expressions(ctx),
      ...core_extras(ctx),
      ...core_operators(ctx),
      ...core_statements(ctx),
    };
  })(),
});
