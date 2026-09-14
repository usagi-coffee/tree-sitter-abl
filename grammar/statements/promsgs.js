export default ({ kw }) => ({
  promsgs_statement: ($) => seq($.__promsgs_prefix, $._terminator),

  __promsgs_prefix: ($) => seq(kw("PROMSGS"), $._equals_value),
});
