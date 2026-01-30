module.exports = ({ kw, tkw }) => ({
  widget_access: ($) =>
    seq(
      choice(kw("QUERY"), kw("MENU-ITEM"), kw("MENU"), kw("FRAME")),
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
