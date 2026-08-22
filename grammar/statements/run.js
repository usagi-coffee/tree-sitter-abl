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
      seq(
        alias($.__run_asynchronous, $.asynchronous_phrase),
        optional(seq($.arguments, optional($.__run_surplus_tail))),
      ),
      seq($.arguments, optional($.__run_surplus_tail)),
    ),
  // RUN tolerates what no other statement does: `RUN pr (1,2,3)).` and
  // `RUN pr (1,2,3) (4).` both compile, and so does a second surplus closing
  // parenthesis. A surplus *opening* one is refused -- error 247 -- and so is
  // the same surplus in an ordinary expression, which is why this stays inside
  // RUN rather than moving to the argument list itself.
  //
  // Aligned on the compiler by decision. Bounded to these two shapes rather
  // than to any trailing token: `RUN p.ip (OUTPUT r) name.` is also accepted by
  // the compiler, but only as a name it then fails to resolve, and reading a
  // bare trailing name here would swallow whatever follows.
  __run_surplus_tail: ($) => repeat1(choice($.arguments, ")")),
  __run_persistence: ($) =>
    choice(
      alias(
        seq(kw("PERSISTENT", { offset: 7 }), optional($.__run_persistence_set_tail)),
        $.persistent,
      ),
      alias(seq(kw("SINGLE-RUN"), optional($.__run_persistence_set_tail)), $.single_run),
      alias(seq(kw("SINGLETON"), optional($.__run_persistence_set_tail)), $.singleton),
    ),
  __run_persistence_set_tail: ($) => seq(kw("SET"), field("handle", $.__run_persistence_handle)),
  __run_persistence_handle: ($) =>
    choice(
      $._identifier_or_qualified_name,
      alias($.__run_persistence_handle_element, $.array_access),
    ),
  __run_persistence_handle_element: ($) =>
    seq(field("array", $._identifier_or_qualified_name), "[", field("index", $._expression), "]"),

  _run_target: ($) =>
    choice(
      alias($._value_expression, $.value_expression),
      alias($.__run_library_member, $.library_member),
      $.procedure_name,
      alias($.__run_procedure_path, $.procedure_name),
      $.macro_concatenated_name,
      $.identifier,
      $._routine_name_initial,
      alias($.__operator_routine_name, $.identifier),
      $.qualified_name,
      alias($.__run_handle_method, $.object_access),
    ),
  __run_handle_method: ($) =>
    seq(
      field("left", $.system_handle_identifier),
      $._namecolon,
      field("right", alias($._identifier_immediate, $.identifier)),
    ),
  // A procedure reference given as a path, with the .p or .r extension left
  // implicit: RUN Erp\Model\Vente\ErpTrt. Both separators occur in practice.
  __run_procedure_path: ($) =>
    token(
      /[A-Za-z_][A-Za-z0-9_-]*(?:[/\u005C][A-Za-z_][A-Za-z0-9_-]*)+(?:\.[A-Za-z][A-Za-z0-9]*)?/,
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
      $.dynamic_function_call,
      $.system_handle_identifier,
      $.object_access,
      $.array_access,
      $.parenthesized_expression,
      $._identifier_or_qualified_name,
    ),
});
