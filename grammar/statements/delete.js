module.exports = ({ kw }) => ({
  delete_statement: ($) =>
    seq(kw("DELETE"), field("record", $.__delete_record_name), $._terminator),
  delete_object_statement: ($) =>
    seq(kw("DELETE"), kw("OBJECT"), field("name", $.identifier), $._terminator),

  __delete_record_name: ($) => choice($.identifier, $.qualified_name),
});
