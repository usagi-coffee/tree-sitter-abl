// Extras are rules that can appear anywhere in the code in the middle of some syntax
// Comments, Includes, Preprocessors, Constants and other similar syntax

module.exports = (ctx) => ({
  // Comments
  line_comment: ($) => token(seq("//", /[^\r\n]*/)),
  // block_comment is external
  comment: ($) => choice($.line_comment, $.block_comment),

  // Includes
  include: ($) =>
    seq(
      "{",
      field("file", $.include_file_reference),
      repeat(field("argument", $.include_argument)),
      "}",
      optional("."),
    ),
  include_extra: ($) =>
    token(
      choice(
        /[ \t]*\{\{&[^}\r\n]+\}[^\s}\r\n]*\.i[ \t]*\}\.?[ \t]*\r?\n/i,
        /[ \t]*\{[^\s}\r\n]*\.i[ \t]*\}\.?[ \t]*\r?\n/i,
      ),
    ),
  include_argument: ($) =>
    choice($.include_named_argument, $._include_argument_value),
  include_named_argument: ($) =>
    seq(
      "&",
      field("name", $.identifier),
      optional(seq("=", field("value", $._include_argument_value))),
    ),
  _include_argument_value: ($) =>
    choice(
      $.qualified_name,
      $.identifier,
      $.string_literal,
      $.number_literal,
      $.boolean_literal,
      $.constant,
      $.argument_reference,
      $.parenthesized_identifier,
    ),

  // Preprocessor
  preprocessor_directive: ($) => token(/&[^\n]*(?:~\s*\n[^\n]*)*/i),
  include_file_reference: ($) => seq(optional($.constant), $.file_name),
  _preprocessor_argument: ($) =>
    choice(
      $.identifier,
      $.string_literal,
      $.number_literal,
      $.boolean_literal,
      $.constant,
      $.parenthesized_identifier,
    ),

  // Constants
  constant: ($) => seq("{&", $.identifier, "}"),
  constant_extra: ($) => token(/[ \t]*\{&[^\}\r\n]+\}[ \t]*\r?\n/),
  argument_reference: ($) => token(/\{[0-9A-Za-z_-]+\}/),
});
