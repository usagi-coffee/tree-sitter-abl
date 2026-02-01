module.exports = ({ kw }) => ({
  __widget_keywords: ($) =>
    choice(kw("FRAME"), kw("MENU"), kw("MENU-ITEM"), kw("QUERY")),

  widget_access: ($) =>
    seq(
      choice(kw("QUERY"), kw("MENU-ITEM"), kw("MENU"), kw("FRAME")),
      field("query", $.identifier),
      ":",
      field("attribute", $.identifier),
      optional(seq(kw("IN"), kw("MENU"), field("menu", $.identifier))),
    ),
});
