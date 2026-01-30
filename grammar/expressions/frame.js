module.exports = ({ kw, tkw }) => ({
  frame_expression: ($) =>
    seq(
      kw("FRAME"),
      field("frame", $.identifier),
      ":",
      field("attribute", $.identifier),
    ),
});
