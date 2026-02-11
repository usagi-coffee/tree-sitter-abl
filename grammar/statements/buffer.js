module.exports = ({ kw }) => ({
  buffer_definition: ($) =>
    prec.right(
      seq(
        kw("DEFINE", { offset: 3 }),
        optional($.__buffer_modifier),
        kw("BUFFER"),
        $.__buffer_body,
        $._terminator,
      ),
    ),

  __buffer_body: ($) =>
    seq(
      field("name", $.identifier),
      kw("FOR"),
      optional(field("for", kw("TEMP-TABLE"))),
      field("table", $._identifier_or_qualified_name),
      repeat(
        choice(
          alias(kw("PRESELECT"), $.preselect),
          seq(kw("LABEL"), field("label", choice($.identifier, $.string_literal))),
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
  __buffer_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
      seq(
        alias(kw("PRIVATE"), $.access_modifier),
        alias(kw("STATIC"), $.static_modifier),
      ),
      seq(
        alias(kw("PROTECTED"), $.access_modifier),
        alias(kw("STATIC"), $.static_modifier),
      ),
      seq(
        alias(kw("STATIC"), $.static_modifier),
        alias(kw("PRIVATE"), $.access_modifier),
      ),
      seq(
        alias(kw("STATIC"), $.static_modifier),
        alias(kw("PROTECTED"), $.access_modifier),
      ),
    ),
});
