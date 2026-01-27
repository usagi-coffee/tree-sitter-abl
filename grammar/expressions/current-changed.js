module.exports = ({ tkw }) => ({
  current_changed_expression: ($) =>
    seq(
      tkw("CURRENT-CHANGED"),
      field(
        "record",
        choice(
          $.__current_changed_record_name,
          seq("(", $.__current_changed_record_name, ")"),
        ),
      ),
    ),

  __current_changed_record_name: ($) => choice($.identifier, $.qualified_name),
});
