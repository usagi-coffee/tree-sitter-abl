module.exports = ({ kw, tkw }) => ({
  create_window_statement: ($) =>
    prec.dynamic(
      10,
      seq(
        kw("CREATE"),
        tkw("WINDOW"),
        choice(optional($.assignment_statement), $._terminator),
      ),
    ),
});
