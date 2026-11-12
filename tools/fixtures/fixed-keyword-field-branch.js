export default ({ kw }) => ({
  create_statement: ($) => seq($._kw_create, $.__create_body, $._terminator),
  __create_body: ($) =>
    choice(
      seq(choice($.__create_alias, $.__create_buffer), optional($.__no_error)),
      $.__create_server,
    ),
  __create_alias: ($) =>
    seq(
      $._kw_alias,
      field("alias", $._alias_name),
      $._kw_for,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("DATABASE"),
      field("database", $._alias_name),
    ),
});
