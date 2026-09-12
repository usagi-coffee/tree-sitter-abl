export default ({ kw }) => ({
  editing_phrase: ($) =>
    seq(
      kw("EDITING"),
      alias($._colon, ":"),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat1($._statement),
      $._end_keyword,
    ),
});
