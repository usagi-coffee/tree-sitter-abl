// Embedded SQL.
//
// Two sources, because neither covers this alone. The clause shapes come from
// the OpenEdge SQL Reference, which is authoritative for the SQL grammar
// itself. The embedding comes from the compiler: inside an ABL procedure these
// statements carry no `EXEC SQL` prefix and end on the ordinary terminator, and
// SELECT takes an INTO clause naming host variables -- none of which the SQL
// reference describes, since it documents the form used from C.
//
// The ABL reference extract shipped here has no entry for any of it, and
// neither does the ABL reference on the documentation site: both describe
// OPEN QUERY, CLOSE QUERY and RUN STORED-PROCEDURE instead, which are the
// ABL-native ways to reach SQL.
//
// Left out on purpose: TOP, OFFSET ... FETCH, WITH (NOLOCK) and NO REORDER.
// Those are SQL-92 additions in the same reference, and accepting them here
// would widen the grammar past what the embedded form takes.
//
// UPDATE is read here for a reason that is not about SQL coverage at all.
// Without it, `UPDATE t SET c = 1 WHERE k = 2.` parses with no error as the ABL
// UPDATE statement: SET and WHERE become names of screen fields, and
// `c = 1` an assignment to one. The tree is wrong from end to end and nothing
// signals it -- `__update_field` takes `field = expression`, so every token
// finds a home.
//
// A wrong tree is worse than a refusal. A refusal is counted, measured and
// eventually fixed; a wrong tree is handed to a consumer as fact. Any
// measurement built on counting ERROR nodes is blind to the whole class, which
// is why this one was found by reading rather than by parsing.
//
// INSERT and DELETE are absent for the opposite reason: nothing reads them, so
// they fail loudly, and a loud failure needs no rule to make it honest.
export default ({ kw }) => ({
  // `DECLARE cursor_name CURSOR FOR query_expr [ORDER BY] [FOR UPDATE]`
  declare_cursor_statement: ($) => seq(kw("DECLARE"), $.__sql_declare_cursor_body, $._terminator),
  __sql_declare_cursor_body: ($) =>
    seq(
      field("cursor", $.identifier),
      kw("CURSOR"),
      kw("FOR"),
      field("query", alias($.__sql_select_body, $.select)),
      optional($.__sql_cursor_mode),
    ),
  // `FOR READ ONLY` and `FOR UPDATE` close the declaration rather than the
  // query, so they sit here and not inside the select, where they would also be
  // accepted on a bare SELECT.
  //
  // Each spelling is a rule of its own, aliased by reference. Aliasing an inline
  // `seq(...)` instead parses the clause and then drops it: the tokens are
  // consumed, no error is raised, and nothing reaches the tree -- the silent
  // kind of gap, which only a node count catches.
  __sql_cursor_mode: ($) =>
    choice(alias($.__sql_read_only, $.read_only), alias($.__sql_for_update, $.for_update)),
  __sql_read_only: ($) => seq(kw("FOR"), kw("READ"), kw("ONLY")),
  __sql_for_update: ($) =>
    seq(
      kw("FOR"),
      kw("UPDATE"),
      optional(
        seq(
          kw("OF"),
          field("column", $._identifier_or_qualified_name),
          repeat(seq(",", field("column", $._identifier_or_qualified_name))),
        ),
      ),
    ),

  // `OPEN c.` -- distinct from OPEN QUERY, which names its keyword.
  open_cursor_statement: ($) => seq(kw("OPEN"), field("cursor", $.identifier), $._terminator),

  // `FETCH c INTO nm.`
  fetch_statement: ($) => seq(kw("FETCH"), $.__sql_fetch_body, $._terminator),
  __sql_fetch_body: ($) =>
    seq(
      field("cursor", $.identifier),
      kw("INTO"),
      field("target", $._sql_target),
      repeat(seq(",", field("target", $._sql_target))),
    ),

  // `CLOSE c.` -- distinct from CLOSE QUERY and CLOSE STORED-PROCEDURE, both of
  // which name a keyword where this one names a cursor.
  close_cursor_statement: ($) => seq(kw("CLOSE"), field("cursor", $.identifier), $._terminator),

  // `UPDATE t SET c = 1 WHERE k = 2.`
  //
  // Named apart from the ABL `update_statement`, which keeps its own rule and
  // its own name. The two open on the same keyword and part at SET: the ABL one
  // would read that word as a screen field, this one reads it as the keyword it
  // is. Where both could apply the keyword wins, which is the point -- the ABL
  // reading of this text was never right.
  sql_update_statement: ($) => seq(kw("UPDATE"), $.__sql_update_body, $._terminator),
  __sql_update_body: ($) =>
    seq(
      field("table", $._identifier_or_qualified_name),
      kw("SET"),
      alias($.__sql_update_assignment, $.assignment),
      repeat(seq(",", alias($.__sql_update_assignment, $.assignment))),
      optional($.__sql_where_clause),
    ),
  __sql_update_assignment: ($) =>
    seq(field("column", $._identifier_or_qualified_name), "=", field("value", $._expression)),

  select_statement: ($) => seq($.__sql_select_body, $._terminator),

  __sql_select_body: ($) => seq(kw("SELECT"), $.__sql_select_projection, $.__sql_select_from_body),
  __sql_select_projection: ($) =>
    seq(
      optional($.__sql_set_quantifier),
      field("column", $.__sql_select_item),
      repeat(seq(",", field("column", $.__sql_select_item))),
      optional($.__sql_into_clause),
    ),
  __sql_select_from_body: ($) =>
    seq(
      kw("FROM"),
      $.__sql_table_references,
      optional($.__sql_where_clause),
      optional($.__sql_group_by_clause),
      optional($.__sql_having_clause),
      optional($.__sql_order_by_clause),
    ),
  __sql_table_references: ($) =>
    seq(
      field("table", $.__sql_table_reference),
      repeat(seq(",", field("table", $.__sql_table_reference))),
    ),
  __sql_set_quantifier: ($) => choice(alias(kw("ALL"), $.all), alias(kw("DISTINCT"), $.distinct)),

  // `*`, `t.*`, `COUNT(*)`, or an expression with an optional column title. An
  // ordinary call such as `MAX(f)` needs nothing here: `_expression` reads it.
  //
  // Only COUNT is spelled out, and only because it is the one aggregate that
  // takes a star. Writing it as a general `identifier ( * )` does not generate:
  // at the opening parenthesis the parser cannot yet tell it from an ordinary
  // call, and the star settles it one token later. Naming the keyword moves the
  // decision onto a token the lexer already separates.
  __sql_select_item: ($) =>
    choice(
      alias($.__sql_star, $.star),
      alias($.__sql_qualified_star, $.star),
      alias($.__sql_count_star, $.function_call),
      seq($._expression, optional($.__sql_column_title)),
    ),
  __sql_star: ($) => "*",
  __sql_qualified_star: ($) => seq(field("table", $.identifier), ".", "*"),
  __sql_count_star: ($) =>
    seq(field("function", kw("COUNT")), "(", alias($.__sql_star, $.star), ")"),
  __sql_column_title: ($) => seq(optional(kw("AS")), field("title", $._sql_title)),
  _sql_title: ($) => choice($.identifier, $.string_literal),

  __sql_into_clause: ($) =>
    seq(kw("INTO"), field("into", $._sql_target), repeat(seq(",", field("into", $._sql_target)))),

  // A host variable receiving a column value. Kept to the shapes a variable can
  // take, not to `_assignable`, which reaches widget references with no meaning
  // here.
  _sql_target: ($) => choice($._identifier_or_qualified_name, $.array_access),

  __sql_table_reference: ($) =>
    seq(field("name", $._identifier_or_qualified_name), optional(field("alias", $.identifier))),

  __sql_where_clause: ($) => seq(kw("WHERE"), field("condition", $._expression)),
  __sql_group_by_clause: ($) =>
    seq(
      kw("GROUP"),
      kw("BY"),
      field("group", $._identifier_or_qualified_name),
      repeat(seq(",", field("group", $._identifier_or_qualified_name))),
    ),
  __sql_having_clause: ($) => seq(kw("HAVING"), field("condition", $._expression)),
  __sql_order_by_clause: ($) =>
    seq(
      kw("ORDER"),
      kw("BY"),
      alias($.__sql_order_term, $.order_term),
      repeat(seq(",", alias($.__sql_order_term, $.order_term))),
    ),
  // The reference gives the ordering key as an expression or a column position,
  // so a bare integer here is a position and not a literal to compare.
  __sql_order_term: ($) =>
    seq(field("key", $._expression), optional(field("sort_order", choice(kw("ASC"), kw("DESC"))))),
});
