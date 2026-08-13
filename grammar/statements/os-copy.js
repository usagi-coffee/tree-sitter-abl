export default ({ kw }) => ({
  os_copy_statement: ($) => seq($.__os_copy_prefix, $._terminator),

  __os_copy_prefix: ($) =>
    seq(kw("OS-COPY"), field("source", $._os_filename), field("target", $._os_filename)),
});
