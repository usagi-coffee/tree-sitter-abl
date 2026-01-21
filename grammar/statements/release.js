module.exports = ({ kw }) => ({
  release_statement: ($) =>
    seq(kw("RELEASE"), field("record", $.__release_record_name), $._terminator),

  __release_record_name: ($) => choice($.identifier, $.qualified_name),
});
