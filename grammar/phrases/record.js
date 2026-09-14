export default ({ kw }) => ({
  record_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("record", $._identifier_or_qualified_name),
      optional($.__record_field_list_preprocessor_tail),
      optional($.__record_options),
    ),
  __record_options: ($) => prec.right(seq($.__record_option, optional($.__record_options))),
  __record_field_list_preprocessor_tail: ($) =>
    choice(
      seq(alias($.__record_field_list, $.field_list), optional($.preprocessor_name)),
      $.preprocessor_name,
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __record_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._of_keyword, field("of", $._identifier_or_qualified_name)),
      prec.right(seq(kw("WHERE"), field("where", optional($._expression)))),
      seq(
        kw("TENANT-WHERE"),
        field("tenant_where", $._expression),
        optional(alias(kw("SKIP-GROUP-DUPLICATES"), $.skip_group_duplicates)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
      alias(kw("TABLE-SCAN"), $.table_scan),
      seq(
        $._using_keyword,
        field("field", $.__record_using_field),
        optional($.__record_using_fields_tail),
      ),
      $._lock_option,
      alias(kw("SHARE"), $.share),
      alias(kw("EXCLUSIVE"), $.exclusive),
      alias(kw("NO-PREFETCH"), $.no_prefetch),
    ),
  __record_using_field: ($) =>
    seq(optional($._frame_identifier_phrase), field("field", $._identifier_or_qualified_name)),
  __record_using_fields_tail: ($) =>
    seq(kw("AND"), field("field", $.__record_using_field), optional($.__record_using_fields_tail)),

  __record_field_list: ($) =>
    choice(
      seq(
        seq(
          kw("FIELDS", { alias: "FIELD", offset: 5 }),
          optional($.__record_parenthesized_field_names),
        ),
        optional($.__record_except_list),
      ),
      $.__record_except_list,
    ),
  __record_except_list: ($) => seq(kw("EXCEPT"), $.__record_parenthesized_field_names),
  __record_parenthesized_field_names: ($) => seq($.__record_field_names_prefix, ")"),
  __record_field_names_prefix: ($) => seq("(", optional($.__record_field_names)),
  __record_field_names: ($) => seq($.__record_field_name, optional($.__record_field_name_tail)),
  __record_field_name_tail: ($) =>
    seq(optional(","), $.__record_field_name, optional($.__record_field_name_tail)),
  __record_field_name: ($) =>
    seq($._identifier_or_qualified_name, optional(seq("[", field("index", $._expression), "]"))),
});
