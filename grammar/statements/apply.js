export default ({ kw }) => ({
  apply_statement: ($) => seq($.__apply_prefix, $._terminator),

  __apply_prefix: ($) =>
    seq(
      kw("APPLY"),
      field("event", choice($._events, $.object_access, $.qualified_name, $.array_access)),
      optional(
        seq(
          $._to_keyword,
          field(
            "to",
            alias(
              choice($.widget_phrase, seq($._widgets, optional(field("handle", $.identifier)))),
              $.widget,
            ),
          ),
          optional($.__apply_in_widget),
        ),
      ),
    ),

  __apply_in_widget: ($) =>
    seq(
      $._in_keyword,
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_browse, field("browse", $.identifier)),
        $._frame_identifier_phrase,
        seq(kw("MENU"), field("menu", $.identifier)),
      ),
    ),
});
