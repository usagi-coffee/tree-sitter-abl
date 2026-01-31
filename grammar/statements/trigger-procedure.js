module.exports = ({ kw, tkw }) => ({
  trigger_procedure_statement: ($) =>
    seq(tkw("TRIGGER"), kw("PROCEDURE"), $.__trigger_procedure_body, $._terminator),

  __trigger_procedure_body: ($) =>
    seq(
      kw("FOR"),
      choice(
        // Simple events: CREATE, DELETE, FIND, REPLICATION-CREATE, etc.
        seq(
          field("event", $.identifier),
          kw("OF"),
          field("object", $.identifier),
        ),
        // WRITE event with optional NEW and OLD buffers
        seq(
          tkw("WRITE"),
          kw("OF"),
          field("object", $.identifier),
          optional(
            seq(
              tkw("NEW"),
              optional(tkw("BUFFER")),
              field("new_buffer", $.identifier),
            ),
          ),
          optional(
            seq(
              tkw("OLD"),
              optional(tkw("BUFFER")),
              field("old_buffer", $.identifier),
            ),
          ),
        ),
        // ASSIGN event
        seq(
          tkw("ASSIGN"),
          choice(
            seq(kw("OF"), field("object", $.qualified_name)),
            seq(
              tkw("NEW"),
              optional(tkw("VALUE")),
              field("value", $.identifier),
              choice(
                seq(kw("AS"), field("data_type", $.identifier)),
                seq(kw("LIKE"), field("like_field", $.qualified_name)),
              ),
            ),
          ),
        ),
      ),
    ),
});
