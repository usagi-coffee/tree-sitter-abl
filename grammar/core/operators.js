// Operators

module.exports = ({ op }) => ({
  assignment_operator: ($) => choice("=", "+=", "-=", "*=", "/="),

  _logical_operator: ($) => choice(op("AND"), op("OR")),

  _comparison_operator: ($) =>
    choice(
      "=",
      "<>",
      ">",
      "<",
      ">=",
      "<=",
      op("BEGINS"),
      op("MATCHES"),
      op("EQ"),
      op("NE"),
      op("GT"),
      op("LT"),
      op("GE"),
      op("LE"),
    ),

  // See _statement_expression in expressions.js - excludes `=` to disambiguate
  // assignment vs equality comparison at statement level.
  _comparison_operator_no_eq: ($) =>
    choice(
      "<>",
      ">",
      "<",
      ">=",
      "<=",
      op("BEGINS"),
      op("MATCHES"),
      op("EQ"),
      op("NE"),
      op("GT"),
      op("LT"),
      op("GE"),
      op("LE"),
    ),
});
