export default ({ kw }) => ({
  process_events_statement: ($) => seq($.__process_events_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __process_events_prefix: ($) => seq(kw("PROCESS"), kw("EVENTS")),
});
