module.exports = ({ kw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),

  __create_body: ($) =>
    choice(
      seq(kw("SERVER"), field("server", $.identifier)),
      seq(
        field("table", $.__create_record_name),
        optional(seq(kw("FOR"), kw("TENANT"), field("tenant", $._expression))),
        optional(
          seq(
            kw("USING"),
            choice(
              seq(kw("ROWID"), "(", field("rowid", $._expression), ")"),
              seq(kw("RECID"), "(", field("recid", $._expression), ")"),
            ),
          ),
        ),
        optional(kw("NO-ERROR")),
      ),
    ),
  __create_record_name: ($) => $._identifier_or_qualified_name,
});
