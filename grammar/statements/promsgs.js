module.exports = ({ kw }) => ({
  promsgs_statement: ($) => seq($.__promsgs_prefix, $._terminator),

  __promsgs_prefix: ($) => seq(kw("PROMSGS"), $.__promsgs_body),
  __promsgs_body: ($) => seq("=", field("value", $._expression)),
});
