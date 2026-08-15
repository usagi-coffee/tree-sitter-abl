export default ({ kw }) => ({
  run_statement: ($) => seq(kw("RUN"), $.__run_body, $._no_error_terminator),

  __run_body: ($) =>
    seq(
      field("procedure", $._run_target),
      optional($.__run_persistence),
      optional($.__run_body_after_persistence),
    ),
  __run_body_after_persistence: ($) =>
    choice(
      seq(alias($.__run_in_phrase, $.in_phrase), optional($.__run_body_after_in)),
      $.__run_body_after_in,
    ),
  __run_body_after_in: ($) =>
    choice(
      seq(alias($.__run_on_server, $.on_server_phrase), optional($.__run_arguments_tail)),
      $.__run_arguments_tail,
    ),
  __run_arguments_tail: ($) =>
    choice(
      seq(alias($.__run_asynchronous, $.asynchronous_phrase), optional($.arguments)),
      $.arguments,
    ),
  __run_persistence: ($) =>
    choice(
      alias(
        seq(kw("PERSISTENT", { offset: 7 }), optional($.__run_persistence_set_tail)),
        $.persistent,
      ),
      alias(seq(kw("SINGLE-RUN"), optional($.__run_persistence_set_tail)), $.single_run),
      alias(seq(kw("SINGLETON"), optional($.__run_persistence_set_tail)), $.singleton),
    ),
  // The handle is often one slot of an array of window handles, as in
  // `RUN winctrl_ml PERSISTENT SET hWindow[1] (...)`. The subscript is
  // spelled out rather than reusing array_access: that one also starts on an
  // object access, and `SET h (...)` would then read as a call.
  __run_persistence_set_tail: ($) => seq(kw("SET"), field("handle", $.__run_persistence_handle)),
  __run_persistence_handle: ($) =>
    choice($.identifier, alias($.__run_persistence_handle_element, $.array_access)),
  __run_persistence_handle_element: ($) =>
    seq(field("array", $.identifier), "[", field("index", $._expression), "]"),

  _run_target: ($) =>
    choice(
      alias($._value_expression, $.value_expression),
      alias($.__run_library_member, $.library_member),
      $.procedure_name,
      alias($.__run_procedure_path, $.procedure_name),
      $.macro_concatenated_name,
      $.identifier,
      $.qualified_name,
    ),
  // A procedure reference given as a path, with the .p or .r extension left
  // implicit: RUN Erp\Model\Vente\ErpTrt. Both separators occur in practice.
  __run_procedure_path: ($) =>
    token(/[A-Za-z_][A-Za-z0-9_-]*(?:[/\u005C][A-Za-z_][A-Za-z0-9_-]*)+/),

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
    seq(kw("ASYNCHRONOUS"), optional($.__run_persistence_set_tail), optional($.__run_event_choice)),
  __run_event_choice: ($) =>
    choice(
      seq(kw("EVENT-PROCEDURE"), $.__run_event_procedure_tail),
      seq(kw("EVENT-HANDLER"), $.__run_event_handler_tail),
    ),
  __run_event_procedure_tail: ($) =>
    seq(field("event_procedure", $._expression), optional($.__run_in_phrase)),
  __run_event_handler_tail: ($) =>
    seq(
      field("event_handler", $._expression),
      optional(seq(kw("EVENT-HANDLER-CONTEXT"), field("context", $.__run_context_value))),
    ),

  __run_context_value: ($) =>
    choice(
      $.system_handle_identifier,
      $.object_access,
      $.array_access,
      $._identifier_or_qualified_name,
    ),
});
