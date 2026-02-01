module.exports = ({ kw }) => ({
  input_clear_statement: ($) =>
    seq(kw("INPUT"), $.__input_clear_body, $._terminator),

  __input_clear_body: ($) => seq(kw("CLEAR")),
});
