module.exports = ({ tkw }) => ({
  overlay_statement: ($) =>
    seq(
      tkw("OVERLAY"),
      "(",
      field("target", $._expression),
      ",",
      field("position", $._expression),
      optional(seq(",", field("length", $._expression))),
      optional(
        seq(
          ",",
          field(
            "type",
            choice(
              alias(tkw("CHARACTER"), $.CHARACTER),
              alias(tkw("RAW"), $.RAW),
              alias(tkw("COLUMN"), $.COLUMN),
            ),
          ),
        ),
      ),
      ")",
      "=",
      field("value", $._expression),
      $._terminator,
    ),
});
