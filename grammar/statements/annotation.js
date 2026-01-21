module.exports = () => ({
  annotation_statement: ($) =>
    seq(
      "@",
      field("name", $.annotation_name),
      optional(seq("(", optional($.annotation_attribute_list), ")")),
      $._terminator,
    ),
  annotation_attribute_list: ($) =>
    seq($.annotation_attribute, repeat(seq(",", $.annotation_attribute))),
  annotation_attribute: ($) =>
    seq(
      field("name", $.annotation_name),
      "=",
      field("value", $.string_literal),
    ),
  annotation_name: () => token(/[^0-9\s()=,\.][^\s()=,\.]*/),
});
