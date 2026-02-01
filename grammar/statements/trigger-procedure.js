module.exports = ({ kw }) => ({
  trigger_procedure_statement: ($) =>
    seq(
      kw("TRIGGER"),
      kw("PROCEDURE"),
      $.__trigger_procedure_body,
      $._terminator,
    ),

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
          kw("WRITE"),
          kw("OF"),
          field("object", $.identifier),
          optional(
            seq(
              kw("NEW"),
              optional(kw("BUFFER")),
              field("new_buffer", $.identifier),
            ),
          ),
          optional(
            seq(
              kw("OLD"),
              optional(kw("BUFFER")),
              field("old_buffer", $.identifier),
            ),
          ),
        ),
        // ASSIGN event
        seq(
          kw("ASSIGN"),
          choice(
            seq(kw("OF"), field("object", $.qualified_name)),
            seq(
              kw("NEW"),
              optional(kw("VALUE")),
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
