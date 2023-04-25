#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 79
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 64
#define ALIAS_COUNT 0
#define TOKEN_COUNT 41
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 7
#define MAX_ALIAS_SEQUENCE_LENGTH 8
#define PRODUCTION_ID_COUNT 9

enum {
  sym_identifier = 1,
  sym_terminator = 2,
  anon_sym_LT = 3,
  anon_sym_LT_EQ = 4,
  anon_sym_LT_GT = 5,
  anon_sym_EQ = 6,
  anon_sym_GT = 7,
  anon_sym_GT_EQ = 8,
  anon_sym_LOGICAL = 9,
  anon_sym_INTEGER = 10,
  anon_sym_CHARACTER = 11,
  anon_sym_DECIMAL = 12,
  sym_number_literal = 13,
  anon_sym_DQUOTE = 14,
  aux_sym_double_quoted_string_token1 = 15,
  aux_sym_double_quoted_string_token2 = 16,
  anon_sym_SQUOTE = 17,
  aux_sym_single_quoted_string_token1 = 18,
  anon_sym_DEFINE = 19,
  anon_sym_DEF = 20,
  anon_sym_VARIABLE = 21,
  anon_sym_VAR = 22,
  anon_sym_AS = 23,
  anon_sym_LPAREN = 24,
  anon_sym_COMMA = 25,
  anon_sym_RPAREN = 26,
  anon_sym_ASSIGN = 27,
  anon_sym_WHERE = 28,
  anon_sym_AND = 29,
  anon_sym_NO_DASHLOCK = 30,
  anon_sym_NO_DASHWAIT = 31,
  anon_sym_SHARE_DASHLOCK = 32,
  anon_sym_EXCLUSIVE_DASHLOCK = 33,
  anon_sym_ = 34,
  anon_sym_FOR = 35,
  anon_sym_EACH = 36,
  anon_sym_FIRST = 37,
  anon_sym_LAST = 38,
  anon_sym_COLON = 39,
  anon_sym_END_DOT = 40,
  sym_source_code = 41,
  sym_expression = 42,
  sym_comparison = 43,
  sym_statement = 44,
  sym_primitive_type = 45,
  sym_string_literal = 46,
  sym_double_quoted_string = 47,
  sym_single_quoted_string = 48,
  sym_assignment = 49,
  sym_variable_definition = 50,
  sym_variable_assignment = 51,
  sym_function_call = 52,
  sym_assign_statement = 53,
  sym_where_clause = 54,
  sym_query_tunings = 55,
  sym_for_statement = 56,
  aux_sym_source_code_repeat1 = 57,
  aux_sym_double_quoted_string_repeat1 = 58,
  aux_sym_single_quoted_string_repeat1 = 59,
  aux_sym_function_call_repeat1 = 60,
  aux_sym_assign_statement_repeat1 = 61,
  aux_sym_where_clause_repeat1 = 62,
  aux_sym_query_tunings_repeat1 = 63,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym_identifier] = "identifier",
  [sym_terminator] = "terminator",
  [anon_sym_LT] = "<",
  [anon_sym_LT_EQ] = "<=",
  [anon_sym_LT_GT] = "<>",
  [anon_sym_EQ] = "=",
  [anon_sym_GT] = ">",
  [anon_sym_GT_EQ] = ">=",
  [anon_sym_LOGICAL] = "LOGICAL",
  [anon_sym_INTEGER] = "INTEGER",
  [anon_sym_CHARACTER] = "CHARACTER",
  [anon_sym_DECIMAL] = "DECIMAL",
  [sym_number_literal] = "number_literal",
  [anon_sym_DQUOTE] = "\"",
  [aux_sym_double_quoted_string_token1] = "double_quoted_string_token1",
  [aux_sym_double_quoted_string_token2] = "double_quoted_string_token2",
  [anon_sym_SQUOTE] = "'",
  [aux_sym_single_quoted_string_token1] = "single_quoted_string_token1",
  [anon_sym_DEFINE] = "DEFINE",
  [anon_sym_DEF] = "DEF",
  [anon_sym_VARIABLE] = "VARIABLE",
  [anon_sym_VAR] = "VAR",
  [anon_sym_AS] = "AS",
  [anon_sym_LPAREN] = "(",
  [anon_sym_COMMA] = ",",
  [anon_sym_RPAREN] = ")",
  [anon_sym_ASSIGN] = "ASSIGN",
  [anon_sym_WHERE] = "WHERE",
  [anon_sym_AND] = "AND",
  [anon_sym_NO_DASHLOCK] = "NO-LOCK",
  [anon_sym_NO_DASHWAIT] = "NO-WAIT",
  [anon_sym_SHARE_DASHLOCK] = "SHARE-LOCK",
  [anon_sym_EXCLUSIVE_DASHLOCK] = "EXCLUSIVE-LOCK",
  [anon_sym_] = " ",
  [anon_sym_FOR] = "FOR",
  [anon_sym_EACH] = "EACH",
  [anon_sym_FIRST] = "FIRST",
  [anon_sym_LAST] = "LAST",
  [anon_sym_COLON] = ":",
  [anon_sym_END_DOT] = "END.",
  [sym_source_code] = "source_code",
  [sym_expression] = "expression",
  [sym_comparison] = "comparison",
  [sym_statement] = "statement",
  [sym_primitive_type] = "primitive_type",
  [sym_string_literal] = "string_literal",
  [sym_double_quoted_string] = "double_quoted_string",
  [sym_single_quoted_string] = "single_quoted_string",
  [sym_assignment] = "assignment",
  [sym_variable_definition] = "variable_definition",
  [sym_variable_assignment] = "variable_assignment",
  [sym_function_call] = "function_call",
  [sym_assign_statement] = "assign_statement",
  [sym_where_clause] = "where_clause",
  [sym_query_tunings] = "query_tunings",
  [sym_for_statement] = "for_statement",
  [aux_sym_source_code_repeat1] = "source_code_repeat1",
  [aux_sym_double_quoted_string_repeat1] = "double_quoted_string_repeat1",
  [aux_sym_single_quoted_string_repeat1] = "single_quoted_string_repeat1",
  [aux_sym_function_call_repeat1] = "function_call_repeat1",
  [aux_sym_assign_statement_repeat1] = "assign_statement_repeat1",
  [aux_sym_where_clause_repeat1] = "where_clause_repeat1",
  [aux_sym_query_tunings_repeat1] = "query_tunings_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym_identifier] = sym_identifier,
  [sym_terminator] = sym_terminator,
  [anon_sym_LT] = anon_sym_LT,
  [anon_sym_LT_EQ] = anon_sym_LT_EQ,
  [anon_sym_LT_GT] = anon_sym_LT_GT,
  [anon_sym_EQ] = anon_sym_EQ,
  [anon_sym_GT] = anon_sym_GT,
  [anon_sym_GT_EQ] = anon_sym_GT_EQ,
  [anon_sym_LOGICAL] = anon_sym_LOGICAL,
  [anon_sym_INTEGER] = anon_sym_INTEGER,
  [anon_sym_CHARACTER] = anon_sym_CHARACTER,
  [anon_sym_DECIMAL] = anon_sym_DECIMAL,
  [sym_number_literal] = sym_number_literal,
  [anon_sym_DQUOTE] = anon_sym_DQUOTE,
  [aux_sym_double_quoted_string_token1] = aux_sym_double_quoted_string_token1,
  [aux_sym_double_quoted_string_token2] = aux_sym_double_quoted_string_token2,
  [anon_sym_SQUOTE] = anon_sym_SQUOTE,
  [aux_sym_single_quoted_string_token1] = aux_sym_single_quoted_string_token1,
  [anon_sym_DEFINE] = anon_sym_DEFINE,
  [anon_sym_DEF] = anon_sym_DEF,
  [anon_sym_VARIABLE] = anon_sym_VARIABLE,
  [anon_sym_VAR] = anon_sym_VAR,
  [anon_sym_AS] = anon_sym_AS,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [anon_sym_ASSIGN] = anon_sym_ASSIGN,
  [anon_sym_WHERE] = anon_sym_WHERE,
  [anon_sym_AND] = anon_sym_AND,
  [anon_sym_NO_DASHLOCK] = anon_sym_NO_DASHLOCK,
  [anon_sym_NO_DASHWAIT] = anon_sym_NO_DASHWAIT,
  [anon_sym_SHARE_DASHLOCK] = anon_sym_SHARE_DASHLOCK,
  [anon_sym_EXCLUSIVE_DASHLOCK] = anon_sym_EXCLUSIVE_DASHLOCK,
  [anon_sym_] = anon_sym_,
  [anon_sym_FOR] = anon_sym_FOR,
  [anon_sym_EACH] = anon_sym_EACH,
  [anon_sym_FIRST] = anon_sym_FIRST,
  [anon_sym_LAST] = anon_sym_LAST,
  [anon_sym_COLON] = anon_sym_COLON,
  [anon_sym_END_DOT] = anon_sym_END_DOT,
  [sym_source_code] = sym_source_code,
  [sym_expression] = sym_expression,
  [sym_comparison] = sym_comparison,
  [sym_statement] = sym_statement,
  [sym_primitive_type] = sym_primitive_type,
  [sym_string_literal] = sym_string_literal,
  [sym_double_quoted_string] = sym_double_quoted_string,
  [sym_single_quoted_string] = sym_single_quoted_string,
  [sym_assignment] = sym_assignment,
  [sym_variable_definition] = sym_variable_definition,
  [sym_variable_assignment] = sym_variable_assignment,
  [sym_function_call] = sym_function_call,
  [sym_assign_statement] = sym_assign_statement,
  [sym_where_clause] = sym_where_clause,
  [sym_query_tunings] = sym_query_tunings,
  [sym_for_statement] = sym_for_statement,
  [aux_sym_source_code_repeat1] = aux_sym_source_code_repeat1,
  [aux_sym_double_quoted_string_repeat1] = aux_sym_double_quoted_string_repeat1,
  [aux_sym_single_quoted_string_repeat1] = aux_sym_single_quoted_string_repeat1,
  [aux_sym_function_call_repeat1] = aux_sym_function_call_repeat1,
  [aux_sym_assign_statement_repeat1] = aux_sym_assign_statement_repeat1,
  [aux_sym_where_clause_repeat1] = aux_sym_where_clause_repeat1,
  [aux_sym_query_tunings_repeat1] = aux_sym_query_tunings_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [sym_identifier] = {
    .visible = true,
    .named = true,
  },
  [sym_terminator] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_LT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LT_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LT_GT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_GT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_GT_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LOGICAL] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_INTEGER] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_CHARACTER] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DECIMAL] = {
    .visible = true,
    .named = false,
  },
  [sym_number_literal] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_DQUOTE] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_double_quoted_string_token1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_double_quoted_string_token2] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_SQUOTE] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_single_quoted_string_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_DEFINE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DEF] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_VARIABLE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_VAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AS] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COMMA] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_ASSIGN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_WHERE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AND] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_NO_DASHLOCK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_NO_DASHWAIT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SHARE_DASHLOCK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EXCLUSIVE_DASHLOCK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_FOR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EACH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_FIRST] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LAST] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_END_DOT] = {
    .visible = true,
    .named = false,
  },
  [sym_source_code] = {
    .visible = true,
    .named = true,
  },
  [sym_expression] = {
    .visible = true,
    .named = true,
  },
  [sym_comparison] = {
    .visible = true,
    .named = true,
  },
  [sym_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_primitive_type] = {
    .visible = true,
    .named = true,
  },
  [sym_string_literal] = {
    .visible = true,
    .named = true,
  },
  [sym_double_quoted_string] = {
    .visible = true,
    .named = true,
  },
  [sym_single_quoted_string] = {
    .visible = true,
    .named = true,
  },
  [sym_assignment] = {
    .visible = true,
    .named = true,
  },
  [sym_variable_definition] = {
    .visible = true,
    .named = true,
  },
  [sym_variable_assignment] = {
    .visible = true,
    .named = true,
  },
  [sym_function_call] = {
    .visible = true,
    .named = true,
  },
  [sym_assign_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_where_clause] = {
    .visible = true,
    .named = true,
  },
  [sym_query_tunings] = {
    .visible = true,
    .named = true,
  },
  [sym_for_statement] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_source_code_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_double_quoted_string_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_single_quoted_string_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_function_call_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_assign_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_where_clause_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_query_tunings_repeat1] = {
    .visible = false,
    .named = false,
  },
};

enum {
  field_comparator = 1,
  field_conditions = 2,
  field_function = 3,
  field_identifier = 4,
  field_query_tunings = 5,
  field_table = 6,
  field_type = 7,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_comparator] = "comparator",
  [field_conditions] = "conditions",
  [field_function] = "function",
  [field_identifier] = "identifier",
  [field_query_tunings] = "query_tunings",
  [field_table] = "table",
  [field_type] = "type",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 1},
  [2] = {.index = 1, .length = 1},
  [3] = {.index = 2, .length = 1},
  [4] = {.index = 3, .length = 2},
  [5] = {.index = 5, .length = 2},
  [6] = {.index = 7, .length = 2},
  [7] = {.index = 9, .length = 3},
  [8] = {.index = 12, .length = 3},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_function, 0},
  [1] =
    {field_comparator, 1},
  [2] =
    {field_conditions, 1},
  [3] =
    {field_table, 2},
    {field_type, 1},
  [5] =
    {field_identifier, 2},
    {field_type, 4},
  [7] =
    {field_conditions, 1},
    {field_conditions, 2},
  [9] =
    {field_query_tunings, 3},
    {field_table, 2},
    {field_type, 1},
  [12] =
    {field_query_tunings, 4},
    {field_table, 2},
    {field_type, 1},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
  [20] = 20,
  [21] = 21,
  [22] = 22,
  [23] = 23,
  [24] = 24,
  [25] = 25,
  [26] = 26,
  [27] = 27,
  [28] = 28,
  [29] = 29,
  [30] = 30,
  [31] = 31,
  [32] = 32,
  [33] = 33,
  [34] = 34,
  [35] = 35,
  [36] = 36,
  [37] = 37,
  [38] = 38,
  [39] = 39,
  [40] = 40,
  [41] = 41,
  [42] = 42,
  [43] = 43,
  [44] = 44,
  [45] = 45,
  [46] = 46,
  [47] = 47,
  [48] = 48,
  [49] = 49,
  [50] = 50,
  [51] = 51,
  [52] = 52,
  [53] = 53,
  [54] = 54,
  [55] = 55,
  [56] = 56,
  [57] = 57,
  [58] = 58,
  [59] = 59,
  [60] = 60,
  [61] = 61,
  [62] = 62,
  [63] = 63,
  [64] = 64,
  [65] = 65,
  [66] = 66,
  [67] = 67,
  [68] = 68,
  [69] = 69,
  [70] = 70,
  [71] = 71,
  [72] = 72,
  [73] = 73,
  [74] = 74,
  [75] = 75,
  [76] = 76,
  [77] = 77,
  [78] = 78,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(99);
      if (lookahead == '"') ADVANCE(113);
      if (lookahead == '\'') ADVANCE(117);
      if (lookahead == '(') ADVANCE(126);
      if (lookahead == ')') ADVANCE(128);
      if (lookahead == ',') ADVANCE(127);
      if (lookahead == '.') ADVANCE(101);
      if (lookahead == ':') ADVANCE(141);
      if (lookahead == '<') ADVANCE(102);
      if (lookahead == '=') ADVANCE(105);
      if (lookahead == '>') ADVANCE(106);
      if (lookahead == 'A') ADVANCE(66);
      if (lookahead == 'C') ADVANCE(47);
      if (lookahead == 'D') ADVANCE(30);
      if (lookahead == 'E') ADVANCE(8);
      if (lookahead == 'F') ADVANCE(49);
      if (lookahead == 'I') ADVANCE(67);
      if (lookahead == 'L') ADVANCE(9);
      if (lookahead == 'N') ADVANCE(71);
      if (lookahead == 'S') ADVANCE(48);
      if (lookahead == 'V') ADVANCE(12);
      if (lookahead == 'W') ADVANCE(46);
      if (lookahead == '\\') ADVANCE(97);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(112);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(100);
      END_STATE();
    case 1:
      if (lookahead == ' ') ADVANCE(136);
      if (lookahead == ':') ADVANCE(141);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r') SKIP(1)
      END_STATE();
    case 2:
      if (lookahead == '"') ADVANCE(113);
      if (lookahead == '\\') ADVANCE(97);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(114);
      if (lookahead != 0) ADVANCE(115);
      END_STATE();
    case 3:
      if (lookahead == '\'') ADVANCE(117);
      if (lookahead == '\\') ADVANCE(97);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(118);
      if (lookahead != 0) ADVANCE(119);
      END_STATE();
    case 4:
      if (lookahead == '-') ADVANCE(61);
      END_STATE();
    case 5:
      if (lookahead == '-') ADVANCE(63);
      END_STATE();
    case 6:
      if (lookahead == '-') ADVANCE(64);
      END_STATE();
    case 7:
      if (lookahead == '.') ADVANCE(142);
      END_STATE();
    case 8:
      if (lookahead == 'A') ADVANCE(24);
      if (lookahead == 'N') ADVANCE(29);
      if (lookahead == 'X') ADVANCE(20);
      END_STATE();
    case 9:
      if (lookahead == 'A') ADVANCE(86);
      if (lookahead == 'O') ADVANCE(43);
      END_STATE();
    case 10:
      if (lookahead == 'A') ADVANCE(19);
      END_STATE();
    case 11:
      if (lookahead == 'A') ADVANCE(59);
      END_STATE();
    case 12:
      if (lookahead == 'A') ADVANCE(77);
      END_STATE();
    case 13:
      if (lookahead == 'A') ADVANCE(60);
      END_STATE();
    case 14:
      if (lookahead == 'A') ADVANCE(27);
      END_STATE();
    case 15:
      if (lookahead == 'A') ADVANCE(80);
      END_STATE();
    case 16:
      if (lookahead == 'A') ADVANCE(54);
      END_STATE();
    case 17:
      if (lookahead == 'A') ADVANCE(81);
      END_STATE();
    case 18:
      if (lookahead == 'A') ADVANCE(85);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(18)
      END_STATE();
    case 19:
      if (lookahead == 'B') ADVANCE(62);
      END_STATE();
    case 20:
      if (lookahead == 'C') ADVANCE(58);
      END_STATE();
    case 21:
      if (lookahead == 'C') ADVANCE(55);
      END_STATE();
    case 22:
      if (lookahead == 'C') ADVANCE(50);
      if (lookahead == 'F') ADVANCE(121);
      END_STATE();
    case 23:
      if (lookahead == 'C') ADVANCE(56);
      END_STATE();
    case 24:
      if (lookahead == 'C') ADVANCE(45);
      END_STATE();
    case 25:
      if (lookahead == 'C') ADVANCE(57);
      END_STATE();
    case 26:
      if (lookahead == 'C') ADVANCE(13);
      END_STATE();
    case 27:
      if (lookahead == 'C') ADVANCE(94);
      END_STATE();
    case 28:
      if (lookahead == 'D') ADVANCE(131);
      END_STATE();
    case 29:
      if (lookahead == 'D') ADVANCE(7);
      END_STATE();
    case 30:
      if (lookahead == 'E') ADVANCE(22);
      END_STATE();
    case 31:
      if (lookahead == 'E') ADVANCE(130);
      END_STATE();
    case 32:
      if (lookahead == 'E') ADVANCE(120);
      END_STATE();
    case 33:
      if (lookahead == 'E') ADVANCE(122);
      END_STATE();
    case 34:
      if (lookahead == 'E') ADVANCE(41);
      END_STATE();
    case 35:
      if (lookahead == 'E') ADVANCE(5);
      END_STATE();
    case 36:
      if (lookahead == 'E') ADVANCE(44);
      END_STATE();
    case 37:
      if (lookahead == 'E') ADVANCE(82);
      END_STATE();
    case 38:
      if (lookahead == 'E') ADVANCE(78);
      END_STATE();
    case 39:
      if (lookahead == 'E') ADVANCE(79);
      END_STATE();
    case 40:
      if (lookahead == 'E') ADVANCE(6);
      END_STATE();
    case 41:
      if (lookahead == 'F') ADVANCE(121);
      END_STATE();
    case 42:
      if (lookahead == 'G') ADVANCE(68);
      END_STATE();
    case 43:
      if (lookahead == 'G') ADVANCE(53);
      END_STATE();
    case 44:
      if (lookahead == 'G') ADVANCE(38);
      END_STATE();
    case 45:
      if (lookahead == 'H') ADVANCE(138);
      END_STATE();
    case 46:
      if (lookahead == 'H') ADVANCE(37);
      END_STATE();
    case 47:
      if (lookahead == 'H') ADVANCE(15);
      END_STATE();
    case 48:
      if (lookahead == 'H') ADVANCE(17);
      END_STATE();
    case 49:
      if (lookahead == 'I') ADVANCE(83);
      if (lookahead == 'O') ADVANCE(76);
      END_STATE();
    case 50:
      if (lookahead == 'I') ADVANCE(65);
      END_STATE();
    case 51:
      if (lookahead == 'I') ADVANCE(96);
      END_STATE();
    case 52:
      if (lookahead == 'I') ADVANCE(42);
      END_STATE();
    case 53:
      if (lookahead == 'I') ADVANCE(26);
      END_STATE();
    case 54:
      if (lookahead == 'I') ADVANCE(92);
      END_STATE();
    case 55:
      if (lookahead == 'K') ADVANCE(132);
      END_STATE();
    case 56:
      if (lookahead == 'K') ADVANCE(134);
      END_STATE();
    case 57:
      if (lookahead == 'K') ADVANCE(135);
      END_STATE();
    case 58:
      if (lookahead == 'L') ADVANCE(95);
      END_STATE();
    case 59:
      if (lookahead == 'L') ADVANCE(111);
      END_STATE();
    case 60:
      if (lookahead == 'L') ADVANCE(108);
      END_STATE();
    case 61:
      if (lookahead == 'L') ADVANCE(73);
      if (lookahead == 'W') ADVANCE(16);
      END_STATE();
    case 62:
      if (lookahead == 'L') ADVANCE(33);
      END_STATE();
    case 63:
      if (lookahead == 'L') ADVANCE(74);
      END_STATE();
    case 64:
      if (lookahead == 'L') ADVANCE(75);
      END_STATE();
    case 65:
      if (lookahead == 'M') ADVANCE(11);
      END_STATE();
    case 66:
      if (lookahead == 'N') ADVANCE(28);
      if (lookahead == 'S') ADVANCE(125);
      END_STATE();
    case 67:
      if (lookahead == 'N') ADVANCE(93);
      END_STATE();
    case 68:
      if (lookahead == 'N') ADVANCE(129);
      END_STATE();
    case 69:
      if (lookahead == 'N') ADVANCE(29);
      END_STATE();
    case 70:
      if (lookahead == 'N') ADVANCE(32);
      END_STATE();
    case 71:
      if (lookahead == 'O') ADVANCE(4);
      END_STATE();
    case 72:
      if (lookahead == 'O') ADVANCE(76);
      END_STATE();
    case 73:
      if (lookahead == 'O') ADVANCE(21);
      END_STATE();
    case 74:
      if (lookahead == 'O') ADVANCE(23);
      END_STATE();
    case 75:
      if (lookahead == 'O') ADVANCE(25);
      END_STATE();
    case 76:
      if (lookahead == 'R') ADVANCE(137);
      END_STATE();
    case 77:
      if (lookahead == 'R') ADVANCE(123);
      END_STATE();
    case 78:
      if (lookahead == 'R') ADVANCE(109);
      END_STATE();
    case 79:
      if (lookahead == 'R') ADVANCE(110);
      END_STATE();
    case 80:
      if (lookahead == 'R') ADVANCE(14);
      END_STATE();
    case 81:
      if (lookahead == 'R') ADVANCE(35);
      END_STATE();
    case 82:
      if (lookahead == 'R') ADVANCE(31);
      END_STATE();
    case 83:
      if (lookahead == 'R') ADVANCE(87);
      END_STATE();
    case 84:
      if (lookahead == 'S') ADVANCE(52);
      END_STATE();
    case 85:
      if (lookahead == 'S') ADVANCE(124);
      END_STATE();
    case 86:
      if (lookahead == 'S') ADVANCE(90);
      END_STATE();
    case 87:
      if (lookahead == 'S') ADVANCE(91);
      END_STATE();
    case 88:
      if (lookahead == 'S') ADVANCE(84);
      END_STATE();
    case 89:
      if (lookahead == 'S') ADVANCE(51);
      END_STATE();
    case 90:
      if (lookahead == 'T') ADVANCE(140);
      END_STATE();
    case 91:
      if (lookahead == 'T') ADVANCE(139);
      END_STATE();
    case 92:
      if (lookahead == 'T') ADVANCE(133);
      END_STATE();
    case 93:
      if (lookahead == 'T') ADVANCE(36);
      END_STATE();
    case 94:
      if (lookahead == 'T') ADVANCE(39);
      END_STATE();
    case 95:
      if (lookahead == 'U') ADVANCE(89);
      END_STATE();
    case 96:
      if (lookahead == 'V') ADVANCE(40);
      END_STATE();
    case 97:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(116);
      END_STATE();
    case 98:
      if (eof) ADVANCE(99);
      if (lookahead == 'A') ADVANCE(88);
      if (lookahead == 'D') ADVANCE(34);
      if (lookahead == 'E') ADVANCE(69);
      if (lookahead == 'F') ADVANCE(72);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(98)
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(100);
      END_STATE();
    case 99:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 100:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(100);
      END_STATE();
    case 101:
      ACCEPT_TOKEN(sym_terminator);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(anon_sym_LT);
      if (lookahead == '=') ADVANCE(103);
      if (lookahead == '>') ADVANCE(104);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(anon_sym_LT_EQ);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(anon_sym_LT_GT);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(anon_sym_GT);
      if (lookahead == '=') ADVANCE(107);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(anon_sym_GT_EQ);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(anon_sym_LOGICAL);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(anon_sym_INTEGER);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(anon_sym_CHARACTER);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(anon_sym_DECIMAL);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(sym_number_literal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(112);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(anon_sym_DQUOTE);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(114);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(115);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(115);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token2);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(anon_sym_SQUOTE);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(118);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(119);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(119);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(anon_sym_DEFINE);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(anon_sym_DEF);
      if (lookahead == 'I') ADVANCE(70);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(anon_sym_VARIABLE);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(anon_sym_VAR);
      if (lookahead == 'I') ADVANCE(10);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(anon_sym_AS);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(anon_sym_AS);
      if (lookahead == 'S') ADVANCE(52);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(anon_sym_ASSIGN);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(anon_sym_WHERE);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(anon_sym_AND);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(anon_sym_NO_DASHLOCK);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(anon_sym_NO_DASHWAIT);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(anon_sym_SHARE_DASHLOCK);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(anon_sym_EXCLUSIVE_DASHLOCK);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(anon_sym_);
      if (lookahead == ' ') ADVANCE(136);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(anon_sym_FOR);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_EACH);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_FIRST);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(anon_sym_LAST);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(anon_sym_END_DOT);
      END_STATE();
    default:
      return false;
  }
}

static bool ts_lex_keywords(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 98},
  [2] = {.lex_state = 0},
  [3] = {.lex_state = 0},
  [4] = {.lex_state = 0},
  [5] = {.lex_state = 0},
  [6] = {.lex_state = 0},
  [7] = {.lex_state = 0},
  [8] = {.lex_state = 0},
  [9] = {.lex_state = 0},
  [10] = {.lex_state = 0},
  [11] = {.lex_state = 0},
  [12] = {.lex_state = 0},
  [13] = {.lex_state = 98},
  [14] = {.lex_state = 98},
  [15] = {.lex_state = 98},
  [16] = {.lex_state = 98},
  [17] = {.lex_state = 98},
  [18] = {.lex_state = 98},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 98},
  [21] = {.lex_state = 98},
  [22] = {.lex_state = 98},
  [23] = {.lex_state = 98},
  [24] = {.lex_state = 0},
  [25] = {.lex_state = 0},
  [26] = {.lex_state = 0},
  [27] = {.lex_state = 0},
  [28] = {.lex_state = 0},
  [29] = {.lex_state = 0},
  [30] = {.lex_state = 0},
  [31] = {.lex_state = 0},
  [32] = {.lex_state = 0},
  [33] = {.lex_state = 0},
  [34] = {.lex_state = 0},
  [35] = {.lex_state = 98},
  [36] = {.lex_state = 0},
  [37] = {.lex_state = 98},
  [38] = {.lex_state = 98},
  [39] = {.lex_state = 98},
  [40] = {.lex_state = 98},
  [41] = {.lex_state = 98},
  [42] = {.lex_state = 98},
  [43] = {.lex_state = 98},
  [44] = {.lex_state = 0},
  [45] = {.lex_state = 98},
  [46] = {.lex_state = 98},
  [47] = {.lex_state = 98},
  [48] = {.lex_state = 98},
  [49] = {.lex_state = 0},
  [50] = {.lex_state = 0},
  [51] = {.lex_state = 2},
  [52] = {.lex_state = 0},
  [53] = {.lex_state = 0},
  [54] = {.lex_state = 2},
  [55] = {.lex_state = 3},
  [56] = {.lex_state = 0},
  [57] = {.lex_state = 3},
  [58] = {.lex_state = 0},
  [59] = {.lex_state = 2},
  [60] = {.lex_state = 3},
  [61] = {.lex_state = 0},
  [62] = {.lex_state = 1},
  [63] = {.lex_state = 1},
  [64] = {.lex_state = 0},
  [65] = {.lex_state = 1},
  [66] = {.lex_state = 0},
  [67] = {.lex_state = 1},
  [68] = {.lex_state = 0},
  [69] = {.lex_state = 0},
  [70] = {.lex_state = 0},
  [71] = {.lex_state = 18},
  [72] = {.lex_state = 0},
  [73] = {.lex_state = 0},
  [74] = {.lex_state = 0},
  [75] = {.lex_state = 0},
  [76] = {.lex_state = 0},
  [77] = {.lex_state = 0},
  [78] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym_identifier] = ACTIONS(1),
    [sym_terminator] = ACTIONS(1),
    [anon_sym_LT] = ACTIONS(1),
    [anon_sym_LT_EQ] = ACTIONS(1),
    [anon_sym_LT_GT] = ACTIONS(1),
    [anon_sym_EQ] = ACTIONS(1),
    [anon_sym_GT] = ACTIONS(1),
    [anon_sym_GT_EQ] = ACTIONS(1),
    [anon_sym_LOGICAL] = ACTIONS(1),
    [anon_sym_INTEGER] = ACTIONS(1),
    [anon_sym_CHARACTER] = ACTIONS(1),
    [anon_sym_DECIMAL] = ACTIONS(1),
    [sym_number_literal] = ACTIONS(1),
    [anon_sym_DQUOTE] = ACTIONS(1),
    [aux_sym_double_quoted_string_token2] = ACTIONS(1),
    [anon_sym_SQUOTE] = ACTIONS(1),
    [anon_sym_DEFINE] = ACTIONS(1),
    [anon_sym_DEF] = ACTIONS(1),
    [anon_sym_VARIABLE] = ACTIONS(1),
    [anon_sym_VAR] = ACTIONS(1),
    [anon_sym_AS] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [anon_sym_ASSIGN] = ACTIONS(1),
    [anon_sym_WHERE] = ACTIONS(1),
    [anon_sym_AND] = ACTIONS(1),
    [anon_sym_NO_DASHLOCK] = ACTIONS(1),
    [anon_sym_NO_DASHWAIT] = ACTIONS(1),
    [anon_sym_SHARE_DASHLOCK] = ACTIONS(1),
    [anon_sym_EXCLUSIVE_DASHLOCK] = ACTIONS(1),
    [anon_sym_FOR] = ACTIONS(1),
    [anon_sym_EACH] = ACTIONS(1),
    [anon_sym_FIRST] = ACTIONS(1),
    [anon_sym_LAST] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [anon_sym_END_DOT] = ACTIONS(1),
  },
  [1] = {
    [sym_source_code] = STATE(77),
    [sym_statement] = STATE(17),
    [sym_assignment] = STATE(76),
    [sym_variable_definition] = STATE(43),
    [sym_variable_assignment] = STATE(43),
    [sym_assign_statement] = STATE(43),
    [sym_for_statement] = STATE(43),
    [aux_sym_source_code_repeat1] = STATE(17),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_identifier] = ACTIONS(5),
    [anon_sym_DEFINE] = ACTIONS(7),
    [anon_sym_DEF] = ACTIONS(9),
    [anon_sym_ASSIGN] = ACTIONS(11),
    [anon_sym_FOR] = ACTIONS(13),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 3,
    ACTIONS(19), 1,
      anon_sym_LPAREN,
    ACTIONS(17), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(15), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [24] = 2,
    ACTIONS(23), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(21), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [45] = 2,
    ACTIONS(27), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(25), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [66] = 2,
    ACTIONS(31), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(29), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [87] = 2,
    ACTIONS(35), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(33), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [108] = 2,
    ACTIONS(39), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(37), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [129] = 3,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(45), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(41), 10,
      sym_identifier,
      sym_terminator,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [152] = 2,
    ACTIONS(17), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(15), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [173] = 2,
    ACTIONS(49), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(47), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [194] = 2,
    ACTIONS(53), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(51), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [215] = 2,
    ACTIONS(57), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(55), 14,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [236] = 9,
    ACTIONS(61), 1,
      sym_identifier,
    ACTIONS(64), 1,
      anon_sym_DEFINE,
    ACTIONS(67), 1,
      anon_sym_DEF,
    ACTIONS(70), 1,
      anon_sym_ASSIGN,
    ACTIONS(73), 1,
      anon_sym_FOR,
    STATE(76), 1,
      sym_assignment,
    ACTIONS(59), 2,
      ts_builtin_sym_end,
      anon_sym_END_DOT,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [269] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(76), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [301] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(78), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [333] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(80), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(15), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [365] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(82), 1,
      ts_builtin_sym_end,
    STATE(76), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [397] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(84), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(14), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [429] = 5,
    ACTIONS(86), 1,
      anon_sym_AND,
    STATE(36), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(45), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(88), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [453] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(84), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [485] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(90), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [517] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(92), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(20), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [549] = 9,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_DEFINE,
    ACTIONS(9), 1,
      anon_sym_DEF,
    ACTIONS(11), 1,
      anon_sym_ASSIGN,
    ACTIONS(13), 1,
      anon_sym_FOR,
    ACTIONS(94), 1,
      anon_sym_END_DOT,
    STATE(76), 1,
      sym_assignment,
    STATE(21), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(43), 4,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [581] = 3,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(45), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(96), 6,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [600] = 8,
    ACTIONS(98), 1,
      sym_identifier,
    ACTIONS(100), 1,
      sym_number_literal,
    ACTIONS(102), 1,
      anon_sym_DQUOTE,
    ACTIONS(104), 1,
      anon_sym_SQUOTE,
    ACTIONS(106), 1,
      anon_sym_RPAREN,
    STATE(31), 1,
      sym_expression,
    STATE(10), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(9), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [628] = 7,
    ACTIONS(98), 1,
      sym_identifier,
    ACTIONS(100), 1,
      sym_number_literal,
    ACTIONS(102), 1,
      anon_sym_DQUOTE,
    ACTIONS(104), 1,
      anon_sym_SQUOTE,
    STATE(32), 1,
      sym_expression,
    STATE(10), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(9), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [653] = 7,
    ACTIONS(98), 1,
      sym_identifier,
    ACTIONS(100), 1,
      sym_number_literal,
    ACTIONS(102), 1,
      anon_sym_DQUOTE,
    ACTIONS(104), 1,
      anon_sym_SQUOTE,
    STATE(19), 1,
      sym_expression,
    STATE(10), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(9), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [678] = 7,
    ACTIONS(98), 1,
      sym_identifier,
    ACTIONS(100), 1,
      sym_number_literal,
    ACTIONS(102), 1,
      anon_sym_DQUOTE,
    ACTIONS(104), 1,
      anon_sym_SQUOTE,
    STATE(33), 1,
      sym_expression,
    STATE(10), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(9), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [703] = 7,
    ACTIONS(98), 1,
      sym_identifier,
    ACTIONS(100), 1,
      sym_number_literal,
    ACTIONS(102), 1,
      anon_sym_DQUOTE,
    ACTIONS(104), 1,
      anon_sym_SQUOTE,
    STATE(8), 1,
      sym_expression,
    STATE(10), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(9), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [728] = 7,
    ACTIONS(98), 1,
      sym_identifier,
    ACTIONS(100), 1,
      sym_number_literal,
    ACTIONS(102), 1,
      anon_sym_DQUOTE,
    ACTIONS(104), 1,
      anon_sym_SQUOTE,
    STATE(24), 1,
      sym_expression,
    STATE(10), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(9), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [753] = 5,
    ACTIONS(108), 1,
      anon_sym_COMMA,
    ACTIONS(110), 1,
      anon_sym_RPAREN,
    STATE(64), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(45), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [773] = 3,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(112), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
    ACTIONS(45), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [788] = 3,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(114), 2,
      sym_identifier,
      sym_terminator,
    ACTIONS(45), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [803] = 5,
    ACTIONS(116), 1,
      anon_sym_WHERE,
    ACTIONS(120), 1,
      anon_sym_COLON,
    STATE(49), 1,
      sym_where_clause,
    STATE(70), 1,
      sym_query_tunings,
    ACTIONS(118), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [822] = 2,
    ACTIONS(124), 1,
      anon_sym_DEF,
    ACTIONS(122), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [834] = 3,
    ACTIONS(86), 1,
      anon_sym_AND,
    STATE(44), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(126), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [848] = 2,
    ACTIONS(130), 1,
      anon_sym_DEF,
    ACTIONS(128), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [860] = 2,
    ACTIONS(134), 1,
      anon_sym_DEF,
    ACTIONS(132), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [872] = 2,
    ACTIONS(138), 1,
      anon_sym_DEF,
    ACTIONS(136), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [884] = 2,
    ACTIONS(142), 1,
      anon_sym_DEF,
    ACTIONS(140), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [896] = 2,
    ACTIONS(146), 1,
      anon_sym_DEF,
    ACTIONS(144), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [908] = 2,
    ACTIONS(150), 1,
      anon_sym_DEF,
    ACTIONS(148), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [920] = 2,
    ACTIONS(154), 1,
      anon_sym_DEF,
    ACTIONS(152), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [932] = 3,
    ACTIONS(156), 1,
      anon_sym_AND,
    STATE(44), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(96), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [946] = 2,
    ACTIONS(161), 1,
      anon_sym_DEF,
    ACTIONS(159), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [958] = 2,
    ACTIONS(165), 1,
      anon_sym_DEF,
    ACTIONS(163), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [970] = 2,
    ACTIONS(169), 1,
      anon_sym_DEF,
    ACTIONS(167), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [982] = 2,
    ACTIONS(173), 1,
      anon_sym_DEF,
    ACTIONS(171), 6,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [994] = 3,
    ACTIONS(175), 1,
      anon_sym_COLON,
    STATE(74), 1,
      sym_query_tunings,
    ACTIONS(118), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [1007] = 2,
    STATE(78), 1,
      sym_primitive_type,
    ACTIONS(177), 4,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
  [1017] = 4,
    ACTIONS(179), 1,
      anon_sym_DQUOTE,
    ACTIONS(181), 1,
      aux_sym_double_quoted_string_token1,
    ACTIONS(184), 1,
      aux_sym_double_quoted_string_token2,
    STATE(51), 1,
      aux_sym_double_quoted_string_repeat1,
  [1030] = 3,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(187), 1,
      sym_terminator,
    STATE(53), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [1041] = 3,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(189), 1,
      sym_terminator,
    STATE(58), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [1052] = 4,
    ACTIONS(191), 1,
      anon_sym_DQUOTE,
    ACTIONS(193), 1,
      aux_sym_double_quoted_string_token1,
    ACTIONS(195), 1,
      aux_sym_double_quoted_string_token2,
    STATE(59), 1,
      aux_sym_double_quoted_string_repeat1,
  [1065] = 4,
    ACTIONS(197), 1,
      aux_sym_double_quoted_string_token2,
    ACTIONS(200), 1,
      anon_sym_SQUOTE,
    ACTIONS(202), 1,
      aux_sym_single_quoted_string_token1,
    STATE(55), 1,
      aux_sym_single_quoted_string_repeat1,
  [1078] = 1,
    ACTIONS(205), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [1085] = 4,
    ACTIONS(207), 1,
      aux_sym_double_quoted_string_token2,
    ACTIONS(209), 1,
      anon_sym_SQUOTE,
    ACTIONS(211), 1,
      aux_sym_single_quoted_string_token1,
    STATE(60), 1,
      aux_sym_single_quoted_string_repeat1,
  [1098] = 3,
    ACTIONS(213), 1,
      sym_identifier,
    ACTIONS(216), 1,
      sym_terminator,
    STATE(58), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [1109] = 4,
    ACTIONS(218), 1,
      anon_sym_DQUOTE,
    ACTIONS(220), 1,
      aux_sym_double_quoted_string_token1,
    ACTIONS(222), 1,
      aux_sym_double_quoted_string_token2,
    STATE(51), 1,
      aux_sym_double_quoted_string_repeat1,
  [1122] = 4,
    ACTIONS(224), 1,
      aux_sym_double_quoted_string_token2,
    ACTIONS(226), 1,
      anon_sym_SQUOTE,
    ACTIONS(228), 1,
      aux_sym_single_quoted_string_token1,
    STATE(55), 1,
      aux_sym_single_quoted_string_repeat1,
  [1135] = 3,
    ACTIONS(112), 1,
      anon_sym_RPAREN,
    ACTIONS(230), 1,
      anon_sym_COMMA,
    STATE(61), 1,
      aux_sym_function_call_repeat1,
  [1145] = 3,
    ACTIONS(233), 1,
      anon_sym_,
    ACTIONS(235), 1,
      anon_sym_COLON,
    STATE(65), 1,
      aux_sym_query_tunings_repeat1,
  [1155] = 3,
    ACTIONS(237), 1,
      anon_sym_,
    ACTIONS(240), 1,
      anon_sym_COLON,
    STATE(63), 1,
      aux_sym_query_tunings_repeat1,
  [1165] = 3,
    ACTIONS(108), 1,
      anon_sym_COMMA,
    ACTIONS(242), 1,
      anon_sym_RPAREN,
    STATE(61), 1,
      aux_sym_function_call_repeat1,
  [1175] = 3,
    ACTIONS(233), 1,
      anon_sym_,
    ACTIONS(244), 1,
      anon_sym_COLON,
    STATE(63), 1,
      aux_sym_query_tunings_repeat1,
  [1185] = 1,
    ACTIONS(246), 3,
      anon_sym_EACH,
      anon_sym_FIRST,
      anon_sym_LAST,
  [1191] = 2,
    ACTIONS(240), 1,
      anon_sym_COLON,
    ACTIONS(248), 1,
      anon_sym_,
  [1198] = 2,
    ACTIONS(250), 1,
      anon_sym_VARIABLE,
    ACTIONS(252), 1,
      anon_sym_VAR,
  [1205] = 1,
    ACTIONS(254), 1,
      sym_terminator,
  [1209] = 1,
    ACTIONS(256), 1,
      anon_sym_COLON,
  [1213] = 1,
    ACTIONS(258), 1,
      anon_sym_AS,
  [1217] = 1,
    ACTIONS(260), 1,
      anon_sym_EQ,
  [1221] = 1,
    ACTIONS(262), 1,
      sym_identifier,
  [1225] = 1,
    ACTIONS(264), 1,
      anon_sym_COLON,
  [1229] = 1,
    ACTIONS(266), 1,
      sym_identifier,
  [1233] = 1,
    ACTIONS(268), 1,
      sym_terminator,
  [1237] = 1,
    ACTIONS(270), 1,
      ts_builtin_sym_end,
  [1241] = 1,
    ACTIONS(272), 1,
      sym_terminator,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 24,
  [SMALL_STATE(4)] = 45,
  [SMALL_STATE(5)] = 66,
  [SMALL_STATE(6)] = 87,
  [SMALL_STATE(7)] = 108,
  [SMALL_STATE(8)] = 129,
  [SMALL_STATE(9)] = 152,
  [SMALL_STATE(10)] = 173,
  [SMALL_STATE(11)] = 194,
  [SMALL_STATE(12)] = 215,
  [SMALL_STATE(13)] = 236,
  [SMALL_STATE(14)] = 269,
  [SMALL_STATE(15)] = 301,
  [SMALL_STATE(16)] = 333,
  [SMALL_STATE(17)] = 365,
  [SMALL_STATE(18)] = 397,
  [SMALL_STATE(19)] = 429,
  [SMALL_STATE(20)] = 453,
  [SMALL_STATE(21)] = 485,
  [SMALL_STATE(22)] = 517,
  [SMALL_STATE(23)] = 549,
  [SMALL_STATE(24)] = 581,
  [SMALL_STATE(25)] = 600,
  [SMALL_STATE(26)] = 628,
  [SMALL_STATE(27)] = 653,
  [SMALL_STATE(28)] = 678,
  [SMALL_STATE(29)] = 703,
  [SMALL_STATE(30)] = 728,
  [SMALL_STATE(31)] = 753,
  [SMALL_STATE(32)] = 773,
  [SMALL_STATE(33)] = 788,
  [SMALL_STATE(34)] = 803,
  [SMALL_STATE(35)] = 822,
  [SMALL_STATE(36)] = 834,
  [SMALL_STATE(37)] = 848,
  [SMALL_STATE(38)] = 860,
  [SMALL_STATE(39)] = 872,
  [SMALL_STATE(40)] = 884,
  [SMALL_STATE(41)] = 896,
  [SMALL_STATE(42)] = 908,
  [SMALL_STATE(43)] = 920,
  [SMALL_STATE(44)] = 932,
  [SMALL_STATE(45)] = 946,
  [SMALL_STATE(46)] = 958,
  [SMALL_STATE(47)] = 970,
  [SMALL_STATE(48)] = 982,
  [SMALL_STATE(49)] = 994,
  [SMALL_STATE(50)] = 1007,
  [SMALL_STATE(51)] = 1017,
  [SMALL_STATE(52)] = 1030,
  [SMALL_STATE(53)] = 1041,
  [SMALL_STATE(54)] = 1052,
  [SMALL_STATE(55)] = 1065,
  [SMALL_STATE(56)] = 1078,
  [SMALL_STATE(57)] = 1085,
  [SMALL_STATE(58)] = 1098,
  [SMALL_STATE(59)] = 1109,
  [SMALL_STATE(60)] = 1122,
  [SMALL_STATE(61)] = 1135,
  [SMALL_STATE(62)] = 1145,
  [SMALL_STATE(63)] = 1155,
  [SMALL_STATE(64)] = 1165,
  [SMALL_STATE(65)] = 1175,
  [SMALL_STATE(66)] = 1185,
  [SMALL_STATE(67)] = 1191,
  [SMALL_STATE(68)] = 1198,
  [SMALL_STATE(69)] = 1205,
  [SMALL_STATE(70)] = 1209,
  [SMALL_STATE(71)] = 1213,
  [SMALL_STATE(72)] = 1217,
  [SMALL_STATE(73)] = 1221,
  [SMALL_STATE(74)] = 1225,
  [SMALL_STATE(75)] = 1229,
  [SMALL_STATE(76)] = 1233,
  [SMALL_STATE(77)] = 1237,
  [SMALL_STATE(78)] = 1241,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(72),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(68),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(68),
  [11] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(66),
  [15] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression, 1),
  [17] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression, 1),
  [19] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [21] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [23] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [25] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [27] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [29] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 2),
  [31] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 2),
  [33] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 2),
  [35] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 2),
  [37] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [39] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [41] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comparison, 3, .production_id = 2),
  [43] = {.entry = {.count = 1, .reusable = false}}, SHIFT(29),
  [45] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [47] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string_literal, 1),
  [49] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string_literal, 1),
  [51] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 3),
  [53] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 3),
  [55] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 3),
  [57] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 3),
  [59] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2),
  [61] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(72),
  [64] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(68),
  [67] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(68),
  [70] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(52),
  [73] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(66),
  [76] = {.entry = {.count = 1, .reusable = true}}, SHIFT(46),
  [78] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [80] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [82] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 1),
  [84] = {.entry = {.count = 1, .reusable = true}}, SHIFT(37),
  [86] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [88] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 2, .production_id = 3),
  [90] = {.entry = {.count = 1, .reusable = true}}, SHIFT(48),
  [92] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [94] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [96] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_where_clause_repeat1, 2),
  [98] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [100] = {.entry = {.count = 1, .reusable = true}}, SHIFT(9),
  [102] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [104] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [106] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [108] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [110] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [112] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2),
  [114] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assignment, 3),
  [116] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [118] = {.entry = {.count = 1, .reusable = true}}, SHIFT(62),
  [120] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [122] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 2),
  [124] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 2),
  [126] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 3, .production_id = 6),
  [128] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [130] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [132] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_definition, 6, .production_id = 5),
  [134] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_definition, 6, .production_id = 5),
  [136] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 8, .production_id = 8),
  [138] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 8, .production_id = 8),
  [140] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 3),
  [142] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 3),
  [144] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 7),
  [146] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 7),
  [148] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_assignment, 2),
  [150] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_assignment, 2),
  [152] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_statement, 1),
  [154] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_statement, 1),
  [156] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_where_clause_repeat1, 2), SHIFT_REPEAT(30),
  [159] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [161] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [163] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [165] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [167] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 8),
  [169] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 8),
  [171] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [173] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [175] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [177] = {.entry = {.count = 1, .reusable = true}}, SHIFT(69),
  [179] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2),
  [181] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(51),
  [184] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(51),
  [187] = {.entry = {.count = 1, .reusable = true}}, SHIFT(35),
  [189] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [191] = {.entry = {.count = 1, .reusable = false}}, SHIFT(6),
  [193] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [195] = {.entry = {.count = 1, .reusable = false}}, SHIFT(59),
  [197] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(55),
  [200] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2),
  [202] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(55),
  [205] = {.entry = {.count = 1, .reusable = true}}, SHIFT(67),
  [207] = {.entry = {.count = 1, .reusable = false}}, SHIFT(60),
  [209] = {.entry = {.count = 1, .reusable = false}}, SHIFT(5),
  [211] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [213] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2), SHIFT_REPEAT(72),
  [216] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2),
  [218] = {.entry = {.count = 1, .reusable = false}}, SHIFT(12),
  [220] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [222] = {.entry = {.count = 1, .reusable = false}}, SHIFT(51),
  [224] = {.entry = {.count = 1, .reusable = false}}, SHIFT(55),
  [226] = {.entry = {.count = 1, .reusable = false}}, SHIFT(11),
  [228] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [230] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2), SHIFT_REPEAT(26),
  [233] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [235] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 1),
  [237] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2), SHIFT_REPEAT(56),
  [240] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [242] = {.entry = {.count = 1, .reusable = true}}, SHIFT(4),
  [244] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 2),
  [246] = {.entry = {.count = 1, .reusable = true}}, SHIFT(73),
  [248] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [250] = {.entry = {.count = 1, .reusable = true}}, SHIFT(75),
  [252] = {.entry = {.count = 1, .reusable = false}}, SHIFT(75),
  [254] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_primitive_type, 1),
  [256] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [258] = {.entry = {.count = 1, .reusable = true}}, SHIFT(50),
  [260] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [262] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
  [264] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [266] = {.entry = {.count = 1, .reusable = true}}, SHIFT(71),
  [268] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [270] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [272] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef _WIN32
#define extern __declspec(dllexport)
#endif

extern const TSLanguage *tree_sitter_abl(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .field_names = ts_field_names,
    .field_map_slices = ts_field_map_slices,
    .field_map_entries = ts_field_map_entries,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .keyword_lex_fn = ts_lex_keywords,
    .keyword_capture_token = sym_identifier,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
