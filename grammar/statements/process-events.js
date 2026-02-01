module.exports = ({ kw }) => ({
  process_events_statement: ($) =>
    seq(kw("PROCESS"), kw("EVENTS"), $._terminator),
});
