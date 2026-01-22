/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const core = require("./grammar/core");
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
    [$._statement_no_def, $.if_statement],
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
      // BE CAREFUL MODIFYING HERE, ORDER FOR SOME REASON MATTERS!
      ...definitions(ctx),
      ...statements(ctx),
      ...expressions(ctx),
      // Common rules
      ...core(ctx),
    };
  })(),
});
