module.exports = () => ({
  annotation_statement: ($) =>
    seq(
      "@",
      field("name", $.identifier),
      optional(seq("(", optional($._expression_list), ")")),
      $._terminator,
    ),
});
