export default ({ kw }) => ({
  input_clear_statement: ($) => seq($.__input_clear_prefix, $._terminator),

  __input_clear_prefix: ($) => seq(kw("INPUT"), kw("CLEAR")),
});
