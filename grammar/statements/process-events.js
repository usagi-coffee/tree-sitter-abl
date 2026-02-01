module.exports = ({ kw }) => ({
  process_events_statement: ($) =>
    seq(kw("PROCESS"), $.__process_events_body, $._terminator),

  __process_events_body: ($) => seq(kw("EVENTS")),
});
