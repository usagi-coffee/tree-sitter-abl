module.exports = ({ kw }) => ({
  workfile_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("WORKFILE"),
      $.__workfile_body,
      $._terminator,
    ),

  __workfile_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__temp_table_like_phrase, $.like_phrase)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
    ),
});
