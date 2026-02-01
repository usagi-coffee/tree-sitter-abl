module.exports = ({ kw }) => ({
  editing_phrase: ($) =>
    seq(kw("EDITING"), $._colon, repeat1($._statement), kw("END")),
});
