module.exports = ({ kw }) => ({
  locked_expression: ($) => seq(kw("LOCKED"), $.__locked_body),

  __locked_body: ($) =>
    seq(
      field(
        "record",
        choice($.__locked_record_name, seq("(", $.__locked_record_name, ")")),
      ),
    ),

  __locked_record_name: ($) => choice($.identifier, $.qualified_name),
});
