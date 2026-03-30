module.exports = ({ kw }) => ({
  new_expression: ($) =>
    choice(
      // Class constructor: NEW ClassName(args)
      seq(
        kw("NEW"),
        field(
          "type",
          choice($.scoped_name, $._identifier_or_qualified_name, $.string_literal),
        ),
        $.arguments,
      ),
      // Record buffer check: NEW record or NEW(record)
      prec(-1, seq(
        kw("NEW"),
        choice(
          field("record", $._identifier_or_qualified_name),
          seq("(", field("record", $._identifier_or_qualified_name), ")"),
        ),
      )),
    ),
});
