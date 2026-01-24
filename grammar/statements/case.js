module.exports = ({ kw, tkw }) => ({
  case_statement: ($) =>
    seq(
      kw("CASE"),
      optional($._expression),
      $._colon,
      repeat1($.case_when_phrase),
      optional($.case_otherwise_phrase),
      tkw("END"),
      optional(tkw("CASE")),
      $._terminator,
    ),

  case_when_phrase: ($) =>
    seq(
      kw("WHEN"),
      $.__case_when_expression_list,
      kw("THEN"),
      choice($.do_block, $.case_phrase_statement),
    ),

  case_otherwise_phrase: ($) =>
    seq(kw("OTHERWISE"), choice($.do_block, $.case_phrase_statement)),

  case_phrase_statement: ($) =>
    choice(
      $.enum_statement,
      $.var_statement,
      $.if_statement,
      $.for_each_statement,
      $.find_statement,
      $.repeat_statement,
      $.display_statement,
      $.empty_temp_table_statement,
      $.export_statement,
      $.assign_statement,
      $.run_statement,
      $.create_statement,
      $.delete_statement,
      $.buffer_copy_statement,
      $.put_statement,
      $.output_statement,
      $.os_command_statement,
      $.next_statement,
      $.release_statement,
      $.catch_statement,
      $.return_statement,
      $.undo_statement,
      $.assignment_statement,
      $.expression_statement,
    ),

  __case_when_expression_list: ($) =>
    seq($._expression, repeat(seq(kw("OR"), kw("WHEN"), $._expression))),
});
