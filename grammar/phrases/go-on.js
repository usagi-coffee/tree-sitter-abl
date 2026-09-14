export default ({ kw }) => ({
  _go_on_phrase: ($) =>
    seq(
      kw("GO-ON"),
      "(",
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice($.identifier, $.string_literal),
      optional($._go_on_key_tail),
      ")",
    ),
  _go_on_key_tail: ($) =>
    seq(
      optional(","),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice($.identifier, $.string_literal),
      optional($._go_on_key_tail),
    ),
});
