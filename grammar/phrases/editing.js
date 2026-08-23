export default ({ kw }) => ({
  editing_phrase: ($) =>
    seq(kw("EDITING"), alias($._colon, ":"), repeat1($._statement), $._end_keyword),
});
