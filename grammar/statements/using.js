module.exports = ({ kw }) => ({
  using_statement: ($) => seq(kw("USING"), $.__using_body, $._terminator),

  __using_body: ($) => seq($._using_item, repeat(seq(",", $._using_item))),

  _using_item: ($) =>
    token(/[_\p{L}][\p{L}\p{N}_-]*(\.[_\p{L}][\p{L}\p{N}_-]*)*(\.\*)?/u),
});
