const core_accessors = require("./core/accessors");
const core_expressions = require("./core/expressions");
const core_operators = require("./core/operators");
const core_statements = require("./core/statements");
const core_extras = require("./core/extras");

module.exports = (ctx) => ({
  // Literals
  number_literal: ($) => token(prec(-1, /[0-9]+(\.[0-9]+)?/)),
  date_literal: ($) => token(prec(1, /[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{2,4}/)),
  string_literal: ($) => $._escaped_string,
  null_literal: ($) => "?",
  boolean_literal: ($) => token(/TRUE|FALSE|YES|NO/i),
  file_name: ($) => /[A-Za-z0-9_\/.-]+\.i/i,

  // Types
  generic_type: ($) => seq($._simple_type_name, "<", $._simple_type_name, ">"),
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
  identifier: ($) => token(/[_\p{L}][\p{L}\p{N}_-]*/u),
  parenthesized_identifier: ($) => seq("(", $.identifier, ")"),
  _identifier_immediate: ($) => token.immediate(/[_\p{L}][\p{L}\p{N}_-]*/u),

  // Terminators
  _terminator: ($) => choice($._terminator_dot, ";"),

  ...core_accessors(ctx),
  ...core_expressions(ctx),
  ...core_extras(ctx),
  ...core_operators(ctx),
  ...core_statements(ctx),
});
