export default ({ kw }) => ({
  size_phrase: ($) => seq($.__size_prefix, field("height", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice-sequence, tree-sitter-optimize/single-use-sequence
  __size_prefix: ($) => seq($._size_keyword, field("width", $._expression), $._kw_by),
});
