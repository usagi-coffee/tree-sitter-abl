module.exports = ({ kw, tkw }) => ({
  temp_table_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      seq(
        optional(alias($.__temp_table_shared_scope, $.shared_variable_scope)),
        optional(alias($.__temp_table_access_modifier, $.access_modifier)),
        optional(alias($.__temp_table_static_modifier, $.static_modifier)),
        optional(
          alias(
            $.__temp_table_serialization_modifier,
            $.serialization_modifier,
          ),
        ),
        kw("TEMP-TABLE"),
        $.__temp_table_body,
        $._terminator,
      ),
    ),

  __temp_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      optional(
        seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
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
      optional(tkw("REFERENCE-ONLY")),
      repeat(
        choice(
          $.argument_reference,
          alias($.__temp_table_like_phrase, $.like_phrase),
          alias(
            $.__temp_table_like_sequential_phrase,
            $.like_sequential_phrase,
          ),
          alias($.__temp_table_rcode_information, $.rcode_information),
          alias($.__temp_table_before_table_phrase, $.before_table_phrase),
        ),
      ),
      repeat1(
        choice(
          alias($.__temp_table_field, $.temp_table_field),
          alias($.__temp_table_index, $.temp_table_index),
        ),
      ),
    ),

  __temp_table_field: ($) =>
    seq(
      kw("FIELD"),
      field("name", $.identifier),
      choice(
        seq(kw("AS"), field("type", $._type_name)),
        seq(kw("LIKE"), field("type", $._type_name), optional(tkw("VALIDATE"))),
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
  __temp_table_no_undo: ($) => tkw("NO-UNDO"),
  __temp_table_like_phrase: ($) =>
    seq(
      kw("LIKE"),
      field("like", $.__temp_table_like_name),
      optional(tkw("VALIDATE")),
      repeat($.__temp_table_use_index_phrase),
    ),
  __temp_table_like_sequential_phrase: ($) =>
    seq(
      kw("LIKE-SEQUENTIAL"),
      field("like", $.__temp_table_like_name),
      optional(tkw("VALIDATE")),
      repeat($.__temp_table_use_index_phrase),
    ),
  __temp_table_use_index_phrase: ($) =>
    seq(
      kw("USE-INDEX"),
      field("index", $.identifier),
      optional(seq(kw("AS"), kw("PRIMARY"))),
    ),
  __temp_table_rcode_information: ($) => tkw("RCODE-INFORMATION"),
  __temp_table_before_table_phrase: ($) =>
    seq(kw("BEFORE-TABLE"), field("before", $.identifier)),
  __temp_table_index_field: ($) =>
    seq(
      field("field", $.__temp_table_field_name),
      optional(choice(tkw("ASCENDING"), tkw("DESCENDING"))),
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
        choice($._expression, seq("[", optional($._expressions), "]")),
      ),
      seq(kw("LABEL"), $.__temp_table_label_list),
      seq(kw("MOUSE-POINTER"), $._expression),
      seq(optional(kw("NOT")), tkw("CASE-SENSITIVE")),
      seq(kw("PFCOLOR"), $._expression),
      tkw("SERIALIZE-HIDDEN"),
      seq(kw("SERIALIZE-NAME"), $.string_literal),
      seq(choice(kw("TTCODEPAGE"), kw("COLUMN-CODEPAGE")), $.string_literal),
      seq(kw("XML-DATA-TYPE"), $.string_literal),
      seq(kw("XML-NODE-TYPE"), $.string_literal),
      seq(kw("XML-NODE-NAME"), $.string_literal),
      seq(kw("VIEW-AS"), $.identifier),
    ),
  __temp_table_shared_scope: ($) =>
    choice(
      seq(kw("NEW"), kw("GLOBAL")),
      seq(kw("NEW"), kw("GLOBAL"), kw("SHARED")),
      seq(kw("NEW"), kw("SHARED")),
      kw("SHARED"),
    ),
  __temp_table_access_modifier: ($) => choice(kw("PRIVATE"), kw("PROTECTED")),
  __temp_table_static_modifier: ($) => kw("STATIC"),
  __temp_table_serialization_modifier: ($) =>
    choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),
  __temp_table_like_name: ($) => choice($.identifier, $.qualified_name),
  __temp_table_label_list: ($) =>
    seq($.string_literal, repeat(seq(",", $.string_literal))),
  __temp_table_field_name: ($) => choice($.qualified_name, $.identifier),
});
