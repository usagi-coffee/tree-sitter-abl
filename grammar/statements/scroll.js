export default ({ kw }) => ({
  scroll_statement: ($) => seq($.__scroll_prefix, $._terminator),
  __scroll_prefix: ($) =>
    seq(
      kw("SCROLL"),
      optional(
        choice(
          seq(
            alias(kw("FROM-CURRENT"), $.from_current),
            optional(choice(seq($.__scroll_direction, optional($.frame_phrase)), $.frame_phrase)),
          ),
          seq($.__scroll_direction, optional($.frame_phrase)),
          $.frame_phrase,
        ),
      ),
    ),
  __scroll_direction: ($) => choice(alias(kw("UP"), $.up), alias(kw("DOWN"), $.down)),
});
