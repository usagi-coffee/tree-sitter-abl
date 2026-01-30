module.exports = ({ kw }) => ({
  widget_phrase: ($) =>
    choice(
      seq(kw("FRAME"), field("frame", $.identifier)),
      field("widget", $.identifier),
    ),
});
