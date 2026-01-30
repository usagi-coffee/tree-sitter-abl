module.exports = ({ kw, tkw }) => ({
  frame_access: ($) =>
    seq(
      kw("FRAME"),
      field("frame", $.identifier),
      ":",
      field("attribute", $.identifier),
    ),
});
