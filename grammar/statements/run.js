module.exports = ({ kw }) => ({
  run_statement: ($) => seq(kw("RUN"), $.__run_body, $._terminator),

  __run_body: ($) =>
    seq(
      field("procedure", $._run_target),
      optional(
        choice(
          alias($.__run_persistent, $.persistent_option),
          alias($.__run_single_run, $.single_run_option),
          alias($.__run_singleton, $.singleton_option),
        ),
      ),
      optional(alias($.__run_in_phrase, $.in_phrase)),
      optional(alias($.__run_on_server, $.on_server_phrase)),
      optional(alias($.__run_asynchronous, $.asynchronous_phrase)),
      optional($.arguments),
      optional(kw("NO-ERROR")),
    ),

  _run_target: ($) =>
    choice(
      alias($.__run_value_expression, $.value_expression),
      alias($.__run_library_member, $.library_member),
      $.procedure_name,
      $.identifier,
      $.qualified_name,
    ),
  __run_value_expression: ($) => seq(kw("VALUE"), "(", $._expression, ")"),
  __run_library_member: ($) =>
    seq(
      field("library", $.procedure_name),
      token.immediate("<<"),
      field("member", $.__run_member_name),
      ">>",
    ),
  __run_member_name: ($) => token(/[A-Za-z0-9_\\/.-]+\.r/i),
  __run_persistent: ($) =>
    seq(
      kw("PERSISTENT"),
      optional(seq(kw("SET"), field("handle", $.identifier))),
    ),
  __run_single_run: ($) =>
    seq(
      kw("SINGLE-RUN"),
      optional(seq(kw("SET"), field("handle", $.identifier))),
    ),
  __run_singleton: ($) =>
    seq(
      kw("SINGLETON"),
      optional(seq(kw("SET"), field("handle", $.identifier))),
    ),
  __run_in_phrase: ($) => seq(kw("IN"), field("context", $._expression)),
  __run_on_server: ($) =>
    seq(kw("ON"), kw("SERVER"), field("server", $._expression)),
  __run_asynchronous: ($) =>
    seq(
      kw("ASYNCHRONOUS"),
      optional(seq(kw("SET"), field("handle", $.identifier))),
      optional(
        choice(
          seq(
            kw("EVENT-PROCEDURE"),
            field("event_procedure", $._expression),
            optional(seq(kw("IN"), field("context", $.__run_context_value))),
          ),
          seq(
            kw("EVENT-HANDLER"),
            field("event_handler", $._expression),
            optional(
              seq(
                kw("EVENT-HANDLER-CONTEXT"),
                field("context", $.__run_context_value),
              ),
            ),
          ),
        ),
      ),
    ),
  __run_context_value: ($) =>
    choice(
      alias(kw("THIS-PROCEDURE"), $.this_procedure),
      alias(kw("THIS-OBJECT"), $.this_object),
      $.object_access,
      $.qualified_name,
      $.identifier,
    ),
});
