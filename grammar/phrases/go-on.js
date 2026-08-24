export default ({ kw }) => ({
  _go_on_phrase: ($) =>
    seq(kw("GO-ON"), "(", choice($.identifier, $.string_literal), optional($._go_on_key_tail), ")"),
  _go_on_key_tail: ($) =>
    seq(optional(","), choice($.identifier, $.string_literal), optional($._go_on_key_tail)),
});
