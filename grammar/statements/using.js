export default ({ kw }) => ({
  using_statement: ($) => seq($.__using_prefix, $._terminator),

  __using_prefix: ($) =>
    seq(
      $._using_keyword,
      $.__using_type_refs,
      optional(alias($.__using_from_clause, $.from_clause)),
    ),

  __using_type_refs: ($) =>
    prec.right(seq($.__using_type_ref, optional(seq(",", $.__using_type_refs)))),

  __using_type_ref: ($) =>
    choice(
      prec.right(seq($.__using_base_name, optional(seq("<", $.__using_type_arguments, ">")))),
      $.string_literal,
    ),

  __using_base_name: ($) =>
    token(
      seq(
        /[_\p{L}][\p{L}\p{N}_-]*/i,
        // deopt: recurse
        repeat(seq(choice(".", "+"), /[_\p{L}][\p{L}\p{N}_-]*/i)),
        optional(seq(".", "*")),
      ),
    ),

  __using_type_arguments: ($) =>
    prec.right(seq($.__using_type_ref, optional(seq(",", $.__using_type_arguments)))),

  __using_from_clause: ($) => seq(kw("FROM"), choice(kw("ASSEMBLY"), kw("PROPATH"))),
});
