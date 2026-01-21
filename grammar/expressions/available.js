module.exports = ({ tkw }) => ({
  available_expression: ($) =>
    seq(
      choice(tkw("AVAIL"), tkw("AVAILABLE")),
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
