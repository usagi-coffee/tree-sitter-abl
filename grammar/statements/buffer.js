const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  buffer_definition: ($) =>
    prec.right(
      1,
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        ...definitionModifiers($, kw, {
          access: ["PRIVATE", "PROTECTED"],
          new: true,
          scope: ["SHARED"],
          static: true,
        }),
        kw("BUFFER"),
        $.__buffer_body,
        $._terminator,
      ),
    ),

  __buffer_body: ($) =>
    seq(
      field("name", $.identifier),
      kw("FOR"),
      optional(kw("TEMP-TABLE")),
      field("table", $.__buffer_table_name),
      repeat(
        choice(
          kw("PRESELECT"),
          seq(kw("LABEL"), field("label", $.__buffer_name_or_string)),
          seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
          seq(
            kw("NAMESPACE-PREFIX"),
            field("namespace_prefix", $.string_literal),
          ),
          seq(kw("XML-NODE-NAME"), field("node", $.string_literal)),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
        ),
      ),
    ),

  __buffer_name_or_string: ($) => choice($.identifier, $.string_literal),
  __buffer_table_name: ($) => choice($.identifier, $.qualified_name),
});
