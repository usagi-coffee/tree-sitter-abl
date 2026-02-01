module.exports = ({ kw }) => ({
  __widget_keywords: ($) =>
    choice(kw("FRAME"), kw("MENU"), kw("MENU-ITEM"), kw("QUERY")),

  widget_access: ($) =>
    prec(
      1,
      seq(
        choice(kw("QUERY"), kw("MENU-ITEM"), kw("MENU"), kw("FRAME")),
        $.__widget_access_body,
      ),
    ),

  __widget_access_body: ($) =>
    prec.right(
      seq(
        field("query", $.identifier),
        ":",
        field("attribute", $.identifier),
        optional(seq(kw("IN"), kw("MENU"), field("menu", $.identifier))),
      ),
    ),
});
