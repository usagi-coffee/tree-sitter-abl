module.exports = ({ kw }) => ({
  in_frame_expression: ($) =>
    seq(
      field("value", $.__in_frame_target),
      kw("IN"),
      kw("FRAME"),
      field("frame", $.identifier),
    ),

  __in_frame_target: ($) =>
    prec(
      -1,
      choice(
        alias($.qualified_name, $.identifier),
        $.identifier,
        $.object_access,
        $.scoped_name,
      ),
    ),
});
