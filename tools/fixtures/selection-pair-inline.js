export default grammar({
  rules: {
    _selection_after_for: ($) =>
      choice(seq($.preselect_phrase, optional($.query_tuning_phrase)), $.query_tuning_phrase),
    __do_body: ($) =>
      choice(
        seq(alias($._for_phrase, $.for_phrase), optional($._selection_after_for), $.__do_body_tail),
        seq($._selection_after_for, $.__do_body_tail),
      ),
    __repeat_prefix: ($) =>
      seq(
        $._kw_repeat,
        optional(alias($._for_phrase, $.for_phrase)),
        optional($._selection_after_for),
        $.__repeat_body,
      ),
  },
});
