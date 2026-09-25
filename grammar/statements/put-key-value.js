export default ({ kw }) => ({
  put_key_value_statement: ($) => seq($.__put_key_value_prefix, $._no_error_terminator),

  __put_key_value_prefix: ($) =>
    seq(
      kw("PUT-KEY-VALUE", { offset: 11 }),
      choice(
        seq(
          $._key_section,
          kw("KEY"),
          choice(field("key", $._expression), $._kw_default),
          $._key_value,
        ),
        seq(
          choice($._kw_color, $._kw_font),
          choice(
            field("number", $._expression),
            // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
            kw("ALL"),
          ),
        ),
      ),
    ),
});
