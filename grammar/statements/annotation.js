module.exports = () => ({
  annotation: ($) => seq("@", $.__annotation_body, $._terminator),

  __annotation_name: () => token(/[^0-9\s()=,\.][^\s()=,\.]*/),
  __annotation_body: ($) =>
    seq(
      field("name", alias($.__annotation_name, $.identifier)),
      optional(
        seq("(", optional(alias($.__annotation_attributes, $.attributes)), ")"),
      ),
    ),
  __annotation_attributes: ($) =>
    seq(
      alias($.__annotation_attribute, $.attribute),
      repeat(seq(",", alias($.__annotation_attribute, $.attribute))),
    ),
  __annotation_attribute: ($) =>
    seq(
      field("name", alias($.__annotation_name, $.identifier)),
      "=",
      field("value", $.string_literal),
    ),
});
