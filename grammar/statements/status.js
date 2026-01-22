module.exports = ({ kw, tkw }) => ({
  status_statement: ($) =>
    seq(
      tkw("STATUS"),
      choice(
        seq(kw("DEFAULT"), optional(field("message", $._expression))),
        seq(
          kw("INPUT"),
          optional(choice(tkw("OFF"), field("message", $._expression))),
        ),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
});
