export default ({ kw }) => ({
  dictionary_statement: ($) => seq($.__dictionary_prefix, $._terminator),

  __dictionary_prefix: ($) => kw("DICTIONARY"),
});
