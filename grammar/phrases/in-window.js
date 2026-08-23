export default ({ kw }) => ({
  in_window_phrase: ($) => seq($._in_keyword, kw("WINDOW"), field("window", $._window_handle)),
});
