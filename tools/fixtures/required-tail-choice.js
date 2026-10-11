export default grammar({
  name: "fixture",
  rules: {
    __display_stream_frame_tail: ($) =>
      choice(
        seq(alias(kw("UNLESS-HIDDEN"), $.unless_hidden), $.__display_window_frame_phrases),
        $.__display_window_frame_phrases,
      ),
    __display_window_frame_phrases: ($) =>
      choice(seq($.in_window_phrase, $._frame_phrases), $._frame_phrases),
  },
});
