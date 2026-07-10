module.exports = ({ kw }) => ({
  record_phrase: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional(alias($.__record_field_list, $.field_list)),
      optional($.preprocessor_name),
      repeat($.__record_option),
    ),

  __record_option: ($) =>
    choice(
      seq(optional(kw("LEFT")), kw("OUTER-JOIN")),
      seq(kw("OF"), field("of", $._identifier_or_qualified_name)),
      prec.right(seq(kw("WHERE"), field("where", optional($._expression)))),
      seq(
        kw("TENANT-WHERE"),
        field("tenant_where", $._expression),
        optional(alias(kw("SKIP-GROUP-DUPLICATES"), $.skip_group_duplicates)),
      ),
      choice(
        seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
        alias(kw("TABLE-SCAN"), $.table_scan),
      ),
      $.__record_using_phrase,
      $._lock_option,
      alias(kw("NO-PREFETCH"), $.no_prefetch),
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
    choice(seq($.__record_fields_list, optional($.__record_except_list)), $.__record_except_list),
  __record_fields_list: ($) => seq(kw("FIELDS"), "(", optional($.__record_field_names), ")"),
  __record_except_list: ($) => seq(kw("EXCEPT"), "(", optional($.__record_field_names), ")"),
  __record_field_names: ($) =>
    seq(
      $._identifier_or_qualified_name,
      repeat(seq(optional(","), $._identifier_or_qualified_name)),
    ),
});
