module.exports = ({ kw }) => ({
  using_statement: ($) => seq(kw("USING"), $.__using_body, $._terminator),

  __using_body: ($) =>
    seq(
      $.__using_type_ref,
      repeat(seq(",", $.__using_type_ref)),
      optional(alias($.__using_from_clause, $.from_clause)),
    ),

  __using_type_ref: ($) =>
    prec.right(
      seq($.__using_base_name, optional(seq("<", $.__using_type_ref, ">"))),
    ),

  __using_base_name: ($) =>
    token(
      seq(
        /[_\p{L}][\p{L}\p{N}_-]*/i,
        repeat(
          choice(
            seq(".", /[_\p{L}][\p{L}\p{N}_-]*/i),
            seq("+", /[_\p{L}][\p{L}\p{N}_-]*/i),
          ),
        ),
        optional(seq(".", "*")),
      ),
    ),

  __using_from_clause: ($) =>
    seq(kw("FROM"), choice(kw("ASSEMBLY"), kw("PROPATH"))),
});
