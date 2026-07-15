export default ({ kw }) => ({
  dataset_definition: ($) => seq($.__dataset_prefix, $._terminator),

  __dataset_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__dataset_modifier),
      kw("DATASET"),
      $._dataset_body,
    ),

  __dataset_serializable_option: ($) =>
    choice(
      seq(kw("NAMESPACE-URI"), field("namespace_uri", $._expression)),
      seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $._expression)),
      seq(kw("XML-NODE-NAME"), field("xml_node_name", $._expression)),
      seq(kw("SERIALIZE-NAME"), field("serialize_name", $._expression)),
      seq(kw("XML-NODE-TYPE"), field("xml_node_type", $._expression)),
    ),

  __dataset_data_relation: ($) =>
    seq(
      kw("DATA-RELATION"),
      $.__dataset_relation_head,
      seq(
        kw("RELATION-FIELDS"),
        "(",
        field("parent_field", $.identifier),
        ",",
        field("child_field", $.identifier),
        repeat(
          seq(",", field("parent_field", $.identifier), ",", field("child_field", $.identifier)),
        ),
        ")",
      ),
      optional($.__dataset_data_relation_tail),
    ),
  __dataset_data_relation_tail: ($) =>
    choice(
      seq(
        alias(kw("REPOSITION"), $.reposition),
        optional($.__dataset_data_relation_after_reposition),
      ),
      $.__dataset_data_relation_after_reposition,
    ),
  __dataset_data_relation_after_reposition: ($) =>
    choice(
      seq(
        alias(kw("NESTED"), $.nested),
        optional(
          choice(
            seq(
              alias(kw("FOREIGN-KEY-HIDDEN"), $.foreign_key_hidden),
              optional($.__dataset_not_active_recursive_tail),
            ),
            $.__dataset_not_active_recursive_tail,
          ),
        ),
      ),
      $.__dataset_not_active_recursive_tail,
    ),
  __dataset_not_active_recursive_tail: ($) =>
    choice(
      seq(alias(kw("NOT-ACTIVE"), $.not_active), optional(alias(kw("RECURSIVE"), $.recursive))),
      alias(kw("RECURSIVE"), $.recursive),
    ),

  __dataset_parent_id_relation: ($) =>
    seq(
      kw("PARENT-ID-RELATION"),
      $.__dataset_relation_head,
      seq(kw("PARENT-ID-FIELD"), field("parent_id_field", $.identifier)),
      optional($.__dataset_parent_id_relation_tail),
    ),
  __dataset_relation_head: ($) =>
    seq(
      optional(field("relation_name", $.identifier)),
      kw("FOR"),
      field("parent_buffer", $.identifier),
      ",",
      field("child_buffer", $.identifier),
    ),
  __dataset_parent_id_relation_tail: ($) =>
    choice(
      seq(
        $.__dataset_parent_fields_before_phrase,
        optional($.__dataset_parent_fields_after_phrase),
      ),
      $.__dataset_parent_fields_after_phrase,
    ),
  __dataset_parent_fields_before_phrase: ($) =>
    seq(
      kw("PARENT-FIELDS-BEFORE"),
      "(",
      field("before_field", $.identifier),
      repeat(seq(",", field("before_field", $.identifier))),
      ")",
    ),
  __dataset_parent_fields_after_phrase: ($) =>
    seq(
      kw("PARENT-FIELDS-AFTER"),
      "(",
      field("after_field", $.identifier),
      repeat(seq(",", field("after_field", $.identifier))),
      ")",
    ),
  __dataset_modifier: ($) =>
    choice(
      seq(alias(kw("NEW"), $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      seq(
        choice(alias(kw("PRIVATE"), $.access_modifier), alias(kw("PROTECTED"), $.access_modifier)),
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($._serialization_modifier),
      ),
      $._serialization_modifier,
    ),
});
