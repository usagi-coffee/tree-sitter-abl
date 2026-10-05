export default grammar({
  inline: ($) => [$._identifier_or_string_literal],
  rules: {
    _identifier_or_string_literal: ($) => choice($.identifier, $.string_literal),
    _identifier_or_string_literal_value: ($) => $._identifier_or_string_literal,
    create_widget_pool: ($) =>
      seq("CREATE WIDGET-POOL", field("pool", $._identifier_or_string_literal_value)),
    disconnect: ($) => seq("DISCONNECT", field("database", $._identifier_or_string_literal_value)),
  },
});
