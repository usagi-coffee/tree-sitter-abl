const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  dataset_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__dataset_modifier),
      kw("DATASET"),
      $.__dataset_body,
      $._terminator,
    ),

  __dataset_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(seq(kw("NAMESPACE-URI"), field("namespace_uri", $._expression))),
      optional(
        seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $._expression)),
      ),
      optional(seq(kw("XML-NODE-NAME"), field("xml_node_name", $._expression))),
      optional(
        seq(kw("SERIALIZE-NAME"), field("serialize_name", $._expression)),
      ),
      optional(seq(kw("XML-NODE-TYPE"), field("xml_node_type", $._expression))),
      optional(kw("SERIALIZE-HIDDEN")),
      optional(kw("REFERENCE-ONLY")),
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
        repeat(
          seq(
            ",",
            field("parent_field", $.identifier),
            ",",
            field("child_field", $.identifier),
          ),
        ),
        ")",
      ),
      optional(kw("REPOSITION")),
      optional(seq(kw("NESTED"), optional(kw("FOREIGN-KEY-HIDDEN")))),
      optional(kw("NOT-ACTIVE")),
      optional(kw("RECURSIVE")),
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
  __dataset_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      seq(
        choice(
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
        ),
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($.__dataset_serialization_modifier),
      ),
      $.__dataset_serialization_modifier,
    ),
  __dataset_serialization_modifier: ($) =>
    choice(
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),
});
