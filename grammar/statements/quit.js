module.exports = ({ tkw }) => ({
  quit_statement: ($) => seq(tkw("QUIT"), $._terminator),
});
