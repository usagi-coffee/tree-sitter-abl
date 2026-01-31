module.exports = ({ kw, tkw }) => ({
  __widget_keywords: ($) =>
    choice(tkw("FRAME"), tkw("MENU"), tkw("MENU-ITEM"), tkw("QUERY")),
  widget_access: ($) =>
    seq(
      choice(tkw("QUERY"), tkw("MENU-ITEM"), tkw("MENU"), tkw("FRAME")),
      $.__widget_access_body,
    ),
  __widget_access_body: ($) =>
    seq(
      field("query", $.identifier),
      ":",
      field("attribute", $.identifier),
      optional(seq(kw("IN"), kw("MENU"), field("menu", $.identifier))),
    ),
});
