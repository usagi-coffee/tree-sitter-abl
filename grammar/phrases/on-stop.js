export default ({ kw }) => ({
  on_stop_phrase: ($) =>
    seq(
      $._kw_on,
      $._kw_stop,
      $._kw_undo,
      optional(field("undo_label", alias($._label_identifier, $.identifier))),
      $._on_action_tail,
    ),
});
