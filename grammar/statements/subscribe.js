module.exports = ({ kw }) => ({
  subscribe_statement: ($) =>
    seq(kw("SUBSCRIBE"), $.__subscribe_body, $._terminator),

  __subscribe_body: ($) =>
    seq(
      optional(
        seq(
          kw("PROCEDURE", { offset: 4 }),
          field("subscriber", $.__subscribe_expression),
        ),
      ),
      optional(kw("TO")),
      field("event", $.__subscribe_expression),
      choice(
        seq(kw("IN"), field("publisher", $.__subscribe_expression)),
        alias(kw("ANYWHERE"), $.anywhere),
      ),
      optional(
        seq(kw("RUN-PROCEDURE"), field("procedure", $.__subscribe_expression)),
      ),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
  __subscribe_expression: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_qualified_name,
      $.object_access,
      $.function_call,
    ),
});
