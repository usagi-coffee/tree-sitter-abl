module.exports = ({ kw, tkw }) => ({
  using_statement: ($) =>
    seq(
      kw("USING"),
      $.__using_type_ref,
      repeat(seq(",", $.__using_type_ref)),
      optional(alias($.__using_from_clause, $.from_clause)),
      $._terminator,
    ),

  __using_type_ref: ($) =>
    prec.right(
      seq(
        $.__using_base_name,
        optional(seq("<", $.__using_type_ref, ">")),
      ),
    ),

  __using_base_name: ($) =>
    token(
      seq(
        /[_\p{L}][\p{L}\p{N}_-]*/u,
        repeat(
          choice(
            seq(".", /[_\p{L}][\p{L}\p{N}_-]*/u),
            seq("+", /[_\p{L}][\p{L}\p{N}_-]*/u),
          ),
        ),
        optional(seq(".", "*")),
      ),
    ),

  __using_from_clause: ($) =>
    choice(
      seq(kw("FROM"), tkw("ASSEMBLY")),
      seq(kw("FROM"), tkw("PROPATH")),
    ),
});
