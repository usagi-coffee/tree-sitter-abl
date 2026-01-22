module.exports = ({ tkw }) => ({
  function_call: ($) =>
    seq(
      field(
        "function",
        choice($.identifier, $.qualified_name, $.object_access, $.scoped_name),
      ),
      $.argument_list,
    ),

  argument_list: ($) =>
    seq("(", optional(seq($.argument, repeat(seq(",", $.argument)))), ")"),

  argument: ($) =>
    seq(
      optional(choice(tkw("INPUT"), tkw("OUTPUT"), tkw("INPUT-OUTPUT"))),
      optional(tkw("TABLE")),
      field("value", $._expression),
      optional(tkw("BY-REFERENCE")),
    ),
});
