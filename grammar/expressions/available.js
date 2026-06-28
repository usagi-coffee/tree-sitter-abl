module.exports = ({ kw }) => ({
  available_expression: ($) =>
    seq(choice(kw("AVAIL"), kw("AVAILABLE")), field("record", $._record_or_parenthesized_record)),
});
