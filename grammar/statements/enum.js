module.exports = ({ kw, tkw }) => ({
  enum_statement: ($) =>
    seq(
      kw("ENUM"),
      field("name", $.identifier),
      optional(token(prec(1, /FLAGS/i))),
      $._colon,
      $.enum_body,
      tkw("END"),
      token(/ENUM/i),
      $._terminator,
    ),

  enum_body: ($) =>
    seq(kw("DEFINE"), kw("ENUM"), $.enum_member, repeat($.enum_member), "."),

  enum_member: ($) =>
    seq(field("name", $.identifier), optional(seq("=", $.enum_member_value))),

  enum_member_value: ($) =>
    choice($.number_literal, $.identifier, $.enum_member_value_list),

  enum_member_value_list: ($) =>
    seq($.identifier, repeat1(seq(",", $.identifier))),
});
