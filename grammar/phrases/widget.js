module.exports = ({ kw }) => ({
  __widget_keywords: ($) =>
    choice(kw("FRAME"), kw("MENU"), kw("MENU-ITEM"), kw("QUERY")),

  widget_phrase: ($) =>
    choice(
      seq(kw("FRAME"), field("frame", $.identifier)),
      field("widget", $.identifier),
    ),
});
