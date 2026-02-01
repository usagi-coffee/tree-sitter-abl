module.exports = ({ kw }) => ({
  enum_statement: ($) => seq(kw("ENUM"), $.__enum_body, $._terminator),

  __enum_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(kw("FLAGS")),
      $._colon,
      repeat(
        seq(
          kw("DEFINE"),
          kw("ENUM"),
          alias($.__enum_member, $.member),
          repeat(alias($.__enum_member, $.member)),
          $._terminator,
        ),
      ),
      kw("END"),
      kw("ENUM"),
    ),

  __enum_member: ($) =>
    seq(field("name", $.identifier), optional(seq("=", $.__enum_member_value))),

  __enum_member_value: ($) =>
    choice(
      $.number_literal,
      $.identifier,
      $.null_literal,
      $.__enum_member_value_list,
    ),

  __enum_member_value_list: ($) =>
    seq($.identifier, repeat1(seq(",", $.identifier))),
});
