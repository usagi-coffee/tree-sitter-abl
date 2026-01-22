// Accessors

module.exports = ({ tkw }) => ({
  object_access: ($) =>
    prec(
      1,
      seq(
        field("left", $.identifier),
        repeat1(
          seq(
            $._namecolon,
            field("right", alias($._identifier_immediate, $.identifier)),
          ),
        ),
      ),
    ),

  safe_object_access: ($) =>
    prec(
      1,
      seq(
        field("left", $.identifier),
        repeat1(
          seq(
            token.immediate("?:"),
            field("right", alias($._identifier_immediate, $.identifier)),
          ),
        ),
      ),
    ),

  scoped_name: ($) =>
    prec(
      1,
      seq(
        field("left", $.identifier),
        repeat1(
          seq(
            $._namedoublecolon,
            field("right", alias($._identifier_immediate, $.identifier)),
          ),
        ),
      ),
    ),

  qualified_name: ($) =>
    prec(
      1,
      seq(
        field("left", $.identifier),
        repeat1(
          seq(
            $._namedot,
            field("right", alias($._identifier_immediate, $.identifier)),
          ),
        ),
      ),
    ),

  array_access: ($) =>
    seq(
      field("array", $._array_target),
      "[",
      optional($._array_subscript),
      "]",
    ),
  _array_subscript: ($) =>
    choice(
      $._expression_list,
      seq(
        field("start", $._expression),
        tkw("FOR"),
        field("count", $._expression),
      ),
    ),

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
});
