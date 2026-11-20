export default ({ kw }) => ({
  stream_definition: ($) => seq($.__stream_prefix, $._terminator),

  __stream_prefix: ($) =>
    seq($._kw_define, optional($.__stream_modifier), $._kw_stream, field("name", $.identifier)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __stream_modifier: ($) =>
    choice(
      seq(
        alias($._kw_new, $.new_modifier),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("GLOBAL"), $.scope_modifier),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("SHARED"), $.scope_modifier),
      ),
      $._definition_scope_modifier,
    ),
});
