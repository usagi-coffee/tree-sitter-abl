const availableExpression = require("./expressions/available");
const canFindExpression = require("./expressions/can-find");
const conditionalExpression = require("./expressions/conditional");
const aggregateExpression = require("./expressions/aggregate");
const datasetExpression = require("./expressions/dataset");
const functionExpression = require("./expressions/function");
const lockedExpression = require("./expressions/locked");
const newExpression = require("./expressions/new");

module.exports = (ctx) => {
  const { PREC, op } = ctx;
  return {
    _expression: ($) =>
      choice(
        $.conditional_expression,
        $.binary_expression,
        $.unary_expression,
        $._primary_expression,
      ),

    _expression_list: ($) =>
      seq($._expression, repeat(seq(",", $._expression))),

    _statement_expression: ($) =>
      choice(
        alias($.binary_expression_no_eq, $.binary_expression),
        $.conditional_expression,
        $.unary_expression,
        $._primary_expression,
      ),

    _primary_expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.available_expression,
        $.can_find_expression,
        $.locked_expression,
        $.object_access_expression,
        $.new_expression,
        $.dataset_reference,
        $.function_call,
        $.array_access,
        $.safe_object_access,
        $.scoped_name,
        $.qualified_name,
        $.object_access,
        $.argument_reference,
        $.identifier,
        $.number_literal,
        $.date_literal,
        $.string_literal,
        $.boolean_literal,
        $.null_literal,
        $.constant,
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    unary_expression: ($) =>
      prec(PREC.UNARY, seq(choice("+", "-", op("NOT")), $._expression)),

    binary_expression: ($) =>
      choice(
        prec.left(
          PREC.MULT,
          seq(
            $._expression,
            choice("*", "/", op("MOD"), op("MODULO")),
            $._expression,
          ),
        ),
        prec.left(
          PREC.ADD,
          seq($._expression, choice("+", "-"), $._expression),
        ),
        prec.left(
          PREC.COMPARE,
          seq($._expression, $._comparison_operator, $._expression),
        ),
        prec.left(
          PREC.LOGICAL,
          seq($._expression, $._logical_operator, $._expression),
        ),
      ),

    binary_expression_no_eq: ($) =>
      choice(
        prec.left(
          PREC.MULT,
          seq(
            $._statement_expression,
            choice("*", "/", op("MOD"), op("MODULO")),
            $._statement_expression,
          ),
        ),
        prec.left(
          PREC.ADD,
          seq(
            $._statement_expression,
            choice("+", "-"),
            $._statement_expression,
          ),
        ),
        prec.left(
          PREC.COMPARE,
          seq(
            $._statement_expression,
            $._comparison_operator_no_eq,
            $._statement_expression,
          ),
        ),
        prec.left(
          PREC.LOGICAL,
          seq(
            $._statement_expression,
            $._logical_operator,
            $._statement_expression,
          ),
        ),
      ),

    object_access_expression: ($) =>
      prec(
        1,
        seq(
          field(
            "left",
            choice($.function_call, $.parenthesized_expression, $.new_expression),
          ),
          repeat1(seq($._namecolon, field("right", $.identifier))),
        ),
      ),

    ...conditionalExpression(ctx),
    ...availableExpression(ctx),
    ...canFindExpression(ctx),
    ...lockedExpression(ctx),
    ...newExpression(ctx),
    ...aggregateExpression(ctx),
    ...functionExpression(ctx),
    ...datasetExpression(ctx),
  };
};
