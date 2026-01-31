module.exports = ({ kw, tkw }) => ({
  __widget_keywords: ($) =>
    choice(tkw("FRAME"), tkw("MENU"), tkw("MENU-ITEM"), tkw("QUERY")),
  widget_phrase: ($) =>
    choice(
      seq(kw("FRAME"), field("frame", $.identifier)),
      field("widget", $.identifier),
    ),
});
