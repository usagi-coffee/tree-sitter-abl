export default () => ({
  empty_statement: ($) => choice($._terminator_dot, ";"),
});
