export default ({ kw }) => ({
  format_phrase: ($) => $.__format_options,
  __format_options: ($) => prec.right(seq($.__format_option, optional($.__format_options))),
  __format_option: ($) =>
    choice(
      $.__format_at_phrase,
      $._format_field_option,
      $._kw_auto_return,
      $._kw_blank,
      $._kw_deblank,
      $._kw_disable_auto_zap,
      $._kw_no_tab_stop,
    ),
});
