module.exports = ({ kw, tkw }) => ({
  in_frame_expression: ($) =>
    seq(
      field("value", $.__in_frame_target),
      kw("IN"),
      tkw("FRAME"),
      field("frame", $.identifier),
    ),
  __in_frame_target: ($) =>
    choice(
      $.identifier,
      $.qualified_name,
      $.object_access,
      $.array_access,
      $.scoped_name,
    ),
});
