module.exports = ({ kw }) => ({
  promsgs_statement: ($) =>
    seq(kw("PROMSGS"), "=", field("value", $._expression), $._terminator),
});
