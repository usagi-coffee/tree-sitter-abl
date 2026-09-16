export default ({ kw }) => ({
  _go_on_phrase: ($) => seq(kw("GO-ON"), "(", $.__go_on_keys, ")"),
  __go_on_keys: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice($.identifier, $.string_literal),
      optional(seq(optional(","), $.__go_on_keys)),
    ),
});
