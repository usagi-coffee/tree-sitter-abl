export default ({ kw }) => ({
  release_statement: ($) =>
    seq($._kw_release, field("record", $._identifier_or_qualified_name), $._no_error_terminator),
});
