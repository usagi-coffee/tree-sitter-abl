module.exports = ({ kw, tkw }) => ({
  dataset_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__dataset_shared_scope, $.shared_variable_scope),
          seq(
            optional(alias($.__dataset_access_modifier, $.access_modifier)),
            optional(alias($.__dataset_static_modifier, $.static_modifier)),
            optional(alias($.__dataset_serialization_modifier, $.serialization_modifier)),
          ),
        ),
      ),
      kw("DATASET"),
      $.__dataset_body,
      $._terminator,
    ),

  __dataset_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(seq(kw("NAMESPACE-URI"), field("namespace_uri", $._expression))),
      optional(seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $._expression))),
      optional(seq(kw("XML-NODE-NAME"), field("xml_node_name", $._expression))),
      optional(seq(kw("SERIALIZE-NAME"), field("serialize_name", $._expression))),
      optional(seq(kw("XML-NODE-TYPE"), field("xml_node_type", $._expression))),
      optional(tkw("SERIALIZE-HIDDEN")),
      optional(tkw("REFERENCE-ONLY")),
      optional(
        seq(
          kw("FOR"),
          field("table", $.identifier),
          repeat(seq(",", field("table", $.identifier))),
        ),
      ),
      repeat(alias($.__dataset_data_relation, $.data_relation)),
      repeat(alias($.__dataset_parent_id_relation, $.parent_id_relation)),
    ),

  __dataset_shared_scope: ($) =>
    choice(
      seq(kw("NEW"), kw("SHARED")),
      kw("SHARED"),
    ),
  __dataset_access_modifier: ($) =>
    choice(kw("PRIVATE"), kw("PROTECTED")),
  __dataset_static_modifier: ($) => kw("STATIC"),
  __dataset_serialization_modifier: ($) =>
    choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),

  __dataset_data_relation: ($) =>
    seq(
      kw("DATA-RELATION"),
      optional(field("relation_name", $.identifier)),
      kw("FOR"),
      field("parent_buffer", $.identifier),
      ",",
      field("child_buffer", $.identifier),
      seq(
        kw("RELATION-FIELDS"),
        "(",
        field("parent_field", $.identifier),
        ",",
        field("child_field", $.identifier),
        repeat(seq(",", field("parent_field", $.identifier), ",", field("child_field", $.identifier))),
        ")",
      ),
      optional(tkw("REPOSITION")),
      optional(seq(tkw("NESTED"), optional(tkw("FOREIGN-KEY-HIDDEN")))),
      optional(tkw("NOT-ACTIVE")),
      optional(tkw("RECURSIVE")),
    ),

  __dataset_parent_id_relation: ($) =>
    seq(
      kw("PARENT-ID-RELATION"),
      optional(field("relation_name", $.identifier)),
      kw("FOR"),
      field("parent_buffer", $.identifier),
      ",",
      field("child_buffer", $.identifier),
      seq(kw("PARENT-ID-FIELD"), field("parent_id_field", $.identifier)),
      optional(
        seq(
          kw("PARENT-FIELDS-BEFORE"),
          "(",
          field("before_field", $.identifier),
          repeat(seq(",", field("before_field", $.identifier))),
          ")",
        ),
      ),
      optional(
        seq(
          kw("PARENT-FIELDS-AFTER"),
          "(",
          field("after_field", $.identifier),
          repeat(seq(",", field("after_field", $.identifier))),
          ")",
        ),
      ),
    ),
});
