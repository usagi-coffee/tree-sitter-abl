module.exports = ({ kw }) => ({
  promsgs_statement: ($) => seq(kw("PROMSGS"), $.__promsgs_body, $._terminator),

  __promsgs_body: ($) => seq("=", field("value", $._expression)),
});
