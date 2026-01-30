module.exports = ({ tkw }) => ({
  editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
});
