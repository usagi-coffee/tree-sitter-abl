module.exports = ({ kw }) => ({
  record_phrase: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional(alias($.__record_field_list, $.field_list)),
      optional(field("constant", $.constant_expression)),
      repeat($.__record_option),
    ),

  __record_option: ($) =>
    choice(
      $.__record_outer_join,
      seq(kw("OF"), field("of", $._identifier_or_qualified_name)),
      seq(kw("WHERE"), field("where", $._expression)),
      seq(
        kw("TENANT-WHERE"),
        field("tenant_where", $._expression),
        optional(kw("SKIP-GROUP-DUPLICATES")),
      ),
      $.__record_use_index,
      $.__record_using_phrase,
      choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
      kw("NO-PREFETCH"),
    ),

  __record_outer_join: ($) =>
    seq(optional(kw("LEFT")), kw("OUTER-JOIN")),
  __record_use_index: ($) =>
    choice(
      seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
      kw("TABLE-SCAN"),
    ),
  __record_using_phrase: ($) =>
    seq(
      kw("USING"),
      field("field", $.__record_using_field),
      repeat(seq(kw("AND"), field("field", $.__record_using_field))),
    ),
  __record_using_field: ($) =>
    seq(
      optional(seq(kw("FRAME"), field("frame", $.identifier))),
      field("field", $._identifier_or_qualified_name),
    ),

  __record_field_list: ($) =>
    choice(
      seq($.__record_fields_list, optional($.__record_except_list)),
      $.__record_except_list,
    ),
  __record_fields_list: ($) =>
    seq(kw("FIELDS"), "(", optional($.__record_field_names), ")"),
  __record_except_list: ($) =>
    seq(kw("EXCEPT"), "(", optional($.__record_field_names), ")"),
  __record_field_names: ($) =>
    seq($.__record_field_name, repeat(seq(optional(","), $.__record_field_name))),
  __record_field_name: ($) => $._identifier_or_qualified_name,
});
