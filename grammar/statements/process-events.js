module.exports = ({ kw, tkw }) => ({
  process_events_statement: ($) =>
    seq(tkw("PROCESS"), tkw("EVENTS"), $._terminator),
});
