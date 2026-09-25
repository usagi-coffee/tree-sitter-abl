export default ({ kw }) => ({
  in_window_phrase: ($) => seq($._kw_in, $._kw_window, field("window", $._window_handle)),
});
