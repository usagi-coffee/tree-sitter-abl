module.exports = ({ kw }) => ({
  quit_statement: ($) => seq(kw("QUIT"), $._terminator),
});
