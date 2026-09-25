export default ({ kw }) => ({
  using_statement: ($) => seq($.__using_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-alias-sequence
  __using_prefix: ($) =>
    seq($._kw_using, $.__using_type_refs, optional(alias($.__using_from_clause, $.from_clause))),

  // oxlint-disable-next-line tree-sitter-optimize/shared-recursion
  __using_type_refs: ($) =>
    prec.right(seq($.__using_type_ref, optional(seq(",", $.__using_type_refs)))),

  __using_type_ref: ($) =>
    choice(
      prec.right(seq($.__using_base_name, optional(seq("<", $.__using_type_arguments, ">")))),
      $.string_literal,
    ),

  __using_base_name: ($) =>
    token(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        /[_\p{L}][\p{L}\p{N}_-]*/i,
        // oxlint-disable-next-line tree-sitter-optimize/recurse
        repeat(seq(choice(".", "+"), /[_\p{L}][\p{L}\p{N}_-]*/i)),
        optional(seq(".", "*")),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-recursion
  __using_type_arguments: ($) =>
    prec.right(seq($.__using_type_ref, optional(seq(",", $.__using_type_arguments)))),

  __using_from_clause: ($) => seq($._kw_from, choice(kw("ASSEMBLY"), $._kw_propath)),
});
