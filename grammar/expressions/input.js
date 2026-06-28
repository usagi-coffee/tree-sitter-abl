module.exports = ({ kw }) => ({
  input_expression: ($) =>
    seq(
      kw("INPUT"),
      optional(seq(kw("FRAME"), field("frame", $.identifier))),
      field("field", choice($._identifier_or_qualified_name, $.object_access, $.array_access)),
    ),
});
