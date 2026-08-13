export default ({ kw }) => ({
  os_append_statement: ($) => seq($.__os_append_prefix, $._terminator),

  __os_append_prefix: ($) =>
    seq(kw("OS-APPEND"), field("source", $._os_filename), field("target", $._os_filename)),
});
