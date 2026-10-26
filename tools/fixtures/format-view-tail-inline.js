export default grammar({
  rules: {
    _format_view_as: ($) =>
      prec.right(
        seq(
          kw("VIEW-AS"),
          choice(
            seq($._kw_text, optional($.__format_view_as_tail)),
            seq(kw("TOGGLE-BOX"), optional($.__format_view_as_tail)),
            seq($._kw_fill_in, optional($._kw_native), optional($.__format_view_as_tail)),
          ),
        ),
      ),
    __format_view_as_tail: ($) =>
      prec.right(choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase)),
  },
});
