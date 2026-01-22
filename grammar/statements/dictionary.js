module.exports = ({ tkw }) => ({
  dictionary_statement: ($) => seq(tkw("DICTIONARY"), $._terminator),
});
