module.exports = ({ kw }) => ({
  available_expression: ($) =>
    seq(choice(kw("AVAIL"), kw("AVAILABLE")), $.__available_expression_body),

  __available_expression_body: ($) =>
    seq(
      field(
        "record",
        choice(
          $.__available_record_name,
          seq("(", $.__available_record_name, ")"),
        ),
      ),
    ),

  __available_record_name: ($) => choice($.identifier, $.qualified_name),
});
