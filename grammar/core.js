module.exports = () => ({
  // Literals
  number_literal: ($) => token(prec(-1, /[0-9]+(\.[0-9]+)?/)),
  date_literal: ($) => token(prec(1, /[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}/)),
  string_literal: ($) => $._escaped_string,
  null_literal: ($) => "?",
  boolean_literal: ($) => token(/TRUE|FALSE|YES|NO/i),
  file_name: ($) => /[A-Za-z0-9_\/.-]+\.i/i,

  // Accessors
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

  // Arrays
  array_initializer: ($) => seq("[", optional($._expression_list), "]"),
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
        token(/FOR/i),
        field("count", $._expression),
      ),
    ),
  _array_target: ($) =>
    choice(
      $.identifier,
      $.qualified_name,
      $.object_access,
      $.safe_object_access,
      $.scoped_name,
    ),

  // Types
  generic_type: ($) => seq($._simple_type_name, "<", $._simple_type_name, ">"),
  _simple_type_name: ($) =>
    choice($.scoped_name, $.qualified_name, $.identifier),
  _type_name: ($) => choice($.generic_type, $._simple_type_name),
  _type_or_string: ($) => choice($._type_name, $.string_literal),

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
  identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_-]*/u),
  parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
  _identifier_immediate: ($) =>
    token.immediate(/[_\p{L}][\p{L}\p{N}_-]*/u),

  // Terminators
  _terminator: ($) => choice($._terminator_dot, ";"),
});
