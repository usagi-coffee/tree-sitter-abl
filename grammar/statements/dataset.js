module.exports = ({ kw }) => ({
  dataset_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("DATASET"),
      field("name", $.identifier),
      optional(
        seq(
          kw("FOR"),
          field("table", $.identifier),
          repeat(seq(",", field("table", $.identifier))),
        ),
      ),
      $._terminator,
    ),
});
