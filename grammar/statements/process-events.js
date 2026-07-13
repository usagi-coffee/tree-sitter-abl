export default ({ kw }) => ({
  process_events_statement: ($) => seq($.__process_events_prefix, $._terminator),

  __process_events_prefix: ($) => seq(kw("PROCESS"), kw("EVENTS")),
});
