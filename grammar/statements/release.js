export default ({ kw }) => ({
  release_statement: ($) =>
    seq($._kw_release, field("record", $._qualified_identifier), $._no_error_terminator),
});
