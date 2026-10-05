export default ({ kw }) => ({
  __frame_option: ($) => choice($.size_phrase, $.__frame_with_identifier),
  __frame_with_identifier: ($) =>
    prec.right(
      seq(
        choice(
          seq(kw("FRAME", { offset: 4 }), field("frame", $._frame_name)),
          seq($._kw_browse, field("browse", $.__frame_identifier)),
        ),
        optional($._kw_with),
      ),
    ),
});
