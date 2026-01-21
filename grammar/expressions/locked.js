module.exports = () => ({
  locked_expression: ($) =>
    seq(
      token(/LOCKED/i),
      field(
        "record",
        choice(
          $.__locked_record_name,
          seq("(", $.__locked_record_name, ")"),
        ),
      ),
    ),

  __locked_record_name: ($) => choice($.identifier, $.qualified_name),
});
