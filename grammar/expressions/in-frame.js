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
      alias($.qualified_name, $.identifier),
      $.identifier,
      $.object_access,
      $.scoped_name,
    ),
});
