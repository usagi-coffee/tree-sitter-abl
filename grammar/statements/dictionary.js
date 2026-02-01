module.exports = ({ kw }) => ({
  dictionary_statement: ($) => seq(kw("DICTIONARY"), $._terminator),
});
