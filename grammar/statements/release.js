module.exports = ({ kw }) => ({
  release_statement: ($) =>
    seq(kw("RELEASE"), field("record", $._identifier_or_qualified_name), $._no_error_terminator),
});
