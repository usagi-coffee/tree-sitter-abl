module.exports = ({ kw }) => ({
  ambiguous_expression: ($) =>
    seq(kw("AMBIGUOUS"), $.__ambiguous_expression_body),

  __ambiguous_expression_body: ($) =>
    seq(
      field(
        "record",
        choice(
          $.__ambiguous_record_name,
          seq("(", $.__ambiguous_record_name, ")"),
        ),
      ),
    ),

  __ambiguous_record_name: ($) => choice($.identifier, $.qualified_name),
});
