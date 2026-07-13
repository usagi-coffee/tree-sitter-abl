export default ({ kw }) => ({
  stream_definition: ($) => seq($.__stream_prefix, $._terminator),

  __stream_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__stream_modifier),
      kw("STREAM"),
      field("name", $.identifier),
    ),
  __stream_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        optional(alias(kw("GLOBAL"), $.scope_modifier)),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
