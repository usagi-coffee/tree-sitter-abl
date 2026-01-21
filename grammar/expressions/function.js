module.exports = () => ({
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
      optional(token(/INPUT|OUTPUT|INPUT-OUTPUT/i)),
      optional(token(/TABLE/i)),
      field("value", $._expression),
      optional(token(/BY-REFERENCE/i)),
    ),
});
