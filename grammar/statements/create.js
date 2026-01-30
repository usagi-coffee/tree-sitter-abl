module.exports = ({ kw, tkw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),

  __create_body: ($) =>
    choice(
      seq(
        kw("WINDOW"),
        field("window", $.identifier),
        optional($.__create_window_assign),
      ),
      seq(kw("SERVER"), field("server", $.identifier)),
      seq(
        field("table", $.__create_record_name),
        optional(seq(kw("FOR"), kw("TENANT"), field("tenant", $._expression))),
        optional(
          seq(
            tkw("USING"),
            choice(
              seq(tkw("ROWID"), "(", field("rowid", $._expression), ")"),
              seq(tkw("RECID"), "(", field("recid", $._expression), ")"),
            ),
          ),
        ),
        optional(tkw("NO-ERROR")),
      ),
    ),
  __create_window_assign: ($) =>
    seq(tkw("ASSIGN"), repeat1($.__create_window_assignment)),
  __create_window_assignment: ($) =>
    seq(field("attribute", $.identifier), "=", field("value", $._expression)),
  __create_record_name: ($) => choice($.identifier, $.qualified_name),
});
