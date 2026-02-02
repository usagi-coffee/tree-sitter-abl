module.exports = ({ kw }) => ({
  widget_access: ($) =>
    prec.left(
      seq(
        seq(
          field("query", $.identifier),
          ":",
          field("attribute", $.identifier),
          optional(seq(kw("IN"), kw("MENU"), field("menu", $.identifier))),
        ),
      ),
    ),
});
