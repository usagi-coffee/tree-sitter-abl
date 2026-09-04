export default ({ kw }) => ({
  dataset_definition: ($) => seq($.__dataset_prefix, $._terminator),

  __dataset_prefix: ($) =>
    seq($._define_keyword, optional($.__dataset_modifier), $._dataset_keyword, $._dataset_body),

  __dataset_data_relation: ($) =>
    seq(
      kw("DATA-RELATION"),
      $.__dataset_relation_head,
      optional(
        choice(
          seq($.__dataset_relation_fields, optional($.__dataset_relation_qualifiers)),
          seq($.__dataset_relation_qualifiers, optional($.__dataset_relation_fields)),
        ),
      ),
    ),
  __dataset_relation_fields: ($) =>
    seq(
      kw("RELATION-FIELDS"),
      "(",
      $.__dataset_relation_field_pair,
      optional($.__dataset_relation_field_pair_tail),
      ")",
    ),
  __dataset_relation_qualifiers: ($) =>
    choice(
      seq(
        alias(kw("REPOSITION"), $.reposition),
        optional($.__dataset_data_relation_after_reposition),
      ),
      $.__dataset_data_relation_after_reposition,
    ),
  __dataset_relation_field_pair: ($) =>
    seq(field("parent_field", $.identifier), ",", field("child_field", $.identifier)),
  __dataset_relation_field_pair_tail: ($) =>
    seq(",", $.__dataset_relation_field_pair, optional($.__dataset_relation_field_pair_tail)),
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
      optional($.__dataset_parent_fields_before_phrase),
      optional($.__dataset_parent_fields_after_phrase),
    ),
  __dataset_relation_head: ($) =>
    seq(
      optional(field("relation_name", $.identifier)),
      $._for_keyword,
      field("parent_buffer", $.identifier),
      ",",
      field("child_buffer", $.identifier),
    ),
  __dataset_parent_fields_before_phrase: ($) =>
    seq(
      kw("PARENT-FIELDS-BEFORE"),
      "(",
      field("before_field", $.identifier),
      optional($.__dataset_parent_fields_before_tail),
      ")",
    ),
  __dataset_parent_fields_before_tail: ($) =>
    seq(",", field("before_field", $.identifier), optional($.__dataset_parent_fields_before_tail)),
  __dataset_parent_fields_after_phrase: ($) =>
    seq(
      kw("PARENT-FIELDS-AFTER"),
      "(",
      field("after_field", $.identifier),
      optional($.__dataset_parent_fields_after_tail),
      ")",
    ),
  __dataset_parent_fields_after_tail: ($) =>
    seq(",", field("after_field", $.identifier), optional($.__dataset_parent_fields_after_tail)),
  __dataset_modifier: ($) =>
    choice(
      seq(alias($._new_keyword, $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      seq(
        choice(alias(kw("PRIVATE"), $.access_modifier), alias(kw("PROTECTED"), $.access_modifier)),
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($._serialization_modifier),
      ),
      $._serialization_modifier,
    ),
});
