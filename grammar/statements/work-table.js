module.exports = ({ kw, tkw }) => ({
  work_table_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("WORK-TABLE"),
      field("name", $.identifier),
      optional(alias($.__temp_table_like_phrase, $.like_phrase)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      repeat(
        choice(
          alias($.__temp_table_field, $.work_table_field),
          alias($.__temp_table_index, $.work_table_index),
        ),
      ),
      $._terminator,
    ),
});
