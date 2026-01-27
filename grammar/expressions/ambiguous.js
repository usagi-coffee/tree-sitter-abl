module.exports = ({ tkw }) => ({
  ambiguous_expression: ($) =>
    seq(
      tkw("AMBIGUOUS"),
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
