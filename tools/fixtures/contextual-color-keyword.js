export const inline = ($) => [$._kw_color];

export default ({ kw }) => ({
  _kw_color: ($) => kw("COLOR"),
  __choose_option: ($) => seq($._kw_color, field("color", $.color_phrase)),
  __message_color: ($) =>
    seq(
      $._kw_color,
      field("color", choice($._kw_normal, $._kw_input, $._kw_messages, $.color_phrase)),
    ),
  __color_prefix: ($) =>
    seq(
      $._kw_color,
      optional(
        seq(optional(choice(alias($._kw_display, $.display), $._kw_prompt)), $.__color_tail),
      ),
    ),
  __frame_color: ($) =>
    seq(
      $._kw_color,
      optional($._kw_display),
      field("color", $.__frame_color_value),
      optional(seq($._kw_prompt, field("prompt_color", $.__frame_color_value))),
    ),
  __put_screen_color_phrase: ($) => seq($._kw_color, field("color", $._expression)),
  __system_dialog_color_body: ($) =>
    seq(
      $._kw_color,
      field("color", $._expression),
      optional(alias($.__system_dialog_update_phrase, $.update_phrase)),
      optional($.in_window_phrase),
    ),
  __put_key_value_color: ($) =>
    seq(choice($._kw_color, $._kw_font), choice(field("number", $._expression), kw("ALL"))),
});
