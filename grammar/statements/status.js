module.exports = ({ kw, tkw }) => ({
  status_statement: ($) => seq(tkw("STATUS"), $.__status_body, $._terminator),

  __status_body: ($) =>
    seq(
      choice(
        seq(kw("DEFAULT"), optional(field("message", $._expression))),
        seq(
          kw("INPUT"),
          optional(choice(tkw("OFF"), field("message", $._expression))),
        ),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
    ),
});
