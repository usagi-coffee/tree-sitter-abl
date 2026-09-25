export default ({ kw }) => ({
  enum_statement: ($) => seq($.__enum_prefix, $._terminator),

  __enum_prefix: ($) =>
    seq(
      $._kw_enum,
      field("name", $._type_name),
      optional(alias(kw("FLAGS"), $.flags)),
      alias($._colon, ":"),
      optional($.__enum_definitions),
      $._end_keyword,
      $._kw_enum,
    ),

  __enum_definitions: ($) =>
    prec.right(
      seq(
        seq($._define_keyword, $._kw_enum, $.__enum_members, $._terminator),
        optional($.__enum_definitions),
      ),
    ),

  __enum_member: ($) =>
    seq(
      field("name", $.identifier),
      optional(seq("=", choice($.number_literal, $.__enum_member_value_head, $.null_literal))),
    ),
  __enum_members: ($) =>
    prec.right(seq(alias($.__enum_member, $.member), optional($.__enum_members))),

  __enum_member_value_head: ($) =>
    seq($.identifier, optional(seq(",", $.__enum_member_value_head))),
});
