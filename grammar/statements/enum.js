export default ({ kw }) => ({
  enum_statement: ($) => seq($.__enum_prefix, $._terminator),

  __enum_prefix: ($) =>
    seq(
      kw("ENUM"),
      field("name", $._type_name),
      optional(alias(kw("FLAGS"), $.flags)),
      alias($._colon, ":"),
      repeat(
        seq(
          $._define_keyword,
          kw("ENUM"),
          repeat1(alias($.__enum_member, $.member)),
          $._terminator,
        ),
      ),
      kw("END"),
      kw("ENUM"),
    ),

  __enum_member: ($) => seq(field("name", $.identifier), optional(seq("=", $.__enum_member_value))),

  __enum_member_value: ($) =>
    choice($.number_literal, seq($.identifier, repeat(seq(",", $.identifier))), $.null_literal),
});
