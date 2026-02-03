module.exports = ({ kw }) => ({
  in_window_phrase: ($) =>
    seq(kw("IN"), kw("WINDOW"), field("window", $._window_handle)),
});
