export default ({ kw }) => ({
  of_phrase: ($) => seq($._kw_of, field("record", $._qualified_identifier)),
  record_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("record", $._qualified_identifier),
      optional($.__record_field_list_preprocessor_tail),
      optional($.__record_options),
    ),
  __record_options: ($) => prec.right(seq($.__record_option, optional($.__record_options))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __record_field_list_preprocessor_tail: ($) =>
    choice(
      seq(alias($.__record_field_list, $.field_list), optional($.preprocessor_name)),
      $.preprocessor_name,
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __record_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_of, field("of", $._qualified_identifier)),
      prec.right(seq($._kw_where, field("where", optional($._expression)))),
      seq(
        kw("TENANT-WHERE"),
        field("tenant_where", $._expression),
        optional(alias(kw("SKIP-GROUP-DUPLICATES"), $.skip_group_duplicates)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_use_index, field("index", $._qualified_identifier)),
      alias(kw("TABLE-SCAN"), $.table_scan),
      seq(
        $._using_keyword,
        field("field", $.__record_using_field),
        optional($.__record_using_fields_tail),
      ),
      $._lock_option,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("SHARE"), $.share),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("EXCLUSIVE"), $.exclusive),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-PREFETCH"), $.no_prefetch),
    ),
  __record_using_field: ($) => seq(optional($._frame_identifier_phrase), $._qualified_identifier),
  __record_using_fields_tail: ($) =>
    seq($._kw_and, field("field", $.__record_using_field), optional($.__record_using_fields_tail)),

  __record_field_list: ($) =>
    choice(
      seq(
        seq(
          kw("FIELDS", { alias: "FIELD", offset: 5 }),
          optional(seq($.__record_field_names_prefix, ")")),
        ),
        optional($.__record_except_list),
      ),
      $.__record_except_list,
    ),
  __record_except_list: ($) => seq($._kw_except, $.__record_field_names_prefix, ")"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __record_field_names_prefix: ($) => seq("(", optional($.__record_field_names)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __record_field_names: ($) =>
    seq(
      seq($._qualified_identifier, optional(seq($._index_prefix, "]"))),
      optional($.__record_field_name_tail),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence, tree-sitter-optimize/recursive-continuation-inline
  __record_field_name_tail: ($) => seq(optional(","), $.__record_field_names),
});
