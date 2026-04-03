module.exports = ({ kw }) => ({
  run_statement: ($) => seq(kw("RUN"), $.__run_body, $._no_error_terminator),

  __run_body: ($) =>
    seq(
      field("procedure", $._run_target),
      optional(
        choice(
          alias(seq(kw("PERSISTENT"), optional($.__run_persistence_set_tail)), $.persistent),
          alias(seq(kw("SINGLE-RUN"), optional($.__run_persistence_set_tail)), $.single_run),
          alias(seq(kw("SINGLETON"), optional($.__run_persistence_set_tail)), $.singleton),
        ),
      ),
      optional(alias($.__run_in_phrase, $.in_phrase)),
      optional(alias($.__run_on_server, $.on_server_phrase)),
      optional(alias($.__run_asynchronous, $.asynchronous_phrase)),
      optional($.arguments),
    ),
  __run_persistence_set_tail: ($) => seq(kw("SET"), field("handle", $.identifier)),

  _run_target: ($) =>
    choice(
      alias($._value_expression, $.value_expression),
      alias($.__run_library_member, $.library_member),
      $.procedure_name,
      $.identifier,
      $.qualified_name,
    ),
  __run_library_member: ($) =>
    seq(
      field("library", $.procedure_name),
      token.immediate("<<"),
      field("member", $.__run_member_name),
      ">>",
    ),
  __run_member_name: ($) => token(/[A-Za-z0-9_\\/.-]+\.r/i),

  __run_in_phrase: ($) => seq(kw("IN"), field("context", $.__run_context_value)),
  __run_on_server: ($) => seq(kw("ON"), kw("SERVER"), field("server", $._expression)),

  __run_asynchronous: ($) =>
    seq(
      kw("ASYNCHRONOUS"),
      optional(seq(kw("SET"), field("handle", $.identifier))),
      optional(
        choice(
          seq(kw("EVENT-PROCEDURE"), $.__run_event_procedure_tail),
          seq(kw("EVENT-HANDLER"), $.__run_event_handler_tail),
        ),
      ),
    ),
  __run_event_procedure_tail: ($) =>
    seq(
      field("event_procedure", $._expression),
      optional(seq(kw("IN"), field("context", $.__run_context_value))),
    ),
  __run_event_handler_tail: ($) =>
    seq(
      field("event_handler", $._expression),
      optional(seq(kw("EVENT-HANDLER-CONTEXT"), field("context", $.__run_context_value))),
    ),

  __run_context_value: ($) =>
    choice(
      alias(kw("THIS-PROCEDURE"), $.this_procedure),
      alias(kw("THIS-OBJECT"), $.this_object),
      $.object_access,
      $._identifier_or_qualified_name,
    ),
});
