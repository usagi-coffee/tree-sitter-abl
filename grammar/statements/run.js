module.exports = ({ kw, tkw }) => ({
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
      optional(tkw("NO-ERROR")),
    ),

  _run_target: ($) => choice($.procedure_name, $.identifier, $.qualified_name),
  __run_persistent: ($) =>
    seq(tkw("PERSISTENT"), optional(seq(kw("SET"), field("handle", $.identifier)))),
  __run_single_run: ($) =>
    seq(tkw("SINGLE-RUN"), optional(seq(kw("SET"), field("handle", $.identifier)))),
  __run_singleton: ($) =>
    seq(tkw("SINGLETON"), optional(seq(kw("SET"), field("handle", $.identifier)))),
  __run_in_phrase: ($) => seq(kw("IN"), field("context", $._expression)),
  __run_on_server: ($) =>
    seq(kw("ON"), kw("SERVER"), field("server", $._expression)),
  __run_asynchronous: ($) =>
    seq(
      tkw("ASYNCHRONOUS"),
      optional(seq(kw("SET"), field("handle", $.identifier))),
      optional(seq(kw("EVENT-HANDLER"), field("event_handler", $._expression))),
      optional(seq(kw("EVENT-HANDLER-CONTEXT"), field("context", $._expression))),
    ),
});
