module.exports = ({ kw }) => ({
  buffer_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__buffer_shared_variable_scope, $.shared_variable_scope),
          seq(
            optional(alias($.__buffer_access_modifier, $.access_modifier)),
            optional(alias($.__buffer_static_modifier, $.static_modifier)),
          ),
        ),
      ),
      kw("BUFFER"),
      field("name", $.identifier),
      kw("FOR"),
      optional(kw("TEMP-TABLE")),
      field("table", $.__buffer_table_name),
      optional(kw("PRESELECT")),
      optional(seq(kw("LABEL"), field("label", $.__buffer_name_or_string))),
      optional(
        seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
      ),
      optional(
        seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $.string_literal)),
      ),
      optional(seq(kw("XML-NODE-NAME"), field("node", $.string_literal))),
      optional(
        seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
      ),
      $._terminator,
    ),

  __buffer_shared_variable_scope: ($) =>
    choice(
      seq(kw("NEW"), kw("SHARED")),
      kw("SHARED"),
    ),
  __buffer_access_modifier: ($) => choice(kw("PRIVATE"), kw("PROTECTED")),
  __buffer_static_modifier: ($) => kw("STATIC"),
  __buffer_name_or_string: ($) => choice($.identifier, $.string_literal),
  __buffer_table_name: ($) => choice($.identifier, $.qualified_name),
});
