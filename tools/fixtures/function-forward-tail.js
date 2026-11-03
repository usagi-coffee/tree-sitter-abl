export default ({ kw }) => ({
  __function_forward_head: ($) => seq($.__function_signature, optional($.__function_forward_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __function_forward_tail: ($) =>
    choice(
      seq(
        optional($.__function_extent_phrase),
        optional($._routine_access_modifier),
        alias($.__function_parameters, $.parameters),
      ),
      seq(optional($.__function_extent_phrase), $._routine_access_modifier),
      $.__function_extent_phrase,
    ),
});
