export default ({ kw }) => ({
  editing_phrase: ($) =>
    seq(
      optional(
        seq(
          $._label_start,
          field("label", alias($._editing_label_identifier, $.identifier)),
          alias($._colon, ":"),
        ),
      ),
      kw("EDITING"),
      alias($._colon, ":"),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat1($._statement),
      $._kw_end,
    ),
});
