#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 84
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 69
#define ALIAS_COUNT 0
#define TOKEN_COUNT 44
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
  anon_sym_SLASH_STAR = 9,
  aux_sym_comment_token1 = 10,
  aux_sym_comment_token2 = 11,
  anon_sym_STAR_SLASH = 12,
  anon_sym_LOGICAL = 13,
  anon_sym_INTEGER = 14,
  anon_sym_CHARACTER = 15,
  anon_sym_DECIMAL = 16,
  sym_number_literal = 17,
  anon_sym_DQUOTE = 18,
  aux_sym_double_quoted_string_token1 = 19,
  anon_sym_SQUOTE = 20,
  aux_sym_single_quoted_string_token1 = 21,
  anon_sym_DEFINE = 22,
  anon_sym_DEF = 23,
  anon_sym_VARIABLE = 24,
  anon_sym_VAR = 25,
  anon_sym_AS = 26,
  anon_sym_LPAREN = 27,
  anon_sym_COMMA = 28,
  anon_sym_RPAREN = 29,
  anon_sym_ASSIGN = 30,
  anon_sym_WHERE = 31,
  anon_sym_AND = 32,
  anon_sym_NO_DASHLOCK = 33,
  anon_sym_NO_DASHWAIT = 34,
  anon_sym_SHARE_DASHLOCK = 35,
  anon_sym_EXCLUSIVE_DASHLOCK = 36,
  anon_sym_ = 37,
  anon_sym_FOR = 38,
  anon_sym_EACH = 39,
  anon_sym_FIRST = 40,
  anon_sym_LAST = 41,
  anon_sym_COLON = 42,
  anon_sym_END_DOT = 43,
  sym_source_code = 44,
  sym_expression = 45,
  sym_comparison = 46,
  sym_statement = 47,
  sym_comment = 48,
  sym_primitive_type = 49,
  sym_string_literal = 50,
  sym_double_quoted_string = 51,
  sym_single_quoted_string = 52,
  sym_assignment = 53,
  sym_variable_definition = 54,
  sym_variable_assignment = 55,
  sym_function_call = 56,
  sym_assign_statement = 57,
  sym_where_clause = 58,
  sym_query_tunings = 59,
  sym_for_statement = 60,
  aux_sym_source_code_repeat1 = 61,
  aux_sym_comment_repeat1 = 62,
  aux_sym_double_quoted_string_repeat1 = 63,
  aux_sym_single_quoted_string_repeat1 = 64,
  aux_sym_function_call_repeat1 = 65,
  aux_sym_assign_statement_repeat1 = 66,
  aux_sym_where_clause_repeat1 = 67,
  aux_sym_query_tunings_repeat1 = 68,
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
  [anon_sym_SLASH_STAR] = "/*",
  [aux_sym_comment_token1] = "comment_token1",
  [aux_sym_comment_token2] = "comment_token2",
  [anon_sym_STAR_SLASH] = "*/",
  [anon_sym_LOGICAL] = "LOGICAL",
  [anon_sym_INTEGER] = "INTEGER",
  [anon_sym_CHARACTER] = "CHARACTER",
  [anon_sym_DECIMAL] = "DECIMAL",
  [sym_number_literal] = "number_literal",
  [anon_sym_DQUOTE] = "\"",
  [aux_sym_double_quoted_string_token1] = "double_quoted_string_token1",
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
  [sym_comment] = "comment",
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
  [aux_sym_comment_repeat1] = "comment_repeat1",
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
  [anon_sym_SLASH_STAR] = anon_sym_SLASH_STAR,
  [aux_sym_comment_token1] = aux_sym_comment_token1,
  [aux_sym_comment_token2] = aux_sym_comment_token2,
  [anon_sym_STAR_SLASH] = anon_sym_STAR_SLASH,
  [anon_sym_LOGICAL] = anon_sym_LOGICAL,
  [anon_sym_INTEGER] = anon_sym_INTEGER,
  [anon_sym_CHARACTER] = anon_sym_CHARACTER,
  [anon_sym_DECIMAL] = anon_sym_DECIMAL,
  [sym_number_literal] = sym_number_literal,
  [anon_sym_DQUOTE] = anon_sym_DQUOTE,
  [aux_sym_double_quoted_string_token1] = aux_sym_double_quoted_string_token1,
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
  [sym_comment] = sym_comment,
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
  [aux_sym_comment_repeat1] = aux_sym_comment_repeat1,
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
  [anon_sym_SLASH_STAR] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_comment_token1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_comment_token2] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_STAR_SLASH] = {
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
  [sym_comment] = {
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
  [aux_sym_comment_repeat1] = {
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
  [79] = 79,
  [80] = 80,
  [81] = 81,
  [82] = 82,
  [83] = 83,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(102);
      if (lookahead == '"') ADVANCE(121);
      if (lookahead == '\'') ADVANCE(124);
      if (lookahead == '(') ADVANCE(133);
      if (lookahead == ')') ADVANCE(135);
      if (lookahead == '*') ADVANCE(10);
      if (lookahead == ',') ADVANCE(134);
      if (lookahead == '.') ADVANCE(104);
      if (lookahead == '/') ADVANCE(5);
      if (lookahead == ':') ADVANCE(148);
      if (lookahead == '<') ADVANCE(105);
      if (lookahead == '=') ADVANCE(108);
      if (lookahead == '>') ADVANCE(109);
      if (lookahead == 'A') ADVANCE(69);
      if (lookahead == 'C') ADVANCE(50);
      if (lookahead == 'D') ADVANCE(33);
      if (lookahead == 'E') ADVANCE(11);
      if (lookahead == 'F') ADVANCE(52);
      if (lookahead == 'I') ADVANCE(70);
      if (lookahead == 'L') ADVANCE(12);
      if (lookahead == 'N') ADVANCE(74);
      if (lookahead == 'S') ADVANCE(51);
      if (lookahead == 'V') ADVANCE(15);
      if (lookahead == 'W') ADVANCE(49);
      if (lookahead == '\\') ADVANCE(100);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(120);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(103);
      END_STATE();
    case 1:
      if (lookahead == ' ') ADVANCE(143);
      if (lookahead == ':') ADVANCE(148);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r') SKIP(1)
      END_STATE();
    case 2:
      if (lookahead == '"') ADVANCE(121);
      if (lookahead == '\\') ADVANCE(100);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(122);
      if (lookahead != 0) ADVANCE(123);
      END_STATE();
    case 3:
      if (lookahead == '\'') ADVANCE(124);
      if (lookahead == '\\') ADVANCE(100);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(125);
      if (lookahead != 0) ADVANCE(126);
      END_STATE();
    case 4:
      if (lookahead == '*') ADVANCE(10);
      if (lookahead == '\\') ADVANCE(100);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(112);
      if (lookahead != 0 &&
          lookahead != '/') ADVANCE(113);
      END_STATE();
    case 5:
      if (lookahead == '*') ADVANCE(111);
      END_STATE();
    case 6:
      if (lookahead == '-') ADVANCE(64);
      END_STATE();
    case 7:
      if (lookahead == '-') ADVANCE(66);
      END_STATE();
    case 8:
      if (lookahead == '-') ADVANCE(67);
      END_STATE();
    case 9:
      if (lookahead == '.') ADVANCE(149);
      END_STATE();
    case 10:
      if (lookahead == '/') ADVANCE(115);
      END_STATE();
    case 11:
      if (lookahead == 'A') ADVANCE(27);
      if (lookahead == 'N') ADVANCE(32);
      if (lookahead == 'X') ADVANCE(23);
      END_STATE();
    case 12:
      if (lookahead == 'A') ADVANCE(89);
      if (lookahead == 'O') ADVANCE(46);
      END_STATE();
    case 13:
      if (lookahead == 'A') ADVANCE(22);
      END_STATE();
    case 14:
      if (lookahead == 'A') ADVANCE(62);
      END_STATE();
    case 15:
      if (lookahead == 'A') ADVANCE(80);
      END_STATE();
    case 16:
      if (lookahead == 'A') ADVANCE(63);
      END_STATE();
    case 17:
      if (lookahead == 'A') ADVANCE(30);
      END_STATE();
    case 18:
      if (lookahead == 'A') ADVANCE(83);
      END_STATE();
    case 19:
      if (lookahead == 'A') ADVANCE(57);
      END_STATE();
    case 20:
      if (lookahead == 'A') ADVANCE(84);
      END_STATE();
    case 21:
      if (lookahead == 'A') ADVANCE(88);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(21)
      END_STATE();
    case 22:
      if (lookahead == 'B') ADVANCE(65);
      END_STATE();
    case 23:
      if (lookahead == 'C') ADVANCE(61);
      END_STATE();
    case 24:
      if (lookahead == 'C') ADVANCE(58);
      END_STATE();
    case 25:
      if (lookahead == 'C') ADVANCE(53);
      if (lookahead == 'F') ADVANCE(128);
      END_STATE();
    case 26:
      if (lookahead == 'C') ADVANCE(59);
      END_STATE();
    case 27:
      if (lookahead == 'C') ADVANCE(48);
      END_STATE();
    case 28:
      if (lookahead == 'C') ADVANCE(60);
      END_STATE();
    case 29:
      if (lookahead == 'C') ADVANCE(16);
      END_STATE();
    case 30:
      if (lookahead == 'C') ADVANCE(97);
      END_STATE();
    case 31:
      if (lookahead == 'D') ADVANCE(138);
      END_STATE();
    case 32:
      if (lookahead == 'D') ADVANCE(9);
      END_STATE();
    case 33:
      if (lookahead == 'E') ADVANCE(25);
      END_STATE();
    case 34:
      if (lookahead == 'E') ADVANCE(137);
      END_STATE();
    case 35:
      if (lookahead == 'E') ADVANCE(127);
      END_STATE();
    case 36:
      if (lookahead == 'E') ADVANCE(129);
      END_STATE();
    case 37:
      if (lookahead == 'E') ADVANCE(44);
      END_STATE();
    case 38:
      if (lookahead == 'E') ADVANCE(7);
      END_STATE();
    case 39:
      if (lookahead == 'E') ADVANCE(47);
      END_STATE();
    case 40:
      if (lookahead == 'E') ADVANCE(85);
      END_STATE();
    case 41:
      if (lookahead == 'E') ADVANCE(81);
      END_STATE();
    case 42:
      if (lookahead == 'E') ADVANCE(82);
      END_STATE();
    case 43:
      if (lookahead == 'E') ADVANCE(8);
      END_STATE();
    case 44:
      if (lookahead == 'F') ADVANCE(128);
      END_STATE();
    case 45:
      if (lookahead == 'G') ADVANCE(71);
      END_STATE();
    case 46:
      if (lookahead == 'G') ADVANCE(56);
      END_STATE();
    case 47:
      if (lookahead == 'G') ADVANCE(41);
      END_STATE();
    case 48:
      if (lookahead == 'H') ADVANCE(145);
      END_STATE();
    case 49:
      if (lookahead == 'H') ADVANCE(40);
      END_STATE();
    case 50:
      if (lookahead == 'H') ADVANCE(18);
      END_STATE();
    case 51:
      if (lookahead == 'H') ADVANCE(20);
      END_STATE();
    case 52:
      if (lookahead == 'I') ADVANCE(86);
      if (lookahead == 'O') ADVANCE(79);
      END_STATE();
    case 53:
      if (lookahead == 'I') ADVANCE(68);
      END_STATE();
    case 54:
      if (lookahead == 'I') ADVANCE(99);
      END_STATE();
    case 55:
      if (lookahead == 'I') ADVANCE(45);
      END_STATE();
    case 56:
      if (lookahead == 'I') ADVANCE(29);
      END_STATE();
    case 57:
      if (lookahead == 'I') ADVANCE(95);
      END_STATE();
    case 58:
      if (lookahead == 'K') ADVANCE(139);
      END_STATE();
    case 59:
      if (lookahead == 'K') ADVANCE(141);
      END_STATE();
    case 60:
      if (lookahead == 'K') ADVANCE(142);
      END_STATE();
    case 61:
      if (lookahead == 'L') ADVANCE(98);
      END_STATE();
    case 62:
      if (lookahead == 'L') ADVANCE(119);
      END_STATE();
    case 63:
      if (lookahead == 'L') ADVANCE(116);
      END_STATE();
    case 64:
      if (lookahead == 'L') ADVANCE(76);
      if (lookahead == 'W') ADVANCE(19);
      END_STATE();
    case 65:
      if (lookahead == 'L') ADVANCE(36);
      END_STATE();
    case 66:
      if (lookahead == 'L') ADVANCE(77);
      END_STATE();
    case 67:
      if (lookahead == 'L') ADVANCE(78);
      END_STATE();
    case 68:
      if (lookahead == 'M') ADVANCE(14);
      END_STATE();
    case 69:
      if (lookahead == 'N') ADVANCE(31);
      if (lookahead == 'S') ADVANCE(132);
      END_STATE();
    case 70:
      if (lookahead == 'N') ADVANCE(96);
      END_STATE();
    case 71:
      if (lookahead == 'N') ADVANCE(136);
      END_STATE();
    case 72:
      if (lookahead == 'N') ADVANCE(32);
      END_STATE();
    case 73:
      if (lookahead == 'N') ADVANCE(35);
      END_STATE();
    case 74:
      if (lookahead == 'O') ADVANCE(6);
      END_STATE();
    case 75:
      if (lookahead == 'O') ADVANCE(79);
      END_STATE();
    case 76:
      if (lookahead == 'O') ADVANCE(24);
      END_STATE();
    case 77:
      if (lookahead == 'O') ADVANCE(26);
      END_STATE();
    case 78:
      if (lookahead == 'O') ADVANCE(28);
      END_STATE();
    case 79:
      if (lookahead == 'R') ADVANCE(144);
      END_STATE();
    case 80:
      if (lookahead == 'R') ADVANCE(130);
      END_STATE();
    case 81:
      if (lookahead == 'R') ADVANCE(117);
      END_STATE();
    case 82:
      if (lookahead == 'R') ADVANCE(118);
      END_STATE();
    case 83:
      if (lookahead == 'R') ADVANCE(17);
      END_STATE();
    case 84:
      if (lookahead == 'R') ADVANCE(38);
      END_STATE();
    case 85:
      if (lookahead == 'R') ADVANCE(34);
      END_STATE();
    case 86:
      if (lookahead == 'R') ADVANCE(90);
      END_STATE();
    case 87:
      if (lookahead == 'S') ADVANCE(55);
      END_STATE();
    case 88:
      if (lookahead == 'S') ADVANCE(131);
      END_STATE();
    case 89:
      if (lookahead == 'S') ADVANCE(93);
      END_STATE();
    case 90:
      if (lookahead == 'S') ADVANCE(94);
      END_STATE();
    case 91:
      if (lookahead == 'S') ADVANCE(87);
      END_STATE();
    case 92:
      if (lookahead == 'S') ADVANCE(54);
      END_STATE();
    case 93:
      if (lookahead == 'T') ADVANCE(147);
      END_STATE();
    case 94:
      if (lookahead == 'T') ADVANCE(146);
      END_STATE();
    case 95:
      if (lookahead == 'T') ADVANCE(140);
      END_STATE();
    case 96:
      if (lookahead == 'T') ADVANCE(39);
      END_STATE();
    case 97:
      if (lookahead == 'T') ADVANCE(42);
      END_STATE();
    case 98:
      if (lookahead == 'U') ADVANCE(92);
      END_STATE();
    case 99:
      if (lookahead == 'V') ADVANCE(43);
      END_STATE();
    case 100:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(114);
      END_STATE();
    case 101:
      if (eof) ADVANCE(102);
      if (lookahead == '/') ADVANCE(5);
      if (lookahead == 'A') ADVANCE(91);
      if (lookahead == 'D') ADVANCE(37);
      if (lookahead == 'E') ADVANCE(72);
      if (lookahead == 'F') ADVANCE(75);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(101)
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(103);
      END_STATE();
    case 102:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 103:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(103);
      END_STATE();
    case 104:
      ACCEPT_TOKEN(sym_terminator);
      END_STATE();
    case 105:
      ACCEPT_TOKEN(anon_sym_LT);
      if (lookahead == '=') ADVANCE(106);
      if (lookahead == '>') ADVANCE(107);
      END_STATE();
    case 106:
      ACCEPT_TOKEN(anon_sym_LT_EQ);
      END_STATE();
    case 107:
      ACCEPT_TOKEN(anon_sym_LT_GT);
      END_STATE();
    case 108:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 109:
      ACCEPT_TOKEN(anon_sym_GT);
      if (lookahead == '=') ADVANCE(110);
      END_STATE();
    case 110:
      ACCEPT_TOKEN(anon_sym_GT_EQ);
      END_STATE();
    case 111:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      END_STATE();
    case 112:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(112);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(113);
      END_STATE();
    case 113:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(113);
      END_STATE();
    case 114:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      END_STATE();
    case 115:
      ACCEPT_TOKEN(anon_sym_STAR_SLASH);
      END_STATE();
    case 116:
      ACCEPT_TOKEN(anon_sym_LOGICAL);
      END_STATE();
    case 117:
      ACCEPT_TOKEN(anon_sym_INTEGER);
      END_STATE();
    case 118:
      ACCEPT_TOKEN(anon_sym_CHARACTER);
      END_STATE();
    case 119:
      ACCEPT_TOKEN(anon_sym_DECIMAL);
      END_STATE();
    case 120:
      ACCEPT_TOKEN(sym_number_literal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(120);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(anon_sym_DQUOTE);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(122);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(123);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(123);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(anon_sym_SQUOTE);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(125);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(126);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(126);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(anon_sym_DEFINE);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(anon_sym_DEF);
      if (lookahead == 'I') ADVANCE(73);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(anon_sym_VARIABLE);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(anon_sym_VAR);
      if (lookahead == 'I') ADVANCE(13);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(anon_sym_AS);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(anon_sym_AS);
      if (lookahead == 'S') ADVANCE(55);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(anon_sym_ASSIGN);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(anon_sym_WHERE);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_AND);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_NO_DASHLOCK);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(anon_sym_NO_DASHWAIT);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_SHARE_DASHLOCK);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(anon_sym_EXCLUSIVE_DASHLOCK);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(anon_sym_);
      if (lookahead == ' ') ADVANCE(143);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(anon_sym_FOR);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(anon_sym_EACH);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(anon_sym_FIRST);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(anon_sym_LAST);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 149:
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
  [1] = {.lex_state = 101},
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
  [13] = {.lex_state = 101},
  [14] = {.lex_state = 101},
  [15] = {.lex_state = 101},
  [16] = {.lex_state = 101},
  [17] = {.lex_state = 101},
  [18] = {.lex_state = 101},
  [19] = {.lex_state = 101},
  [20] = {.lex_state = 101},
  [21] = {.lex_state = 101},
  [22] = {.lex_state = 101},
  [23] = {.lex_state = 0},
  [24] = {.lex_state = 0},
  [25] = {.lex_state = 0},
  [26] = {.lex_state = 0},
  [27] = {.lex_state = 0},
  [28] = {.lex_state = 0},
  [29] = {.lex_state = 0},
  [30] = {.lex_state = 0},
  [31] = {.lex_state = 0},
  [32] = {.lex_state = 101},
  [33] = {.lex_state = 101},
  [34] = {.lex_state = 101},
  [35] = {.lex_state = 101},
  [36] = {.lex_state = 101},
  [37] = {.lex_state = 0},
  [38] = {.lex_state = 101},
  [39] = {.lex_state = 101},
  [40] = {.lex_state = 0},
  [41] = {.lex_state = 101},
  [42] = {.lex_state = 101},
  [43] = {.lex_state = 101},
  [44] = {.lex_state = 101},
  [45] = {.lex_state = 101},
  [46] = {.lex_state = 0},
  [47] = {.lex_state = 101},
  [48] = {.lex_state = 101},
  [49] = {.lex_state = 0},
  [50] = {.lex_state = 0},
  [51] = {.lex_state = 0},
  [52] = {.lex_state = 0},
  [53] = {.lex_state = 2},
  [54] = {.lex_state = 0},
  [55] = {.lex_state = 4},
  [56] = {.lex_state = 3},
  [57] = {.lex_state = 0},
  [58] = {.lex_state = 0},
  [59] = {.lex_state = 2},
  [60] = {.lex_state = 3},
  [61] = {.lex_state = 0},
  [62] = {.lex_state = 2},
  [63] = {.lex_state = 3},
  [64] = {.lex_state = 4},
  [65] = {.lex_state = 4},
  [66] = {.lex_state = 1},
  [67] = {.lex_state = 1},
  [68] = {.lex_state = 0},
  [69] = {.lex_state = 0},
  [70] = {.lex_state = 1},
  [71] = {.lex_state = 0},
  [72] = {.lex_state = 1},
  [73] = {.lex_state = 0},
  [74] = {.lex_state = 0},
  [75] = {.lex_state = 0},
  [76] = {.lex_state = 0},
  [77] = {.lex_state = 0},
  [78] = {.lex_state = 0},
  [79] = {.lex_state = 0},
  [80] = {.lex_state = 0},
  [81] = {.lex_state = 0},
  [82] = {.lex_state = 0},
  [83] = {.lex_state = 21},
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
    [anon_sym_SLASH_STAR] = ACTIONS(1),
    [aux_sym_comment_token2] = ACTIONS(1),
    [anon_sym_STAR_SLASH] = ACTIONS(1),
    [anon_sym_LOGICAL] = ACTIONS(1),
    [anon_sym_INTEGER] = ACTIONS(1),
    [anon_sym_CHARACTER] = ACTIONS(1),
    [anon_sym_DECIMAL] = ACTIONS(1),
    [sym_number_literal] = ACTIONS(1),
    [anon_sym_DQUOTE] = ACTIONS(1),
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
    [sym_source_code] = STATE(75),
    [sym_statement] = STATE(20),
    [sym_comment] = STATE(33),
    [sym_assignment] = STATE(77),
    [sym_variable_definition] = STATE(33),
    [sym_variable_assignment] = STATE(33),
    [sym_assign_statement] = STATE(33),
    [sym_for_statement] = STATE(33),
    [aux_sym_source_code_repeat1] = STATE(20),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_identifier] = ACTIONS(5),
    [anon_sym_SLASH_STAR] = ACTIONS(7),
    [anon_sym_DEFINE] = ACTIONS(9),
    [anon_sym_DEF] = ACTIONS(11),
    [anon_sym_ASSIGN] = ACTIONS(13),
    [anon_sym_FOR] = ACTIONS(15),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 3,
    ACTIONS(21), 1,
      anon_sym_LPAREN,
    ACTIONS(19), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(17), 14,
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
  [24] = 3,
    ACTIONS(25), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(27), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(23), 10,
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
  [47] = 2,
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
  [68] = 2,
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
  [89] = 2,
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
  [110] = 2,
    ACTIONS(43), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(41), 14,
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
  [131] = 2,
    ACTIONS(47), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(45), 14,
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
  [152] = 2,
    ACTIONS(51), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(49), 14,
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
    ACTIONS(19), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(17), 14,
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
    ACTIONS(55), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(53), 14,
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
    ACTIONS(59), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(57), 14,
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
  [236] = 10,
    ACTIONS(63), 1,
      sym_identifier,
    ACTIONS(66), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(69), 1,
      anon_sym_DEFINE,
    ACTIONS(72), 1,
      anon_sym_DEF,
    ACTIONS(75), 1,
      anon_sym_ASSIGN,
    ACTIONS(78), 1,
      anon_sym_FOR,
    STATE(77), 1,
      sym_assignment,
    ACTIONS(61), 2,
      ts_builtin_sym_end,
      anon_sym_END_DOT,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [273] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(81), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(17), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [309] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(83), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(21), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [345] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(83), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [381] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(85), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [417] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(87), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [453] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(89), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(16), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [489] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(91), 1,
      ts_builtin_sym_end,
    STATE(77), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [525] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(93), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [561] = 10,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_ASSIGN,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(95), 1,
      anon_sym_END_DOT,
    STATE(77), 1,
      sym_assignment,
    STATE(18), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(33), 5,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_assign_statement,
      sym_for_statement,
  [597] = 5,
    ACTIONS(97), 1,
      anon_sym_AND,
    STATE(49), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(25), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(27), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(99), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [621] = 3,
    ACTIONS(25), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(27), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(101), 6,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [640] = 8,
    ACTIONS(103), 1,
      sym_identifier,
    ACTIONS(105), 1,
      sym_number_literal,
    ACTIONS(107), 1,
      anon_sym_DQUOTE,
    ACTIONS(109), 1,
      anon_sym_SQUOTE,
    ACTIONS(111), 1,
      anon_sym_RPAREN,
    STATE(31), 1,
      sym_expression,
    STATE(7), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(10), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [668] = 7,
    ACTIONS(103), 1,
      sym_identifier,
    ACTIONS(105), 1,
      sym_number_literal,
    ACTIONS(107), 1,
      anon_sym_DQUOTE,
    ACTIONS(109), 1,
      anon_sym_SQUOTE,
    STATE(24), 1,
      sym_expression,
    STATE(7), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(10), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [693] = 7,
    ACTIONS(103), 1,
      sym_identifier,
    ACTIONS(105), 1,
      sym_number_literal,
    ACTIONS(107), 1,
      anon_sym_DQUOTE,
    ACTIONS(109), 1,
      anon_sym_SQUOTE,
    STATE(46), 1,
      sym_expression,
    STATE(7), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(10), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [718] = 7,
    ACTIONS(103), 1,
      sym_identifier,
    ACTIONS(105), 1,
      sym_number_literal,
    ACTIONS(107), 1,
      anon_sym_DQUOTE,
    ACTIONS(109), 1,
      anon_sym_SQUOTE,
    STATE(40), 1,
      sym_expression,
    STATE(7), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(10), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [743] = 7,
    ACTIONS(103), 1,
      sym_identifier,
    ACTIONS(105), 1,
      sym_number_literal,
    ACTIONS(107), 1,
      anon_sym_DQUOTE,
    ACTIONS(109), 1,
      anon_sym_SQUOTE,
    STATE(23), 1,
      sym_expression,
    STATE(7), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(10), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [768] = 7,
    ACTIONS(103), 1,
      sym_identifier,
    ACTIONS(105), 1,
      sym_number_literal,
    ACTIONS(107), 1,
      anon_sym_DQUOTE,
    ACTIONS(109), 1,
      anon_sym_SQUOTE,
    STATE(3), 1,
      sym_expression,
    STATE(7), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(10), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [793] = 5,
    ACTIONS(113), 1,
      anon_sym_COMMA,
    ACTIONS(115), 1,
      anon_sym_RPAREN,
    STATE(68), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(25), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(27), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [813] = 2,
    ACTIONS(119), 1,
      anon_sym_DEF,
    ACTIONS(117), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [826] = 2,
    ACTIONS(123), 1,
      anon_sym_DEF,
    ACTIONS(121), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [839] = 2,
    ACTIONS(127), 1,
      anon_sym_DEF,
    ACTIONS(125), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [852] = 2,
    ACTIONS(131), 1,
      anon_sym_DEF,
    ACTIONS(129), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [865] = 2,
    ACTIONS(135), 1,
      anon_sym_DEF,
    ACTIONS(133), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [878] = 5,
    ACTIONS(137), 1,
      anon_sym_WHERE,
    ACTIONS(141), 1,
      anon_sym_COLON,
    STATE(51), 1,
      sym_where_clause,
    STATE(78), 1,
      sym_query_tunings,
    ACTIONS(139), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [897] = 2,
    ACTIONS(145), 1,
      anon_sym_DEF,
    ACTIONS(143), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [910] = 2,
    ACTIONS(149), 1,
      anon_sym_DEF,
    ACTIONS(147), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [923] = 3,
    ACTIONS(25), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(151), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
    ACTIONS(27), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [938] = 2,
    ACTIONS(155), 1,
      anon_sym_DEF,
    ACTIONS(153), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [951] = 2,
    ACTIONS(159), 1,
      anon_sym_DEF,
    ACTIONS(157), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [964] = 2,
    ACTIONS(163), 1,
      anon_sym_DEF,
    ACTIONS(161), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [977] = 2,
    ACTIONS(167), 1,
      anon_sym_DEF,
    ACTIONS(165), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [990] = 2,
    ACTIONS(171), 1,
      anon_sym_DEF,
    ACTIONS(169), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [1003] = 3,
    ACTIONS(25), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(173), 2,
      sym_identifier,
      sym_terminator,
    ACTIONS(27), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [1018] = 2,
    ACTIONS(177), 1,
      anon_sym_DEF,
    ACTIONS(175), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [1031] = 2,
    ACTIONS(181), 1,
      anon_sym_DEF,
    ACTIONS(179), 7,
      ts_builtin_sym_end,
      sym_identifier,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_FOR,
      anon_sym_END_DOT,
  [1044] = 3,
    ACTIONS(97), 1,
      anon_sym_AND,
    STATE(50), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(183), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1058] = 3,
    ACTIONS(185), 1,
      anon_sym_AND,
    STATE(50), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(101), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1072] = 3,
    ACTIONS(188), 1,
      anon_sym_COLON,
    STATE(81), 1,
      sym_query_tunings,
    ACTIONS(139), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [1085] = 2,
    STATE(82), 1,
      sym_primitive_type,
    ACTIONS(190), 4,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
  [1095] = 4,
    ACTIONS(192), 1,
      aux_sym_comment_token2,
    ACTIONS(194), 1,
      anon_sym_DQUOTE,
    ACTIONS(196), 1,
      aux_sym_double_quoted_string_token1,
    STATE(62), 1,
      aux_sym_double_quoted_string_repeat1,
  [1108] = 3,
    ACTIONS(198), 1,
      sym_identifier,
    ACTIONS(201), 1,
      sym_terminator,
    STATE(54), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [1119] = 4,
    ACTIONS(203), 1,
      aux_sym_comment_token1,
    ACTIONS(205), 1,
      aux_sym_comment_token2,
    ACTIONS(207), 1,
      anon_sym_STAR_SLASH,
    STATE(64), 1,
      aux_sym_comment_repeat1,
  [1132] = 4,
    ACTIONS(209), 1,
      aux_sym_comment_token2,
    ACTIONS(211), 1,
      anon_sym_SQUOTE,
    ACTIONS(213), 1,
      aux_sym_single_quoted_string_token1,
    STATE(63), 1,
      aux_sym_single_quoted_string_repeat1,
  [1145] = 1,
    ACTIONS(215), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [1152] = 3,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(217), 1,
      sym_terminator,
    STATE(61), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [1163] = 4,
    ACTIONS(219), 1,
      aux_sym_comment_token2,
    ACTIONS(222), 1,
      anon_sym_DQUOTE,
    ACTIONS(224), 1,
      aux_sym_double_quoted_string_token1,
    STATE(59), 1,
      aux_sym_double_quoted_string_repeat1,
  [1176] = 4,
    ACTIONS(227), 1,
      aux_sym_comment_token2,
    ACTIONS(230), 1,
      anon_sym_SQUOTE,
    ACTIONS(232), 1,
      aux_sym_single_quoted_string_token1,
    STATE(60), 1,
      aux_sym_single_quoted_string_repeat1,
  [1189] = 3,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(235), 1,
      sym_terminator,
    STATE(54), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [1200] = 4,
    ACTIONS(237), 1,
      aux_sym_comment_token2,
    ACTIONS(239), 1,
      anon_sym_DQUOTE,
    ACTIONS(241), 1,
      aux_sym_double_quoted_string_token1,
    STATE(59), 1,
      aux_sym_double_quoted_string_repeat1,
  [1213] = 4,
    ACTIONS(243), 1,
      aux_sym_comment_token2,
    ACTIONS(245), 1,
      anon_sym_SQUOTE,
    ACTIONS(247), 1,
      aux_sym_single_quoted_string_token1,
    STATE(60), 1,
      aux_sym_single_quoted_string_repeat1,
  [1226] = 4,
    ACTIONS(249), 1,
      aux_sym_comment_token1,
    ACTIONS(251), 1,
      aux_sym_comment_token2,
    ACTIONS(253), 1,
      anon_sym_STAR_SLASH,
    STATE(65), 1,
      aux_sym_comment_repeat1,
  [1239] = 4,
    ACTIONS(255), 1,
      aux_sym_comment_token1,
    ACTIONS(258), 1,
      aux_sym_comment_token2,
    ACTIONS(261), 1,
      anon_sym_STAR_SLASH,
    STATE(65), 1,
      aux_sym_comment_repeat1,
  [1252] = 3,
    ACTIONS(263), 1,
      anon_sym_,
    ACTIONS(265), 1,
      anon_sym_COLON,
    STATE(67), 1,
      aux_sym_query_tunings_repeat1,
  [1262] = 3,
    ACTIONS(267), 1,
      anon_sym_,
    ACTIONS(270), 1,
      anon_sym_COLON,
    STATE(67), 1,
      aux_sym_query_tunings_repeat1,
  [1272] = 3,
    ACTIONS(113), 1,
      anon_sym_COMMA,
    ACTIONS(272), 1,
      anon_sym_RPAREN,
    STATE(69), 1,
      aux_sym_function_call_repeat1,
  [1282] = 3,
    ACTIONS(151), 1,
      anon_sym_RPAREN,
    ACTIONS(274), 1,
      anon_sym_COMMA,
    STATE(69), 1,
      aux_sym_function_call_repeat1,
  [1292] = 3,
    ACTIONS(263), 1,
      anon_sym_,
    ACTIONS(277), 1,
      anon_sym_COLON,
    STATE(66), 1,
      aux_sym_query_tunings_repeat1,
  [1302] = 1,
    ACTIONS(279), 3,
      anon_sym_EACH,
      anon_sym_FIRST,
      anon_sym_LAST,
  [1308] = 2,
    ACTIONS(270), 1,
      anon_sym_COLON,
    ACTIONS(281), 1,
      anon_sym_,
  [1315] = 2,
    ACTIONS(283), 1,
      anon_sym_VARIABLE,
    ACTIONS(285), 1,
      anon_sym_VAR,
  [1322] = 1,
    ACTIONS(287), 1,
      sym_identifier,
  [1326] = 1,
    ACTIONS(289), 1,
      ts_builtin_sym_end,
  [1330] = 1,
    ACTIONS(291), 1,
      sym_terminator,
  [1334] = 1,
    ACTIONS(293), 1,
      sym_terminator,
  [1338] = 1,
    ACTIONS(295), 1,
      anon_sym_COLON,
  [1342] = 1,
    ACTIONS(297), 1,
      sym_identifier,
  [1346] = 1,
    ACTIONS(299), 1,
      anon_sym_EQ,
  [1350] = 1,
    ACTIONS(301), 1,
      anon_sym_COLON,
  [1354] = 1,
    ACTIONS(303), 1,
      sym_terminator,
  [1358] = 1,
    ACTIONS(305), 1,
      anon_sym_AS,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 24,
  [SMALL_STATE(4)] = 47,
  [SMALL_STATE(5)] = 68,
  [SMALL_STATE(6)] = 89,
  [SMALL_STATE(7)] = 110,
  [SMALL_STATE(8)] = 131,
  [SMALL_STATE(9)] = 152,
  [SMALL_STATE(10)] = 173,
  [SMALL_STATE(11)] = 194,
  [SMALL_STATE(12)] = 215,
  [SMALL_STATE(13)] = 236,
  [SMALL_STATE(14)] = 273,
  [SMALL_STATE(15)] = 309,
  [SMALL_STATE(16)] = 345,
  [SMALL_STATE(17)] = 381,
  [SMALL_STATE(18)] = 417,
  [SMALL_STATE(19)] = 453,
  [SMALL_STATE(20)] = 489,
  [SMALL_STATE(21)] = 525,
  [SMALL_STATE(22)] = 561,
  [SMALL_STATE(23)] = 597,
  [SMALL_STATE(24)] = 621,
  [SMALL_STATE(25)] = 640,
  [SMALL_STATE(26)] = 668,
  [SMALL_STATE(27)] = 693,
  [SMALL_STATE(28)] = 718,
  [SMALL_STATE(29)] = 743,
  [SMALL_STATE(30)] = 768,
  [SMALL_STATE(31)] = 793,
  [SMALL_STATE(32)] = 813,
  [SMALL_STATE(33)] = 826,
  [SMALL_STATE(34)] = 839,
  [SMALL_STATE(35)] = 852,
  [SMALL_STATE(36)] = 865,
  [SMALL_STATE(37)] = 878,
  [SMALL_STATE(38)] = 897,
  [SMALL_STATE(39)] = 910,
  [SMALL_STATE(40)] = 923,
  [SMALL_STATE(41)] = 938,
  [SMALL_STATE(42)] = 951,
  [SMALL_STATE(43)] = 964,
  [SMALL_STATE(44)] = 977,
  [SMALL_STATE(45)] = 990,
  [SMALL_STATE(46)] = 1003,
  [SMALL_STATE(47)] = 1018,
  [SMALL_STATE(48)] = 1031,
  [SMALL_STATE(49)] = 1044,
  [SMALL_STATE(50)] = 1058,
  [SMALL_STATE(51)] = 1072,
  [SMALL_STATE(52)] = 1085,
  [SMALL_STATE(53)] = 1095,
  [SMALL_STATE(54)] = 1108,
  [SMALL_STATE(55)] = 1119,
  [SMALL_STATE(56)] = 1132,
  [SMALL_STATE(57)] = 1145,
  [SMALL_STATE(58)] = 1152,
  [SMALL_STATE(59)] = 1163,
  [SMALL_STATE(60)] = 1176,
  [SMALL_STATE(61)] = 1189,
  [SMALL_STATE(62)] = 1200,
  [SMALL_STATE(63)] = 1213,
  [SMALL_STATE(64)] = 1226,
  [SMALL_STATE(65)] = 1239,
  [SMALL_STATE(66)] = 1252,
  [SMALL_STATE(67)] = 1262,
  [SMALL_STATE(68)] = 1272,
  [SMALL_STATE(69)] = 1282,
  [SMALL_STATE(70)] = 1292,
  [SMALL_STATE(71)] = 1302,
  [SMALL_STATE(72)] = 1308,
  [SMALL_STATE(73)] = 1315,
  [SMALL_STATE(74)] = 1322,
  [SMALL_STATE(75)] = 1326,
  [SMALL_STATE(76)] = 1330,
  [SMALL_STATE(77)] = 1334,
  [SMALL_STATE(78)] = 1338,
  [SMALL_STATE(79)] = 1342,
  [SMALL_STATE(80)] = 1346,
  [SMALL_STATE(81)] = 1350,
  [SMALL_STATE(82)] = 1354,
  [SMALL_STATE(83)] = 1358,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(80),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(73),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(73),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(71),
  [17] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression, 1),
  [19] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression, 1),
  [21] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [23] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comparison, 3, .production_id = 2),
  [25] = {.entry = {.count = 1, .reusable = false}}, SHIFT(30),
  [27] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [29] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 2),
  [31] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 2),
  [33] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [35] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [37] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [39] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [41] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string_literal, 1),
  [43] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string_literal, 1),
  [45] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 3),
  [47] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 3),
  [49] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 3),
  [51] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 3),
  [53] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 2),
  [55] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 2),
  [57] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [59] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [61] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2),
  [63] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(80),
  [66] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(55),
  [69] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(73),
  [72] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(73),
  [75] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(58),
  [78] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(71),
  [81] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [83] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [85] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [87] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
  [89] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [91] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 1),
  [93] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [95] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [97] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [99] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 2, .production_id = 3),
  [101] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_where_clause_repeat1, 2),
  [103] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [105] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [107] = {.entry = {.count = 1, .reusable = true}}, SHIFT(53),
  [109] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [111] = {.entry = {.count = 1, .reusable = true}}, SHIFT(6),
  [113] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [115] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [117] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_definition, 6, .production_id = 5),
  [119] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_definition, 6, .production_id = 5),
  [121] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_statement, 1),
  [123] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_statement, 1),
  [125] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 8, .production_id = 8),
  [127] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 8, .production_id = 8),
  [129] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 3),
  [131] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 3),
  [133] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [135] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [137] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [139] = {.entry = {.count = 1, .reusable = true}}, SHIFT(70),
  [141] = {.entry = {.count = 1, .reusable = true}}, SHIFT(19),
  [143] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 8),
  [145] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 8),
  [147] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [149] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [151] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2),
  [153] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 7),
  [155] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 7),
  [157] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [159] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [161] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 2),
  [163] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comment, 2),
  [165] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 2),
  [167] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 2),
  [169] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 3),
  [171] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comment, 3),
  [173] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assignment, 3),
  [175] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [177] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [179] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_assignment, 2),
  [181] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_assignment, 2),
  [183] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 3, .production_id = 6),
  [185] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_where_clause_repeat1, 2), SHIFT_REPEAT(26),
  [188] = {.entry = {.count = 1, .reusable = true}}, SHIFT(15),
  [190] = {.entry = {.count = 1, .reusable = true}}, SHIFT(76),
  [192] = {.entry = {.count = 1, .reusable = false}}, SHIFT(62),
  [194] = {.entry = {.count = 1, .reusable = false}}, SHIFT(4),
  [196] = {.entry = {.count = 1, .reusable = true}}, SHIFT(62),
  [198] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2), SHIFT_REPEAT(80),
  [201] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2),
  [203] = {.entry = {.count = 1, .reusable = true}}, SHIFT(64),
  [205] = {.entry = {.count = 1, .reusable = false}}, SHIFT(64),
  [207] = {.entry = {.count = 1, .reusable = false}}, SHIFT(43),
  [209] = {.entry = {.count = 1, .reusable = false}}, SHIFT(63),
  [211] = {.entry = {.count = 1, .reusable = false}}, SHIFT(11),
  [213] = {.entry = {.count = 1, .reusable = true}}, SHIFT(63),
  [215] = {.entry = {.count = 1, .reusable = true}}, SHIFT(72),
  [217] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [219] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(59),
  [222] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2),
  [224] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(59),
  [227] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(60),
  [230] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2),
  [232] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(60),
  [235] = {.entry = {.count = 1, .reusable = true}}, SHIFT(35),
  [237] = {.entry = {.count = 1, .reusable = false}}, SHIFT(59),
  [239] = {.entry = {.count = 1, .reusable = false}}, SHIFT(8),
  [241] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [243] = {.entry = {.count = 1, .reusable = false}}, SHIFT(60),
  [245] = {.entry = {.count = 1, .reusable = false}}, SHIFT(9),
  [247] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [249] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [251] = {.entry = {.count = 1, .reusable = false}}, SHIFT(65),
  [253] = {.entry = {.count = 1, .reusable = false}}, SHIFT(45),
  [255] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(65),
  [258] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(65),
  [261] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2),
  [263] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [265] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 2),
  [267] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2), SHIFT_REPEAT(57),
  [270] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [272] = {.entry = {.count = 1, .reusable = true}}, SHIFT(5),
  [274] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2), SHIFT_REPEAT(28),
  [277] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 1),
  [279] = {.entry = {.count = 1, .reusable = true}}, SHIFT(74),
  [281] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [283] = {.entry = {.count = 1, .reusable = true}}, SHIFT(79),
  [285] = {.entry = {.count = 1, .reusable = false}}, SHIFT(79),
  [287] = {.entry = {.count = 1, .reusable = true}}, SHIFT(37),
  [289] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [291] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_primitive_type, 1),
  [293] = {.entry = {.count = 1, .reusable = true}}, SHIFT(48),
  [295] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [297] = {.entry = {.count = 1, .reusable = true}}, SHIFT(83),
  [299] = {.entry = {.count = 1, .reusable = true}}, SHIFT(27),
  [301] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [303] = {.entry = {.count = 1, .reusable = true}}, SHIFT(32),
  [305] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
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
