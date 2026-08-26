export default ({ kw }) => ({
  enable_statement: ($) => seq($.__enable_prefix, $._terminator),

  __enable_prefix: ($) =>
    seq(
      kw("ENABLE"),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      optional(
        choice(
          seq($.__enable_body, optional($.in_window_phrase), optional($.frame_phrase)),
          seq(optional($.in_window_phrase), $.frame_phrase),
        ),
      ),
    ),
  __enable_body: ($) =>
    choice(
      seq(alias(kw("ALL"), $.all), optional(seq(kw("EXCEPT"), $._except_name_list))),
      $.__enable_items_list,
    ),

  __enable_items_list: ($) =>
    prec.right(seq(alias($.__enable_item, $.enable_item), optional($.__enable_items_list))),

  __enable_item: ($) =>
    choice(
      seq(
        field("field", $._identifier_or_array_access),
        repeat($.format_phrase),
        optional($._when_phrase),
      ),
      seq(kw("TEXT"), "(", token(/[A-Za-z_][A-Za-z0-9_-]*/), $.format_phrase, ")"),
      seq(field("constant", $.string_literal), optional($.__enable_constant_formats)),
      alias(kw("SKIP"), $.skip),
    ),
  __enable_constant_formats: ($) =>
    prec.right(seq($.format_phrase, optional($.__enable_constant_formats))),
});
