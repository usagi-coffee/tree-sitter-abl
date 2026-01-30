module.exports = ({ kw, tkw }) => ({
  enum_statement: ($) => seq(kw("ENUM"), $.__enum_body, $._terminator),

  __enum_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(tkw("FLAGS")),
      $._colon,
      repeat(
        seq(
          kw("DEFINE"),
          tkw("ENUM"),
          alias($.__enum_member, $.member),
          repeat(alias($.__enum_member, $.member)),
          $._terminator,
        ),
      ),
      tkw("END"),
      tkw("ENUM"),
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
