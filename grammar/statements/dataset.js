module.exports = ({ kw }) => ({
  dataset_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("DATASET"),
      $.__dataset_body,
      $._terminator,
    ),

  __dataset_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(
        seq(
          kw("FOR"),
          field("table", $.identifier),
          repeat(seq(",", field("table", $.identifier))),
        ),
      ),
    ),
});
