module.exports = ({ kw }) => ({
  stream_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(alias($.__stream_shared_scope, $.shared_variable_scope)),
      kw("STREAM"),
      field("name", $.identifier),
      $._terminator,
    ),

  __stream_shared_scope: ($) =>
    choice(
      seq(kw("NEW"), kw("GLOBAL"), kw("SHARED")),
      seq(kw("NEW"), kw("SHARED")),
      kw("SHARED"),
      kw("PRIVATE"),
    ),
});
