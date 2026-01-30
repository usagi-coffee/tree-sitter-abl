module.exports = ({ kw, tkw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),
  __create_body: ($) =>
    choice(
      seq(
        kw("WINDOW"),
        field("window", $.identifier),
      ),
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
  __create_record_name: ($) => choice($.identifier, $.qualified_name),
});
