module.exports = ({ kw }) => ({
  temp_table_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__temp_table_shared_scope, $.shared_variable_scope),
          seq(
            optional(alias($.__temp_table_access_modifier, $.access_modifier)),
            optional(alias($.__temp_table_static_modifier, $.static_modifier)),
          ),
        ),
      ),
      $.__temp_table_keyword,
      field("name", $.identifier),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      optional(
        seq(
          kw("NAMESPACE-URI"),
          field("namespace_uri", $.string_literal),
        ),
      ),
      optional(
        seq(
          kw("NAMESPACE-PREFIX"),
          field("namespace_prefix", $.string_literal),
        ),
      ),
      optional(seq(kw("XML-NODE-NAME"), field("node", $.string_literal))),
      optional(
        seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
      ),
      optional(token(/REFERENCE-ONLY/i)),
      repeat(
        choice(
          alias($.__temp_table_like_clause, $.like_clause),
          alias($.__temp_table_like_sequential_clause, $.like_sequential_clause),
          alias($.__temp_table_rcode_information, $.rcode_information),
          alias($.__temp_table_before_table_clause, $.before_table_clause),
        ),
      ),
      repeat1(
        choice(
          alias($.__temp_table_field, $.temp_table_field),
          alias($.__temp_table_index, $.temp_table_index),
        ),
      ),
      $._terminator,
    ),

  work_table_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("WORK-TABLE"),
      field("name", $.identifier),
      optional(alias($.__temp_table_like_clause, $.like_clause)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      repeat1(
        choice(
          alias($.__temp_table_field, $.work_table_field),
          alias($.__temp_table_index, $.work_table_index),
        ),
      ),
      $._terminator,
    ),

  workfile_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("WORKFILE"),
      field("name", $.identifier),
      optional(alias($.__temp_table_like_clause, $.like_clause)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      $._terminator,
    ),

  __temp_table_field: ($) =>
    seq(
      kw("FIELD"),
      field("name", $.identifier),
      choice(
        seq(kw("AS"), field("type", $._type_name)),
        seq(
          kw("LIKE"),
          field("type", $._type_name),
          optional(token(/VALIDATE/i)),
        ),
      ),
      repeat(alias($.__temp_table_field_option, $.field_option)),
    ),

  __temp_table_index: ($) =>
    seq(
      kw("INDEX"),
      field("name", $.identifier),
      optional(
        seq(
          choice(kw("AS"), kw("IS")),
          optional(kw("UNIQUE")),
          optional(kw("PRIMARY")),
          optional(kw("WORD-INDEX")),
        ),
      ),
      repeat1($.__temp_table_index_field),
    ),
  __temp_table_no_undo: ($) => token(/NO-UNDO/i),
  __temp_table_like_clause: ($) =>
    seq(
      kw("LIKE"),
      field("like", $.__temp_table_like_name),
      optional(token(/VALIDATE/i)),
      repeat($.__temp_table_use_index_clause),
    ),
  __temp_table_like_sequential_clause: ($) =>
    seq(
      kw("LIKE-SEQUENTIAL"),
      field("like", $.__temp_table_like_name),
      optional(token(/VALIDATE/i)),
      repeat($.__temp_table_use_index_clause),
    ),
  __temp_table_use_index_clause: ($) =>
    seq(
      kw("USE-INDEX"),
      field("index", $.identifier),
      optional(seq(kw("AS"), kw("PRIMARY"))),
    ),
  __temp_table_rcode_information: ($) => token(/RCODE-INFORMATION/i),
  __temp_table_before_table_clause: ($) =>
    seq(kw("BEFORE-TABLE"), field("before", $.identifier)),
  __temp_table_index_field: ($) =>
    seq(
      field("field", $.__temp_table_field_name),
      optional(choice(kw("ASCENDING"), kw("DESCENDING"))),
    ),
  __temp_table_field_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), $._expression),
      seq(kw("COLUMN-LABEL"), $.__temp_table_label_list),
      seq(kw("DCOLOR"), $._expression),
      seq(kw("DECIMALS"), $.number_literal),
      seq(kw("EXTENT"), $.number_literal),
      seq(kw("FONT"), $._expression),
      seq(kw("FGCOLOR"), $._expression),
      seq(kw("FORMAT"), $.string_literal),
      seq(kw("HELP"), $.string_literal),
      seq(
        kw("INITIAL"),
        choice($._expression, seq("[", optional($._expression_list), "]")),
      ),
      seq(kw("LABEL"), $.__temp_table_label_list),
      seq(kw("MOUSE-POINTER"), $._expression),
      seq(optional(kw("NOT")), token(/CASE-SENSITIVE/i)),
      seq(kw("PFCOLOR"), $._expression),
      token(/SERIALIZE-HIDDEN/i),
      seq(kw("SERIALIZE-NAME"), $.string_literal),
      seq(choice(kw("TTCODEPAGE"), kw("COLUMN-CODEPAGE")), $.string_literal),
      seq(kw("XML-DATA-TYPE"), $.string_literal),
      seq(kw("XML-NODE-TYPE"), $.string_literal),
      seq(kw("XML-NODE-NAME"), $.string_literal),
      seq(kw("VIEW-AS"), $.identifier),
    ),
  __temp_table_shared_scope: ($) =>
    choice(
      seq(kw("NEW"), kw("GLOBAL"), kw("SHARED")),
      seq(kw("NEW"), kw("SHARED")),
      kw("SHARED"),
    ),
  __temp_table_access_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PROTECTED"),
    ),
  __temp_table_static_modifier: ($) => kw("STATIC"),
  __temp_table_serialization_modifier: ($) =>
    choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),
  __temp_table_keyword: ($) =>
    choice(
      kw("TEMP-TABLE"),
      seq(
        alias($.__temp_table_serialization_modifier, $.serialization_modifier),
        kw("TEMP-TABLE"),
      ),
    ),
  __temp_table_like_name: ($) => choice($.identifier, $.qualified_name),
  __temp_table_label_list: ($) =>
    seq($.string_literal, repeat(seq(",", $.string_literal))),
  __temp_table_field_name: ($) => choice($.qualified_name, $.identifier),
});
