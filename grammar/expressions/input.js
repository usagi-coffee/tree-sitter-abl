module.exports = ({ kw }) => ({
  input_expression: ($) => seq(kw("INPUT"), $.__input_expression_body),

  __input_expression_body: ($) =>
    prec(
      -1,
      seq(
        optional(seq(kw("FRAME"), field("frame", $.identifier))),
        field(
          "field",
          choice(
            $.identifier,
            $.qualified_name,
            $.object_access,
            $.array_access,
            $.scoped_name,
          ),
        ),
      ),
    ),
});
