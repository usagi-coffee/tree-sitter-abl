export default ({ kw }) => ({
  in_window_phrase: ($) => seq($._in_keyword, $._kw_window, field("window", $._window_handle)),
});
