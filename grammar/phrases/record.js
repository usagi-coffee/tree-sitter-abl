export default ({ kw }) => ({
  record_phrase: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional($.__record_field_list_preprocessor_tail),
      repeat($.__record_option),
    ),
  __record_field_list_preprocessor_tail: ($) =>
    choice(
      seq(alias($.__record_field_list, $.field_list), optional($.preprocessor_name)),
      $.preprocessor_name,
    ),

  // OUTER-JOIN is deliberately absent here. It is legal only inside OPEN
  // QUERY -- anywhere else the compiler answers "JOIN can only be used in
  // OPEN QUERY (2833)" -- and this phrase is shared with FOR and with DO
  // PRESELECT, which would then accept what the compiler rejects. The OPEN
  // QUERY statement carries its own record phrase and takes it there.
  __record_option: ($) =>
    choice(
      seq(kw("OF"), field("of", $._identifier_or_qualified_name)),
      prec.right(seq(kw("WHERE"), field("where", optional($._expression)))),
      seq(
        kw("TENANT-WHERE"),
        field("tenant_where", $._expression),
        optional(alias(kw("SKIP-GROUP-DUPLICATES"), $.skip_group_duplicates)),
      ),
      seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
      alias(kw("TABLE-SCAN"), $.table_scan),
      seq(
        kw("USING"),
        field("field", $.__record_using_field),
        repeat(seq(kw("AND"), field("field", $.__record_using_field))),
      ),
      $._lock_option,
      // SHARE and EXCLUSIVE are the abbreviated lock keywords, spelled the same
      // way the FIND statement already accepts them.
      alias(kw("SHARE"), $.share),
      alias(kw("EXCLUSIVE"), $.exclusive),
      alias(kw("NO-PREFETCH"), $.no_prefetch),
    ),

  __record_using_field: ($) =>
    seq(
      optional(seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier))),
      field("field", $._identifier_or_qualified_name),
    ),

  __record_field_list: ($) =>
    choice(
      seq(
        seq(kw("FIELDS", { alias: "FIELD", offset: 5 }), $.__record_parenthesized_field_names),
        optional($.__record_except_list),
      ),
      $.__record_except_list,
    ),
  __record_except_list: ($) => seq(kw("EXCEPT"), $.__record_parenthesized_field_names),
  __record_parenthesized_field_names: ($) => seq("(", optional($.__record_field_names), ")"),
  __record_field_names: ($) =>
    seq($.__record_field_name, repeat(seq(optional(","), $.__record_field_name))),
  __record_field_name: ($) =>
    seq($._identifier_or_qualified_name, optional(seq("[", field("index", $._expression), "]"))),
});
