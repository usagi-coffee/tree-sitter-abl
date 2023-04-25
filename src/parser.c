#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 131
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 86
#define ALIAS_COUNT 0
#define TOKEN_COUNT 51
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 7
#define MAX_ALIAS_SEQUENCE_LENGTH 8
#define PRODUCTION_ID_COUNT 9

enum {
  sym_identifier = 1,
  sym_terminator = 2,
  sym_block_terminator = 3,
  anon_sym_LT = 4,
  anon_sym_LT_EQ = 5,
  anon_sym_LT_GT = 6,
  anon_sym_EQ = 7,
  anon_sym_GT = 8,
  anon_sym_GT_EQ = 9,
  anon_sym_SLASH_STAR = 10,
  aux_sym_comment_token1 = 11,
  aux_sym_comment_token2 = 12,
  anon_sym_STAR_SLASH = 13,
  anon_sym_LOGICAL = 14,
  anon_sym_INTEGER = 15,
  anon_sym_CHARACTER = 16,
  anon_sym_DECIMAL = 17,
  sym_number_literal = 18,
  anon_sym_DQUOTE = 19,
  aux_sym_double_quoted_string_token1 = 20,
  anon_sym_SQUOTE = 21,
  aux_sym_single_quoted_string_token1 = 22,
  anon_sym_DEFINE = 23,
  anon_sym_DEF = 24,
  anon_sym_VARIABLE = 25,
  anon_sym_VAR = 26,
  anon_sym_AS = 27,
  anon_sym_LPAREN = 28,
  anon_sym_COMMA = 29,
  anon_sym_RPAREN = 30,
  anon_sym_ASSIGN = 31,
  anon_sym_IF = 32,
  anon_sym_AND = 33,
  anon_sym_OR = 34,
  anon_sym_THENDO_COLON = 35,
  anon_sym_ELSEDO_COLON = 36,
  anon_sym_ELSEIF = 37,
  anon_sym_THEN = 38,
  anon_sym_ELSE = 39,
  anon_sym_WHERE = 40,
  anon_sym_NO_DASHLOCK = 41,
  anon_sym_NO_DASHWAIT = 42,
  anon_sym_SHARE_DASHLOCK = 43,
  anon_sym_EXCLUSIVE_DASHLOCK = 44,
  anon_sym_ = 45,
  anon_sym_FOR = 46,
  anon_sym_EACH = 47,
  anon_sym_FIRST = 48,
  anon_sym_LAST = 49,
  anon_sym_COLON = 50,
  sym_source_code = 51,
  sym_expression = 52,
  sym_comparison = 53,
  sym_statement = 54,
  sym_terminated_statement = 55,
  sym_comment = 56,
  sym_primitive_type = 57,
  sym_string_literal = 58,
  sym_double_quoted_string = 59,
  sym_single_quoted_string = 60,
  sym_assignment = 61,
  sym_variable_definition = 62,
  sym_variable_assignment = 63,
  sym_function_call_statement = 64,
  sym_function_call = 65,
  sym_assign_statement = 66,
  sym_if_statement = 67,
  sym_if_do_statement = 68,
  sym_else_do_statement = 69,
  sym_else_do_if_statement = 70,
  sym_if_then_statement = 71,
  sym_else_then_statement = 72,
  sym_where_clause = 73,
  sym_query_tunings = 74,
  sym_for_statement = 75,
  aux_sym_source_code_repeat1 = 76,
  aux_sym_comment_repeat1 = 77,
  aux_sym_double_quoted_string_repeat1 = 78,
  aux_sym_single_quoted_string_repeat1 = 79,
  aux_sym_function_call_repeat1 = 80,
  aux_sym_assign_statement_repeat1 = 81,
  aux_sym_if_do_statement_repeat1 = 82,
  aux_sym_if_do_statement_repeat2 = 83,
  aux_sym_where_clause_repeat1 = 84,
  aux_sym_query_tunings_repeat1 = 85,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym_identifier] = "identifier",
  [sym_terminator] = "terminator",
  [sym_block_terminator] = "block_terminator",
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
  [anon_sym_IF] = "IF",
  [anon_sym_AND] = "AND",
  [anon_sym_OR] = "OR",
  [anon_sym_THENDO_COLON] = "THEN DO:",
  [anon_sym_ELSEDO_COLON] = "ELSE DO:",
  [anon_sym_ELSEIF] = "ELSE IF",
  [anon_sym_THEN] = "THEN",
  [anon_sym_ELSE] = "ELSE",
  [anon_sym_WHERE] = "WHERE",
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
  [sym_source_code] = "source_code",
  [sym_expression] = "expression",
  [sym_comparison] = "comparison",
  [sym_statement] = "statement",
  [sym_terminated_statement] = "terminated_statement",
  [sym_comment] = "comment",
  [sym_primitive_type] = "primitive_type",
  [sym_string_literal] = "string_literal",
  [sym_double_quoted_string] = "double_quoted_string",
  [sym_single_quoted_string] = "single_quoted_string",
  [sym_assignment] = "assignment",
  [sym_variable_definition] = "variable_definition",
  [sym_variable_assignment] = "variable_assignment",
  [sym_function_call_statement] = "function_call_statement",
  [sym_function_call] = "function_call",
  [sym_assign_statement] = "assign_statement",
  [sym_if_statement] = "if_statement",
  [sym_if_do_statement] = "if_do_statement",
  [sym_else_do_statement] = "else_do_statement",
  [sym_else_do_if_statement] = "else_do_if_statement",
  [sym_if_then_statement] = "if_then_statement",
  [sym_else_then_statement] = "else_then_statement",
  [sym_where_clause] = "where_clause",
  [sym_query_tunings] = "query_tunings",
  [sym_for_statement] = "for_statement",
  [aux_sym_source_code_repeat1] = "source_code_repeat1",
  [aux_sym_comment_repeat1] = "comment_repeat1",
  [aux_sym_double_quoted_string_repeat1] = "double_quoted_string_repeat1",
  [aux_sym_single_quoted_string_repeat1] = "single_quoted_string_repeat1",
  [aux_sym_function_call_repeat1] = "function_call_repeat1",
  [aux_sym_assign_statement_repeat1] = "assign_statement_repeat1",
  [aux_sym_if_do_statement_repeat1] = "if_do_statement_repeat1",
  [aux_sym_if_do_statement_repeat2] = "if_do_statement_repeat2",
  [aux_sym_where_clause_repeat1] = "where_clause_repeat1",
  [aux_sym_query_tunings_repeat1] = "query_tunings_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym_identifier] = sym_identifier,
  [sym_terminator] = sym_terminator,
  [sym_block_terminator] = sym_block_terminator,
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
  [anon_sym_IF] = anon_sym_IF,
  [anon_sym_AND] = anon_sym_AND,
  [anon_sym_OR] = anon_sym_OR,
  [anon_sym_THENDO_COLON] = anon_sym_THENDO_COLON,
  [anon_sym_ELSEDO_COLON] = anon_sym_ELSEDO_COLON,
  [anon_sym_ELSEIF] = anon_sym_ELSEIF,
  [anon_sym_THEN] = anon_sym_THEN,
  [anon_sym_ELSE] = anon_sym_ELSE,
  [anon_sym_WHERE] = anon_sym_WHERE,
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
  [sym_source_code] = sym_source_code,
  [sym_expression] = sym_expression,
  [sym_comparison] = sym_comparison,
  [sym_statement] = sym_statement,
  [sym_terminated_statement] = sym_terminated_statement,
  [sym_comment] = sym_comment,
  [sym_primitive_type] = sym_primitive_type,
  [sym_string_literal] = sym_string_literal,
  [sym_double_quoted_string] = sym_double_quoted_string,
  [sym_single_quoted_string] = sym_single_quoted_string,
  [sym_assignment] = sym_assignment,
  [sym_variable_definition] = sym_variable_definition,
  [sym_variable_assignment] = sym_variable_assignment,
  [sym_function_call_statement] = sym_function_call_statement,
  [sym_function_call] = sym_function_call,
  [sym_assign_statement] = sym_assign_statement,
  [sym_if_statement] = sym_if_statement,
  [sym_if_do_statement] = sym_if_do_statement,
  [sym_else_do_statement] = sym_else_do_statement,
  [sym_else_do_if_statement] = sym_else_do_if_statement,
  [sym_if_then_statement] = sym_if_then_statement,
  [sym_else_then_statement] = sym_else_then_statement,
  [sym_where_clause] = sym_where_clause,
  [sym_query_tunings] = sym_query_tunings,
  [sym_for_statement] = sym_for_statement,
  [aux_sym_source_code_repeat1] = aux_sym_source_code_repeat1,
  [aux_sym_comment_repeat1] = aux_sym_comment_repeat1,
  [aux_sym_double_quoted_string_repeat1] = aux_sym_double_quoted_string_repeat1,
  [aux_sym_single_quoted_string_repeat1] = aux_sym_single_quoted_string_repeat1,
  [aux_sym_function_call_repeat1] = aux_sym_function_call_repeat1,
  [aux_sym_assign_statement_repeat1] = aux_sym_assign_statement_repeat1,
  [aux_sym_if_do_statement_repeat1] = aux_sym_if_do_statement_repeat1,
  [aux_sym_if_do_statement_repeat2] = aux_sym_if_do_statement_repeat2,
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
  [sym_block_terminator] = {
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
  [anon_sym_IF] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AND] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_OR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_THENDO_COLON] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_ELSEDO_COLON] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_ELSEIF] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_THEN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_ELSE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_WHERE] = {
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
  [sym_terminated_statement] = {
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
  [sym_function_call_statement] = {
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
  [sym_if_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_if_do_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_else_do_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_else_do_if_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_if_then_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_else_then_statement] = {
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
  [aux_sym_if_do_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_if_do_statement_repeat2] = {
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
    {field_conditions, 1},
    {field_conditions, 2},
  [5] =
    {field_table, 2},
    {field_type, 1},
  [7] =
    {field_identifier, 2},
    {field_type, 4},
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
  [84] = 84,
  [85] = 85,
  [86] = 86,
  [87] = 87,
  [88] = 88,
  [89] = 89,
  [90] = 90,
  [91] = 91,
  [92] = 92,
  [93] = 93,
  [94] = 94,
  [95] = 95,
  [96] = 96,
  [97] = 97,
  [98] = 98,
  [99] = 99,
  [100] = 100,
  [101] = 101,
  [102] = 102,
  [103] = 103,
  [104] = 104,
  [105] = 105,
  [106] = 106,
  [107] = 107,
  [108] = 108,
  [109] = 109,
  [110] = 110,
  [111] = 111,
  [112] = 112,
  [113] = 113,
  [114] = 114,
  [115] = 115,
  [116] = 116,
  [117] = 117,
  [118] = 118,
  [119] = 119,
  [120] = 120,
  [121] = 121,
  [122] = 122,
  [123] = 123,
  [124] = 124,
  [125] = 125,
  [126] = 126,
  [127] = 127,
  [128] = 128,
  [129] = 129,
  [130] = 130,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(121);
      if (lookahead == '"') ADVANCE(141);
      if (lookahead == '\'') ADVANCE(144);
      if (lookahead == '(') ADVANCE(153);
      if (lookahead == ')') ADVANCE(155);
      if (lookahead == '*') ADVANCE(11);
      if (lookahead == ',') ADVANCE(154);
      if (lookahead == '.') ADVANCE(123);
      if (lookahead == '/') ADVANCE(6);
      if (lookahead == ':') ADVANCE(175);
      if (lookahead == '<') ADVANCE(125);
      if (lookahead == '=') ADVANCE(128);
      if (lookahead == '>') ADVANCE(129);
      if (lookahead == 'A') ADVANCE(83);
      if (lookahead == 'C') ADVANCE(62);
      if (lookahead == 'D') ADVANCE(38);
      if (lookahead == 'E') ADVANCE(14);
      if (lookahead == 'F') ADVANCE(66);
      if (lookahead == 'I') ADVANCE(53);
      if (lookahead == 'L') ADVANCE(16);
      if (lookahead == 'N') ADVANCE(87);
      if (lookahead == 'O') ADVANCE(94);
      if (lookahead == 'S') ADVANCE(63);
      if (lookahead == 'T') ADVANCE(60);
      if (lookahead == 'V') ADVANCE(19);
      if (lookahead == 'W') ADVANCE(61);
      if (lookahead == '\\') ADVANCE(118);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(140);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(122);
      END_STATE();
    case 1:
      if (lookahead == ' ') ADVANCE(37);
      END_STATE();
    case 2:
      if (lookahead == ' ') ADVANCE(170);
      if (lookahead == ':') ADVANCE(175);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r') SKIP(2)
      END_STATE();
    case 3:
      if (lookahead == '"') ADVANCE(141);
      if (lookahead == '\\') ADVANCE(118);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(142);
      if (lookahead != 0) ADVANCE(143);
      END_STATE();
    case 4:
      if (lookahead == '\'') ADVANCE(144);
      if (lookahead == '\\') ADVANCE(118);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(145);
      if (lookahead != 0) ADVANCE(146);
      END_STATE();
    case 5:
      if (lookahead == '*') ADVANCE(11);
      if (lookahead == '\\') ADVANCE(118);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(132);
      if (lookahead != 0 &&
          lookahead != '/') ADVANCE(133);
      END_STATE();
    case 6:
      if (lookahead == '*') ADVANCE(131);
      END_STATE();
    case 7:
      if (lookahead == '-') ADVANCE(77);
      END_STATE();
    case 8:
      if (lookahead == '-') ADVANCE(80);
      END_STATE();
    case 9:
      if (lookahead == '-') ADVANCE(81);
      END_STATE();
    case 10:
      if (lookahead == '.') ADVANCE(124);
      END_STATE();
    case 11:
      if (lookahead == '/') ADVANCE(135);
      END_STATE();
    case 12:
      if (lookahead == ':') ADVANCE(160);
      END_STATE();
    case 13:
      if (lookahead == ':') ADVANCE(161);
      END_STATE();
    case 14:
      if (lookahead == 'A') ADVANCE(30);
      if (lookahead == 'L') ADVANCE(107);
      if (lookahead == 'N') ADVANCE(35);
      if (lookahead == 'X') ADVANCE(26);
      END_STATE();
    case 15:
      if (lookahead == 'A') ADVANCE(25);
      END_STATE();
    case 16:
      if (lookahead == 'A') ADVANCE(105);
      if (lookahead == 'O') ADVANCE(56);
      END_STATE();
    case 17:
      if (lookahead == 'A') ADVANCE(75);
      END_STATE();
    case 18:
      if (lookahead == 'A') ADVANCE(76);
      END_STATE();
    case 19:
      if (lookahead == 'A') ADVANCE(96);
      END_STATE();
    case 20:
      if (lookahead == 'A') ADVANCE(33);
      END_STATE();
    case 21:
      if (lookahead == 'A') ADVANCE(69);
      END_STATE();
    case 22:
      if (lookahead == 'A') ADVANCE(99);
      END_STATE();
    case 23:
      if (lookahead == 'A') ADVANCE(100);
      END_STATE();
    case 24:
      if (lookahead == 'A') ADVANCE(104);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(24)
      END_STATE();
    case 25:
      if (lookahead == 'B') ADVANCE(78);
      END_STATE();
    case 26:
      if (lookahead == 'C') ADVANCE(74);
      END_STATE();
    case 27:
      if (lookahead == 'C') ADVANCE(70);
      END_STATE();
    case 28:
      if (lookahead == 'C') ADVANCE(64);
      if (lookahead == 'F') ADVANCE(148);
      END_STATE();
    case 29:
      if (lookahead == 'C') ADVANCE(71);
      END_STATE();
    case 30:
      if (lookahead == 'C') ADVANCE(59);
      END_STATE();
    case 31:
      if (lookahead == 'C') ADVANCE(72);
      END_STATE();
    case 32:
      if (lookahead == 'C') ADVANCE(18);
      END_STATE();
    case 33:
      if (lookahead == 'C') ADVANCE(115);
      END_STATE();
    case 34:
      if (lookahead == 'D') ADVANCE(158);
      END_STATE();
    case 35:
      if (lookahead == 'D') ADVANCE(10);
      END_STATE();
    case 36:
      if (lookahead == 'D') ADVANCE(88);
      END_STATE();
    case 37:
      if (lookahead == 'D') ADVANCE(89);
      if (lookahead == 'I') ADVANCE(55);
      END_STATE();
    case 38:
      if (lookahead == 'E') ADVANCE(28);
      END_STATE();
    case 39:
      if (lookahead == 'E') ADVANCE(84);
      END_STATE();
    case 40:
      if (lookahead == 'E') ADVANCE(164);
      END_STATE();
    case 41:
      if (lookahead == 'E') ADVANCE(165);
      END_STATE();
    case 42:
      if (lookahead == 'E') ADVANCE(147);
      END_STATE();
    case 43:
      if (lookahead == 'E') ADVANCE(149);
      END_STATE();
    case 44:
      if (lookahead == 'E') ADVANCE(1);
      END_STATE();
    case 45:
      if (lookahead == 'E') ADVANCE(8);
      END_STATE();
    case 46:
      if (lookahead == 'E') ADVANCE(54);
      END_STATE();
    case 47:
      if (lookahead == 'E') ADVANCE(58);
      END_STATE();
    case 48:
      if (lookahead == 'E') ADVANCE(101);
      END_STATE();
    case 49:
      if (lookahead == 'E') ADVANCE(97);
      END_STATE();
    case 50:
      if (lookahead == 'E') ADVANCE(98);
      END_STATE();
    case 51:
      if (lookahead == 'E') ADVANCE(9);
      END_STATE();
    case 52:
      if (lookahead == 'F') ADVANCE(157);
      END_STATE();
    case 53:
      if (lookahead == 'F') ADVANCE(157);
      if (lookahead == 'N') ADVANCE(114);
      END_STATE();
    case 54:
      if (lookahead == 'F') ADVANCE(148);
      END_STATE();
    case 55:
      if (lookahead == 'F') ADVANCE(162);
      END_STATE();
    case 56:
      if (lookahead == 'G') ADVANCE(68);
      END_STATE();
    case 57:
      if (lookahead == 'G') ADVANCE(85);
      END_STATE();
    case 58:
      if (lookahead == 'G') ADVANCE(49);
      END_STATE();
    case 59:
      if (lookahead == 'H') ADVANCE(172);
      END_STATE();
    case 60:
      if (lookahead == 'H') ADVANCE(39);
      END_STATE();
    case 61:
      if (lookahead == 'H') ADVANCE(48);
      END_STATE();
    case 62:
      if (lookahead == 'H') ADVANCE(22);
      END_STATE();
    case 63:
      if (lookahead == 'H') ADVANCE(23);
      END_STATE();
    case 64:
      if (lookahead == 'I') ADVANCE(82);
      END_STATE();
    case 65:
      if (lookahead == 'I') ADVANCE(117);
      END_STATE();
    case 66:
      if (lookahead == 'I') ADVANCE(102);
      if (lookahead == 'O') ADVANCE(95);
      END_STATE();
    case 67:
      if (lookahead == 'I') ADVANCE(57);
      END_STATE();
    case 68:
      if (lookahead == 'I') ADVANCE(32);
      END_STATE();
    case 69:
      if (lookahead == 'I') ADVANCE(113);
      END_STATE();
    case 70:
      if (lookahead == 'K') ADVANCE(166);
      END_STATE();
    case 71:
      if (lookahead == 'K') ADVANCE(168);
      END_STATE();
    case 72:
      if (lookahead == 'K') ADVANCE(169);
      END_STATE();
    case 73:
      if (lookahead == 'L') ADVANCE(107);
      if (lookahead == 'N') ADVANCE(35);
      END_STATE();
    case 74:
      if (lookahead == 'L') ADVANCE(116);
      END_STATE();
    case 75:
      if (lookahead == 'L') ADVANCE(139);
      END_STATE();
    case 76:
      if (lookahead == 'L') ADVANCE(136);
      END_STATE();
    case 77:
      if (lookahead == 'L') ADVANCE(91);
      if (lookahead == 'W') ADVANCE(21);
      END_STATE();
    case 78:
      if (lookahead == 'L') ADVANCE(43);
      END_STATE();
    case 79:
      if (lookahead == 'L') ADVANCE(110);
      if (lookahead == 'N') ADVANCE(35);
      END_STATE();
    case 80:
      if (lookahead == 'L') ADVANCE(92);
      END_STATE();
    case 81:
      if (lookahead == 'L') ADVANCE(93);
      END_STATE();
    case 82:
      if (lookahead == 'M') ADVANCE(17);
      END_STATE();
    case 83:
      if (lookahead == 'N') ADVANCE(34);
      if (lookahead == 'S') ADVANCE(152);
      END_STATE();
    case 84:
      if (lookahead == 'N') ADVANCE(163);
      END_STATE();
    case 85:
      if (lookahead == 'N') ADVANCE(156);
      END_STATE();
    case 86:
      if (lookahead == 'N') ADVANCE(42);
      END_STATE();
    case 87:
      if (lookahead == 'O') ADVANCE(7);
      END_STATE();
    case 88:
      if (lookahead == 'O') ADVANCE(12);
      END_STATE();
    case 89:
      if (lookahead == 'O') ADVANCE(13);
      END_STATE();
    case 90:
      if (lookahead == 'O') ADVANCE(95);
      END_STATE();
    case 91:
      if (lookahead == 'O') ADVANCE(27);
      END_STATE();
    case 92:
      if (lookahead == 'O') ADVANCE(29);
      END_STATE();
    case 93:
      if (lookahead == 'O') ADVANCE(31);
      END_STATE();
    case 94:
      if (lookahead == 'R') ADVANCE(159);
      END_STATE();
    case 95:
      if (lookahead == 'R') ADVANCE(171);
      END_STATE();
    case 96:
      if (lookahead == 'R') ADVANCE(150);
      END_STATE();
    case 97:
      if (lookahead == 'R') ADVANCE(137);
      END_STATE();
    case 98:
      if (lookahead == 'R') ADVANCE(138);
      END_STATE();
    case 99:
      if (lookahead == 'R') ADVANCE(20);
      END_STATE();
    case 100:
      if (lookahead == 'R') ADVANCE(45);
      END_STATE();
    case 101:
      if (lookahead == 'R') ADVANCE(41);
      END_STATE();
    case 102:
      if (lookahead == 'R') ADVANCE(106);
      END_STATE();
    case 103:
      if (lookahead == 'S') ADVANCE(67);
      END_STATE();
    case 104:
      if (lookahead == 'S') ADVANCE(151);
      END_STATE();
    case 105:
      if (lookahead == 'S') ADVANCE(111);
      END_STATE();
    case 106:
      if (lookahead == 'S') ADVANCE(112);
      END_STATE();
    case 107:
      if (lookahead == 'S') ADVANCE(40);
      END_STATE();
    case 108:
      if (lookahead == 'S') ADVANCE(103);
      END_STATE();
    case 109:
      if (lookahead == 'S') ADVANCE(65);
      END_STATE();
    case 110:
      if (lookahead == 'S') ADVANCE(44);
      END_STATE();
    case 111:
      if (lookahead == 'T') ADVANCE(174);
      END_STATE();
    case 112:
      if (lookahead == 'T') ADVANCE(173);
      END_STATE();
    case 113:
      if (lookahead == 'T') ADVANCE(167);
      END_STATE();
    case 114:
      if (lookahead == 'T') ADVANCE(47);
      END_STATE();
    case 115:
      if (lookahead == 'T') ADVANCE(50);
      END_STATE();
    case 116:
      if (lookahead == 'U') ADVANCE(109);
      END_STATE();
    case 117:
      if (lookahead == 'V') ADVANCE(51);
      END_STATE();
    case 118:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(134);
      END_STATE();
    case 119:
      if (eof) ADVANCE(121);
      if (lookahead == '/') ADVANCE(6);
      if (lookahead == 'A') ADVANCE(108);
      if (lookahead == 'D') ADVANCE(46);
      if (lookahead == 'E') ADVANCE(79);
      if (lookahead == 'F') ADVANCE(90);
      if (lookahead == 'I') ADVANCE(52);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(119)
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(122);
      END_STATE();
    case 120:
      if (eof) ADVANCE(121);
      if (lookahead == '/') ADVANCE(6);
      if (lookahead == 'A') ADVANCE(108);
      if (lookahead == 'D') ADVANCE(46);
      if (lookahead == 'E') ADVANCE(73);
      if (lookahead == 'F') ADVANCE(90);
      if (lookahead == 'I') ADVANCE(52);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(120)
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(122);
      END_STATE();
    case 121:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 122:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(122);
      END_STATE();
    case 123:
      ACCEPT_TOKEN(sym_terminator);
      END_STATE();
    case 124:
      ACCEPT_TOKEN(sym_block_terminator);
      END_STATE();
    case 125:
      ACCEPT_TOKEN(anon_sym_LT);
      if (lookahead == '=') ADVANCE(126);
      if (lookahead == '>') ADVANCE(127);
      END_STATE();
    case 126:
      ACCEPT_TOKEN(anon_sym_LT_EQ);
      END_STATE();
    case 127:
      ACCEPT_TOKEN(anon_sym_LT_GT);
      END_STATE();
    case 128:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 129:
      ACCEPT_TOKEN(anon_sym_GT);
      if (lookahead == '=') ADVANCE(130);
      END_STATE();
    case 130:
      ACCEPT_TOKEN(anon_sym_GT_EQ);
      END_STATE();
    case 131:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      END_STATE();
    case 132:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(132);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(133);
      END_STATE();
    case 133:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(133);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(anon_sym_STAR_SLASH);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(anon_sym_LOGICAL);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(anon_sym_INTEGER);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_CHARACTER);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_DECIMAL);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(sym_number_literal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(140);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_DQUOTE);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(142);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(143);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(143);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(anon_sym_SQUOTE);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(145);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(146);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(146);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(anon_sym_DEFINE);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(anon_sym_DEF);
      if (lookahead == 'I') ADVANCE(86);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(anon_sym_VARIABLE);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(anon_sym_VAR);
      if (lookahead == 'I') ADVANCE(15);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(anon_sym_AS);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(anon_sym_AS);
      if (lookahead == 'S') ADVANCE(67);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(anon_sym_ASSIGN);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(anon_sym_IF);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(anon_sym_AND);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(anon_sym_OR);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(anon_sym_THENDO_COLON);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(anon_sym_ELSEDO_COLON);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(anon_sym_ELSEIF);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(anon_sym_THEN);
      if (lookahead == ' ') ADVANCE(36);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(anon_sym_ELSE);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(anon_sym_WHERE);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(anon_sym_NO_DASHLOCK);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(anon_sym_NO_DASHWAIT);
      END_STATE();
    case 168:
      ACCEPT_TOKEN(anon_sym_SHARE_DASHLOCK);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(anon_sym_EXCLUSIVE_DASHLOCK);
      END_STATE();
    case 170:
      ACCEPT_TOKEN(anon_sym_);
      if (lookahead == ' ') ADVANCE(170);
      END_STATE();
    case 171:
      ACCEPT_TOKEN(anon_sym_FOR);
      END_STATE();
    case 172:
      ACCEPT_TOKEN(anon_sym_EACH);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(anon_sym_FIRST);
      END_STATE();
    case 174:
      ACCEPT_TOKEN(anon_sym_LAST);
      END_STATE();
    case 175:
      ACCEPT_TOKEN(anon_sym_COLON);
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
  [1] = {.lex_state = 119},
  [2] = {.lex_state = 119},
  [3] = {.lex_state = 119},
  [4] = {.lex_state = 119},
  [5] = {.lex_state = 119},
  [6] = {.lex_state = 119},
  [7] = {.lex_state = 119},
  [8] = {.lex_state = 119},
  [9] = {.lex_state = 119},
  [10] = {.lex_state = 119},
  [11] = {.lex_state = 119},
  [12] = {.lex_state = 119},
  [13] = {.lex_state = 119},
  [14] = {.lex_state = 119},
  [15] = {.lex_state = 119},
  [16] = {.lex_state = 119},
  [17] = {.lex_state = 119},
  [18] = {.lex_state = 119},
  [19] = {.lex_state = 119},
  [20] = {.lex_state = 119},
  [21] = {.lex_state = 119},
  [22] = {.lex_state = 0},
  [23] = {.lex_state = 0},
  [24] = {.lex_state = 0},
  [25] = {.lex_state = 0},
  [26] = {.lex_state = 0},
  [27] = {.lex_state = 0},
  [28] = {.lex_state = 0},
  [29] = {.lex_state = 0},
  [30] = {.lex_state = 0},
  [31] = {.lex_state = 0},
  [32] = {.lex_state = 0},
  [33] = {.lex_state = 119},
  [34] = {.lex_state = 119},
  [35] = {.lex_state = 119},
  [36] = {.lex_state = 119},
  [37] = {.lex_state = 119},
  [38] = {.lex_state = 119},
  [39] = {.lex_state = 119},
  [40] = {.lex_state = 119},
  [41] = {.lex_state = 119},
  [42] = {.lex_state = 0},
  [43] = {.lex_state = 0},
  [44] = {.lex_state = 119},
  [45] = {.lex_state = 0},
  [46] = {.lex_state = 119},
  [47] = {.lex_state = 119},
  [48] = {.lex_state = 119},
  [49] = {.lex_state = 119},
  [50] = {.lex_state = 0},
  [51] = {.lex_state = 119},
  [52] = {.lex_state = 120},
  [53] = {.lex_state = 120},
  [54] = {.lex_state = 0},
  [55] = {.lex_state = 0},
  [56] = {.lex_state = 0},
  [57] = {.lex_state = 0},
  [58] = {.lex_state = 0},
  [59] = {.lex_state = 120},
  [60] = {.lex_state = 120},
  [61] = {.lex_state = 120},
  [62] = {.lex_state = 0},
  [63] = {.lex_state = 0},
  [64] = {.lex_state = 120},
  [65] = {.lex_state = 0},
  [66] = {.lex_state = 0},
  [67] = {.lex_state = 0},
  [68] = {.lex_state = 119},
  [69] = {.lex_state = 119},
  [70] = {.lex_state = 119},
  [71] = {.lex_state = 0},
  [72] = {.lex_state = 119},
  [73] = {.lex_state = 119},
  [74] = {.lex_state = 119},
  [75] = {.lex_state = 119},
  [76] = {.lex_state = 119},
  [77] = {.lex_state = 0},
  [78] = {.lex_state = 0},
  [79] = {.lex_state = 119},
  [80] = {.lex_state = 119},
  [81] = {.lex_state = 119},
  [82] = {.lex_state = 119},
  [83] = {.lex_state = 0},
  [84] = {.lex_state = 119},
  [85] = {.lex_state = 119},
  [86] = {.lex_state = 119},
  [87] = {.lex_state = 119},
  [88] = {.lex_state = 0},
  [89] = {.lex_state = 0},
  [90] = {.lex_state = 0},
  [91] = {.lex_state = 0},
  [92] = {.lex_state = 0},
  [93] = {.lex_state = 0},
  [94] = {.lex_state = 0},
  [95] = {.lex_state = 0},
  [96] = {.lex_state = 0},
  [97] = {.lex_state = 5},
  [98] = {.lex_state = 0},
  [99] = {.lex_state = 5},
  [100] = {.lex_state = 5},
  [101] = {.lex_state = 4},
  [102] = {.lex_state = 0},
  [103] = {.lex_state = 3},
  [104] = {.lex_state = 4},
  [105] = {.lex_state = 3},
  [106] = {.lex_state = 0},
  [107] = {.lex_state = 3},
  [108] = {.lex_state = 0},
  [109] = {.lex_state = 4},
  [110] = {.lex_state = 0},
  [111] = {.lex_state = 2},
  [112] = {.lex_state = 0},
  [113] = {.lex_state = 2},
  [114] = {.lex_state = 0},
  [115] = {.lex_state = 2},
  [116] = {.lex_state = 0},
  [117] = {.lex_state = 2},
  [118] = {.lex_state = 0},
  [119] = {.lex_state = 0},
  [120] = {.lex_state = 0},
  [121] = {.lex_state = 0},
  [122] = {.lex_state = 0},
  [123] = {.lex_state = 0},
  [124] = {.lex_state = 0},
  [125] = {.lex_state = 0},
  [126] = {.lex_state = 0},
  [127] = {.lex_state = 0},
  [128] = {.lex_state = 0},
  [129] = {.lex_state = 0},
  [130] = {.lex_state = 24},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym_identifier] = ACTIONS(1),
    [sym_terminator] = ACTIONS(1),
    [sym_block_terminator] = ACTIONS(1),
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
    [anon_sym_IF] = ACTIONS(1),
    [anon_sym_AND] = ACTIONS(1),
    [anon_sym_OR] = ACTIONS(1),
    [anon_sym_THENDO_COLON] = ACTIONS(1),
    [anon_sym_THEN] = ACTIONS(1),
    [anon_sym_ELSE] = ACTIONS(1),
    [anon_sym_WHERE] = ACTIONS(1),
    [anon_sym_NO_DASHLOCK] = ACTIONS(1),
    [anon_sym_NO_DASHWAIT] = ACTIONS(1),
    [anon_sym_SHARE_DASHLOCK] = ACTIONS(1),
    [anon_sym_EXCLUSIVE_DASHLOCK] = ACTIONS(1),
    [anon_sym_FOR] = ACTIONS(1),
    [anon_sym_EACH] = ACTIONS(1),
    [anon_sym_FIRST] = ACTIONS(1),
    [anon_sym_LAST] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
  },
  [1] = {
    [sym_source_code] = STATE(121),
    [sym_statement] = STATE(13),
    [sym_comment] = STATE(76),
    [sym_assignment] = STATE(124),
    [sym_variable_definition] = STATE(76),
    [sym_variable_assignment] = STATE(76),
    [sym_function_call_statement] = STATE(76),
    [sym_function_call] = STATE(125),
    [sym_assign_statement] = STATE(76),
    [sym_if_statement] = STATE(76),
    [sym_if_do_statement] = STATE(68),
    [sym_if_then_statement] = STATE(68),
    [sym_for_statement] = STATE(76),
    [aux_sym_source_code_repeat1] = STATE(13),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_identifier] = ACTIONS(5),
    [anon_sym_SLASH_STAR] = ACTIONS(7),
    [anon_sym_DEFINE] = ACTIONS(9),
    [anon_sym_DEF] = ACTIONS(11),
    [anon_sym_ASSIGN] = ACTIONS(13),
    [anon_sym_IF] = ACTIONS(15),
    [anon_sym_FOR] = ACTIONS(17),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 13,
    ACTIONS(21), 1,
      sym_identifier,
    ACTIONS(24), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(27), 1,
      anon_sym_DEFINE,
    ACTIONS(30), 1,
      anon_sym_DEF,
    ACTIONS(33), 1,
      anon_sym_ASSIGN,
    ACTIONS(36), 1,
      anon_sym_IF,
    ACTIONS(39), 1,
      anon_sym_FOR,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    ACTIONS(19), 2,
      ts_builtin_sym_end,
      sym_block_terminator,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [49] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(42), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [97] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(44), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [145] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(46), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [193] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(48), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [241] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(50), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(6), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [289] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(52), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(4), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [337] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(54), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [385] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(56), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(3), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [433] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(58), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [481] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(60), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(5), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [529] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(62), 1,
      ts_builtin_sym_end,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [577] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(64), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(21), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [625] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(66), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [673] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(68), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(17), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [721] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(70), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [769] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(72), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(15), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [817] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(74), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(9), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [865] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(76), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(11), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [913] = 13,
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
      anon_sym_IF,
    ACTIONS(17), 1,
      anon_sym_FOR,
    ACTIONS(76), 1,
      sym_block_terminator,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(68), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(76), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_assign_statement,
      sym_if_statement,
      sym_for_statement,
  [961] = 3,
    ACTIONS(82), 1,
      anon_sym_LPAREN,
    ACTIONS(80), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(78), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [988] = 2,
    ACTIONS(86), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(84), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1012] = 2,
    ACTIONS(90), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(88), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1036] = 2,
    ACTIONS(94), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(92), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1060] = 2,
    ACTIONS(98), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(96), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1084] = 2,
    ACTIONS(102), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(100), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1108] = 2,
    ACTIONS(80), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(78), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1132] = 2,
    ACTIONS(106), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(104), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1156] = 4,
    ACTIONS(114), 1,
      anon_sym_THEN,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(108), 12,
      sym_identifier,
      sym_terminator,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1184] = 2,
    ACTIONS(118), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(116), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1208] = 2,
    ACTIONS(122), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(120), 16,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1232] = 5,
    ACTIONS(126), 1,
      anon_sym_DEF,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    STATE(34), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(124), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1257] = 5,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    ACTIONS(134), 1,
      anon_sym_DEF,
    STATE(38), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(132), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1282] = 5,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    ACTIONS(138), 1,
      anon_sym_DEF,
    STATE(38), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(136), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1307] = 5,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    ACTIONS(138), 1,
      anon_sym_DEF,
    STATE(40), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(136), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1332] = 5,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    ACTIONS(142), 1,
      anon_sym_DEF,
    STATE(39), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(140), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1357] = 5,
    ACTIONS(146), 1,
      anon_sym_DEF,
    ACTIONS(148), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(151), 1,
      anon_sym_ELSEIF,
    STATE(38), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(144), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1382] = 5,
    ACTIONS(126), 1,
      anon_sym_DEF,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    STATE(38), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(124), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1407] = 5,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    ACTIONS(156), 1,
      anon_sym_DEF,
    STATE(38), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(154), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1432] = 5,
    ACTIONS(128), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(130), 1,
      anon_sym_ELSEIF,
    ACTIONS(160), 1,
      anon_sym_DEF,
    STATE(35), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat2,
    ACTIONS(158), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1457] = 5,
    ACTIONS(162), 1,
      anon_sym_AND,
    STATE(92), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(164), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1481] = 3,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(166), 6,
      anon_sym_AND,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1500] = 2,
    ACTIONS(170), 1,
      anon_sym_DEF,
    ACTIONS(168), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
  [1516] = 8,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    ACTIONS(180), 1,
      anon_sym_RPAREN,
    STATE(78), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1544] = 2,
    ACTIONS(184), 1,
      anon_sym_DEF,
    ACTIONS(182), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
  [1560] = 2,
    ACTIONS(188), 1,
      anon_sym_DEF,
    ACTIONS(186), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
  [1576] = 2,
    ACTIONS(192), 1,
      anon_sym_DEF,
    ACTIONS(190), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
  [1592] = 2,
    ACTIONS(196), 1,
      anon_sym_DEF,
    ACTIONS(194), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
  [1608] = 6,
    ACTIONS(200), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(202), 1,
      anon_sym_THEN,
    STATE(96), 1,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(198), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [1632] = 2,
    ACTIONS(206), 1,
      anon_sym_DEF,
    ACTIONS(204), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
  [1648] = 4,
    ACTIONS(210), 1,
      anon_sym_DEF,
    ACTIONS(212), 1,
      anon_sym_ELSE,
    STATE(82), 1,
      sym_else_then_statement,
    ACTIONS(208), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1668] = 4,
    ACTIONS(212), 1,
      anon_sym_ELSE,
    ACTIONS(216), 1,
      anon_sym_DEF,
    STATE(84), 1,
      sym_else_then_statement,
    ACTIONS(214), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [1688] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(90), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1713] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(43), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1738] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(58), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1763] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(88), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1788] = 5,
    ACTIONS(218), 1,
      anon_sym_THENDO_COLON,
    STATE(110), 1,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(198), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [1809] = 2,
    ACTIONS(222), 1,
      anon_sym_DEF,
    ACTIONS(220), 9,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
  [1824] = 2,
    ACTIONS(226), 1,
      anon_sym_DEF,
    ACTIONS(224), 9,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
  [1839] = 2,
    ACTIONS(230), 1,
      anon_sym_DEF,
    ACTIONS(228), 9,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
  [1854] = 4,
    ACTIONS(234), 1,
      anon_sym_THEN,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(232), 3,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [1873] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(50), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1898] = 2,
    ACTIONS(238), 1,
      anon_sym_DEF,
    ACTIONS(236), 9,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
  [1913] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(62), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1938] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(30), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1963] = 7,
    ACTIONS(172), 1,
      sym_identifier,
    ACTIONS(174), 1,
      sym_number_literal,
    ACTIONS(176), 1,
      anon_sym_DQUOTE,
    ACTIONS(178), 1,
      anon_sym_SQUOTE,
    STATE(42), 1,
      sym_expression,
    STATE(27), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(28), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1988] = 2,
    ACTIONS(242), 1,
      anon_sym_DEF,
    ACTIONS(240), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2002] = 2,
    ACTIONS(246), 1,
      anon_sym_DEF,
    ACTIONS(244), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2016] = 2,
    ACTIONS(250), 1,
      anon_sym_DEF,
    ACTIONS(248), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2030] = 7,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    STATE(52), 1,
      sym_terminated_statement,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(64), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [2054] = 2,
    ACTIONS(254), 1,
      anon_sym_DEF,
    ACTIONS(252), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2068] = 2,
    ACTIONS(258), 1,
      anon_sym_DEF,
    ACTIONS(256), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2082] = 2,
    ACTIONS(262), 1,
      anon_sym_DEF,
    ACTIONS(260), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2096] = 2,
    ACTIONS(266), 1,
      anon_sym_DEF,
    ACTIONS(264), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2110] = 2,
    ACTIONS(270), 1,
      anon_sym_DEF,
    ACTIONS(268), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2124] = 7,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    STATE(53), 1,
      sym_terminated_statement,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(64), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [2148] = 5,
    ACTIONS(272), 1,
      anon_sym_COMMA,
    ACTIONS(274), 1,
      anon_sym_RPAREN,
    STATE(112), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [2168] = 2,
    ACTIONS(278), 1,
      anon_sym_DEF,
    ACTIONS(276), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2182] = 2,
    ACTIONS(282), 1,
      anon_sym_DEF,
    ACTIONS(280), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2196] = 2,
    ACTIONS(286), 1,
      anon_sym_DEF,
    ACTIONS(284), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2210] = 2,
    ACTIONS(290), 1,
      anon_sym_DEF,
    ACTIONS(288), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2224] = 7,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    STATE(69), 1,
      sym_terminated_statement,
    STATE(124), 1,
      sym_assignment,
    STATE(125), 1,
      sym_function_call,
    STATE(64), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [2248] = 2,
    ACTIONS(294), 1,
      anon_sym_DEF,
    ACTIONS(292), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2262] = 2,
    ACTIONS(298), 1,
      anon_sym_DEF,
    ACTIONS(296), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2276] = 2,
    ACTIONS(302), 1,
      anon_sym_DEF,
    ACTIONS(300), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2290] = 2,
    ACTIONS(306), 1,
      anon_sym_DEF,
    ACTIONS(304), 8,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_ASSIGN,
      anon_sym_IF,
      anon_sym_FOR,
  [2304] = 3,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(308), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [2319] = 5,
    ACTIONS(310), 1,
      anon_sym_WHERE,
    ACTIONS(314), 1,
      anon_sym_COLON,
    STATE(93), 1,
      sym_where_clause,
    STATE(123), 1,
      sym_query_tunings,
    ACTIONS(312), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [2338] = 3,
    ACTIONS(110), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(316), 2,
      sym_identifier,
      sym_terminator,
    ACTIONS(112), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [2353] = 3,
    ACTIONS(318), 1,
      anon_sym_AND,
    STATE(91), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(166), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [2367] = 3,
    ACTIONS(162), 1,
      anon_sym_AND,
    STATE(91), 1,
      aux_sym_where_clause_repeat1,
    ACTIONS(321), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [2381] = 3,
    ACTIONS(323), 1,
      anon_sym_COLON,
    STATE(120), 1,
      sym_query_tunings,
    ACTIONS(312), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [2394] = 2,
    STATE(127), 1,
      sym_primitive_type,
    ACTIONS(325), 4,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
  [2404] = 4,
    ACTIONS(232), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(234), 1,
      anon_sym_THEN,
    STATE(95), 1,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(327), 2,
      anon_sym_AND,
      anon_sym_OR,
  [2418] = 4,
    ACTIONS(330), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(332), 1,
      anon_sym_THEN,
    STATE(95), 1,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(198), 2,
      anon_sym_AND,
      anon_sym_OR,
  [2432] = 4,
    ACTIONS(334), 1,
      aux_sym_comment_token1,
    ACTIONS(336), 1,
      aux_sym_comment_token2,
    ACTIONS(338), 1,
      anon_sym_STAR_SLASH,
    STATE(99), 1,
      aux_sym_comment_repeat1,
  [2445] = 3,
    ACTIONS(340), 1,
      sym_identifier,
    ACTIONS(342), 1,
      sym_terminator,
    STATE(102), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [2456] = 4,
    ACTIONS(344), 1,
      aux_sym_comment_token1,
    ACTIONS(347), 1,
      aux_sym_comment_token2,
    ACTIONS(350), 1,
      anon_sym_STAR_SLASH,
    STATE(99), 1,
      aux_sym_comment_repeat1,
  [2469] = 4,
    ACTIONS(352), 1,
      aux_sym_comment_token1,
    ACTIONS(354), 1,
      aux_sym_comment_token2,
    ACTIONS(356), 1,
      anon_sym_STAR_SLASH,
    STATE(97), 1,
      aux_sym_comment_repeat1,
  [2482] = 4,
    ACTIONS(358), 1,
      aux_sym_comment_token2,
    ACTIONS(361), 1,
      anon_sym_SQUOTE,
    ACTIONS(363), 1,
      aux_sym_single_quoted_string_token1,
    STATE(101), 1,
      aux_sym_single_quoted_string_repeat1,
  [2495] = 3,
    ACTIONS(366), 1,
      sym_identifier,
    ACTIONS(369), 1,
      sym_terminator,
    STATE(102), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [2506] = 4,
    ACTIONS(371), 1,
      aux_sym_comment_token2,
    ACTIONS(374), 1,
      anon_sym_DQUOTE,
    ACTIONS(376), 1,
      aux_sym_double_quoted_string_token1,
    STATE(103), 1,
      aux_sym_double_quoted_string_repeat1,
  [2519] = 4,
    ACTIONS(379), 1,
      aux_sym_comment_token2,
    ACTIONS(381), 1,
      anon_sym_SQUOTE,
    ACTIONS(383), 1,
      aux_sym_single_quoted_string_token1,
    STATE(109), 1,
      aux_sym_single_quoted_string_repeat1,
  [2532] = 4,
    ACTIONS(385), 1,
      aux_sym_comment_token2,
    ACTIONS(387), 1,
      anon_sym_DQUOTE,
    ACTIONS(389), 1,
      aux_sym_double_quoted_string_token1,
    STATE(107), 1,
      aux_sym_double_quoted_string_repeat1,
  [2545] = 3,
    ACTIONS(340), 1,
      sym_identifier,
    ACTIONS(391), 1,
      sym_terminator,
    STATE(98), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [2556] = 4,
    ACTIONS(393), 1,
      aux_sym_comment_token2,
    ACTIONS(395), 1,
      anon_sym_DQUOTE,
    ACTIONS(397), 1,
      aux_sym_double_quoted_string_token1,
    STATE(103), 1,
      aux_sym_double_quoted_string_repeat1,
  [2569] = 1,
    ACTIONS(399), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [2576] = 4,
    ACTIONS(401), 1,
      aux_sym_comment_token2,
    ACTIONS(403), 1,
      anon_sym_SQUOTE,
    ACTIONS(405), 1,
      aux_sym_single_quoted_string_token1,
    STATE(101), 1,
      aux_sym_single_quoted_string_repeat1,
  [2589] = 3,
    ACTIONS(407), 1,
      anon_sym_THENDO_COLON,
    STATE(95), 1,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(198), 2,
      anon_sym_AND,
      anon_sym_OR,
  [2600] = 3,
    ACTIONS(409), 1,
      anon_sym_,
    ACTIONS(411), 1,
      anon_sym_COLON,
    STATE(113), 1,
      aux_sym_query_tunings_repeat1,
  [2610] = 3,
    ACTIONS(272), 1,
      anon_sym_COMMA,
    ACTIONS(413), 1,
      anon_sym_RPAREN,
    STATE(114), 1,
      aux_sym_function_call_repeat1,
  [2620] = 3,
    ACTIONS(415), 1,
      anon_sym_,
    ACTIONS(418), 1,
      anon_sym_COLON,
    STATE(113), 1,
      aux_sym_query_tunings_repeat1,
  [2630] = 3,
    ACTIONS(308), 1,
      anon_sym_RPAREN,
    ACTIONS(420), 1,
      anon_sym_COMMA,
    STATE(114), 1,
      aux_sym_function_call_repeat1,
  [2640] = 3,
    ACTIONS(409), 1,
      anon_sym_,
    ACTIONS(423), 1,
      anon_sym_COLON,
    STATE(111), 1,
      aux_sym_query_tunings_repeat1,
  [2650] = 1,
    ACTIONS(425), 3,
      anon_sym_EACH,
      anon_sym_FIRST,
      anon_sym_LAST,
  [2656] = 2,
    ACTIONS(418), 1,
      anon_sym_COLON,
    ACTIONS(427), 1,
      anon_sym_,
  [2663] = 2,
    ACTIONS(82), 1,
      anon_sym_LPAREN,
    ACTIONS(429), 1,
      anon_sym_EQ,
  [2670] = 2,
    ACTIONS(431), 1,
      anon_sym_VARIABLE,
    ACTIONS(433), 1,
      anon_sym_VAR,
  [2677] = 1,
    ACTIONS(435), 1,
      anon_sym_COLON,
  [2681] = 1,
    ACTIONS(437), 1,
      ts_builtin_sym_end,
  [2685] = 1,
    ACTIONS(429), 1,
      anon_sym_EQ,
  [2689] = 1,
    ACTIONS(439), 1,
      anon_sym_COLON,
  [2693] = 1,
    ACTIONS(441), 1,
      sym_terminator,
  [2697] = 1,
    ACTIONS(443), 1,
      sym_terminator,
  [2701] = 1,
    ACTIONS(445), 1,
      sym_terminator,
  [2705] = 1,
    ACTIONS(447), 1,
      sym_terminator,
  [2709] = 1,
    ACTIONS(449), 1,
      sym_identifier,
  [2713] = 1,
    ACTIONS(451), 1,
      sym_identifier,
  [2717] = 1,
    ACTIONS(453), 1,
      anon_sym_AS,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 49,
  [SMALL_STATE(4)] = 97,
  [SMALL_STATE(5)] = 145,
  [SMALL_STATE(6)] = 193,
  [SMALL_STATE(7)] = 241,
  [SMALL_STATE(8)] = 289,
  [SMALL_STATE(9)] = 337,
  [SMALL_STATE(10)] = 385,
  [SMALL_STATE(11)] = 433,
  [SMALL_STATE(12)] = 481,
  [SMALL_STATE(13)] = 529,
  [SMALL_STATE(14)] = 577,
  [SMALL_STATE(15)] = 625,
  [SMALL_STATE(16)] = 673,
  [SMALL_STATE(17)] = 721,
  [SMALL_STATE(18)] = 769,
  [SMALL_STATE(19)] = 817,
  [SMALL_STATE(20)] = 865,
  [SMALL_STATE(21)] = 913,
  [SMALL_STATE(22)] = 961,
  [SMALL_STATE(23)] = 988,
  [SMALL_STATE(24)] = 1012,
  [SMALL_STATE(25)] = 1036,
  [SMALL_STATE(26)] = 1060,
  [SMALL_STATE(27)] = 1084,
  [SMALL_STATE(28)] = 1108,
  [SMALL_STATE(29)] = 1132,
  [SMALL_STATE(30)] = 1156,
  [SMALL_STATE(31)] = 1184,
  [SMALL_STATE(32)] = 1208,
  [SMALL_STATE(33)] = 1232,
  [SMALL_STATE(34)] = 1257,
  [SMALL_STATE(35)] = 1282,
  [SMALL_STATE(36)] = 1307,
  [SMALL_STATE(37)] = 1332,
  [SMALL_STATE(38)] = 1357,
  [SMALL_STATE(39)] = 1382,
  [SMALL_STATE(40)] = 1407,
  [SMALL_STATE(41)] = 1432,
  [SMALL_STATE(42)] = 1457,
  [SMALL_STATE(43)] = 1481,
  [SMALL_STATE(44)] = 1500,
  [SMALL_STATE(45)] = 1516,
  [SMALL_STATE(46)] = 1544,
  [SMALL_STATE(47)] = 1560,
  [SMALL_STATE(48)] = 1576,
  [SMALL_STATE(49)] = 1592,
  [SMALL_STATE(50)] = 1608,
  [SMALL_STATE(51)] = 1632,
  [SMALL_STATE(52)] = 1648,
  [SMALL_STATE(53)] = 1668,
  [SMALL_STATE(54)] = 1688,
  [SMALL_STATE(55)] = 1713,
  [SMALL_STATE(56)] = 1738,
  [SMALL_STATE(57)] = 1763,
  [SMALL_STATE(58)] = 1788,
  [SMALL_STATE(59)] = 1809,
  [SMALL_STATE(60)] = 1824,
  [SMALL_STATE(61)] = 1839,
  [SMALL_STATE(62)] = 1854,
  [SMALL_STATE(63)] = 1873,
  [SMALL_STATE(64)] = 1898,
  [SMALL_STATE(65)] = 1913,
  [SMALL_STATE(66)] = 1938,
  [SMALL_STATE(67)] = 1963,
  [SMALL_STATE(68)] = 1988,
  [SMALL_STATE(69)] = 2002,
  [SMALL_STATE(70)] = 2016,
  [SMALL_STATE(71)] = 2030,
  [SMALL_STATE(72)] = 2054,
  [SMALL_STATE(73)] = 2068,
  [SMALL_STATE(74)] = 2082,
  [SMALL_STATE(75)] = 2096,
  [SMALL_STATE(76)] = 2110,
  [SMALL_STATE(77)] = 2124,
  [SMALL_STATE(78)] = 2148,
  [SMALL_STATE(79)] = 2168,
  [SMALL_STATE(80)] = 2182,
  [SMALL_STATE(81)] = 2196,
  [SMALL_STATE(82)] = 2210,
  [SMALL_STATE(83)] = 2224,
  [SMALL_STATE(84)] = 2248,
  [SMALL_STATE(85)] = 2262,
  [SMALL_STATE(86)] = 2276,
  [SMALL_STATE(87)] = 2290,
  [SMALL_STATE(88)] = 2304,
  [SMALL_STATE(89)] = 2319,
  [SMALL_STATE(90)] = 2338,
  [SMALL_STATE(91)] = 2353,
  [SMALL_STATE(92)] = 2367,
  [SMALL_STATE(93)] = 2381,
  [SMALL_STATE(94)] = 2394,
  [SMALL_STATE(95)] = 2404,
  [SMALL_STATE(96)] = 2418,
  [SMALL_STATE(97)] = 2432,
  [SMALL_STATE(98)] = 2445,
  [SMALL_STATE(99)] = 2456,
  [SMALL_STATE(100)] = 2469,
  [SMALL_STATE(101)] = 2482,
  [SMALL_STATE(102)] = 2495,
  [SMALL_STATE(103)] = 2506,
  [SMALL_STATE(104)] = 2519,
  [SMALL_STATE(105)] = 2532,
  [SMALL_STATE(106)] = 2545,
  [SMALL_STATE(107)] = 2556,
  [SMALL_STATE(108)] = 2569,
  [SMALL_STATE(109)] = 2576,
  [SMALL_STATE(110)] = 2589,
  [SMALL_STATE(111)] = 2600,
  [SMALL_STATE(112)] = 2610,
  [SMALL_STATE(113)] = 2620,
  [SMALL_STATE(114)] = 2630,
  [SMALL_STATE(115)] = 2640,
  [SMALL_STATE(116)] = 2650,
  [SMALL_STATE(117)] = 2656,
  [SMALL_STATE(118)] = 2663,
  [SMALL_STATE(119)] = 2670,
  [SMALL_STATE(120)] = 2677,
  [SMALL_STATE(121)] = 2681,
  [SMALL_STATE(122)] = 2685,
  [SMALL_STATE(123)] = 2689,
  [SMALL_STATE(124)] = 2693,
  [SMALL_STATE(125)] = 2697,
  [SMALL_STATE(126)] = 2701,
  [SMALL_STATE(127)] = 2705,
  [SMALL_STATE(128)] = 2709,
  [SMALL_STATE(129)] = 2713,
  [SMALL_STATE(130)] = 2717,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(118),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(100),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(119),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(119),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(106),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(63),
  [17] = {.entry = {.count = 1, .reusable = true}}, SHIFT(116),
  [19] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2),
  [21] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(118),
  [24] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(100),
  [27] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(119),
  [30] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(119),
  [33] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(106),
  [36] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(63),
  [39] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(116),
  [42] = {.entry = {.count = 1, .reusable = true}}, SHIFT(72),
  [44] = {.entry = {.count = 1, .reusable = true}}, SHIFT(48),
  [46] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [48] = {.entry = {.count = 1, .reusable = true}}, SHIFT(33),
  [50] = {.entry = {.count = 1, .reusable = true}}, SHIFT(37),
  [52] = {.entry = {.count = 1, .reusable = true}}, SHIFT(49),
  [54] = {.entry = {.count = 1, .reusable = true}}, SHIFT(73),
  [56] = {.entry = {.count = 1, .reusable = true}}, SHIFT(74),
  [58] = {.entry = {.count = 1, .reusable = true}}, SHIFT(75),
  [60] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [62] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 1),
  [64] = {.entry = {.count = 1, .reusable = true}}, SHIFT(87),
  [66] = {.entry = {.count = 1, .reusable = true}}, SHIFT(46),
  [68] = {.entry = {.count = 1, .reusable = true}}, SHIFT(44),
  [70] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [72] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [74] = {.entry = {.count = 1, .reusable = true}}, SHIFT(79),
  [76] = {.entry = {.count = 1, .reusable = true}}, SHIFT(81),
  [78] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression, 1),
  [80] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression, 1),
  [82] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [84] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [86] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [88] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [90] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [92] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 2),
  [94] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 2),
  [96] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 2),
  [98] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 2),
  [100] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string_literal, 1),
  [102] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string_literal, 1),
  [104] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 3),
  [106] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 3),
  [108] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comparison, 3, .production_id = 2),
  [110] = {.entry = {.count = 1, .reusable = false}}, SHIFT(66),
  [112] = {.entry = {.count = 1, .reusable = true}}, SHIFT(66),
  [114] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comparison, 3, .production_id = 2),
  [116] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 3),
  [118] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 3),
  [120] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [122] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [124] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 5, .production_id = 3),
  [126] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 5, .production_id = 3),
  [128] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [130] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [132] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 6, .production_id = 3),
  [134] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 6, .production_id = 3),
  [136] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 6, .production_id = 4),
  [138] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 6, .production_id = 4),
  [140] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 4, .production_id = 3),
  [142] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 4, .production_id = 3),
  [144] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat2, 2),
  [146] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat2, 2),
  [148] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat2, 2), SHIFT_REPEAT(16),
  [151] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat2, 2), SHIFT_REPEAT(56),
  [154] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 7, .production_id = 4),
  [156] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 7, .production_id = 4),
  [158] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 5, .production_id = 4),
  [160] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 5, .production_id = 4),
  [162] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [164] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 2, .production_id = 3),
  [166] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_where_clause_repeat1, 2),
  [168] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_statement, 2),
  [170] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_statement, 2),
  [172] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [174] = {.entry = {.count = 1, .reusable = true}}, SHIFT(28),
  [176] = {.entry = {.count = 1, .reusable = true}}, SHIFT(105),
  [178] = {.entry = {.count = 1, .reusable = true}}, SHIFT(104),
  [180] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [182] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 6, .production_id = 4),
  [184] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 6, .production_id = 4),
  [186] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 4),
  [188] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 4),
  [190] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 3),
  [192] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 3),
  [194] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 4, .production_id = 3),
  [196] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 4, .production_id = 3),
  [198] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [200] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [202] = {.entry = {.count = 1, .reusable = false}}, SHIFT(77),
  [204] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_statement, 3),
  [206] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_statement, 3),
  [208] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 5, .production_id = 4),
  [210] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 5, .production_id = 4),
  [212] = {.entry = {.count = 1, .reusable = true}}, SHIFT(83),
  [214] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 4, .production_id = 3),
  [216] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 4, .production_id = 3),
  [218] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [220] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_definition, 6, .production_id = 6),
  [222] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_definition, 6, .production_id = 6),
  [224] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call_statement, 2),
  [226] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call_statement, 2),
  [228] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_assignment, 2),
  [230] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_assignment, 2),
  [232] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 2),
  [234] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2),
  [236] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_terminated_statement, 1),
  [238] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_terminated_statement, 1),
  [240] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 1),
  [242] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 1),
  [244] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_then_statement, 2),
  [246] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_then_statement, 2),
  [248] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 3),
  [250] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 3),
  [252] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 8, .production_id = 8),
  [254] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 8, .production_id = 8),
  [256] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [258] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [260] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 8),
  [262] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 8),
  [264] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 5),
  [266] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 5),
  [268] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_statement, 1),
  [270] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_statement, 1),
  [272] = {.entry = {.count = 1, .reusable = true}}, SHIFT(57),
  [274] = {.entry = {.count = 1, .reusable = true}}, SHIFT(24),
  [276] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 7),
  [278] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 7),
  [280] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 3),
  [282] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comment, 3),
  [284] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 5),
  [286] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 5),
  [288] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 6, .production_id = 4),
  [290] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 6, .production_id = 4),
  [292] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 5, .production_id = 3),
  [294] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 5, .production_id = 3),
  [296] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 2),
  [298] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comment, 2),
  [300] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 2),
  [302] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 2),
  [304] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, .production_id = 5),
  [306] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, .production_id = 5),
  [308] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2),
  [310] = {.entry = {.count = 1, .reusable = true}}, SHIFT(67),
  [312] = {.entry = {.count = 1, .reusable = true}}, SHIFT(115),
  [314] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [316] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assignment, 3),
  [318] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_where_clause_repeat1, 2), SHIFT_REPEAT(55),
  [321] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 3, .production_id = 4),
  [323] = {.entry = {.count = 1, .reusable = true}}, SHIFT(20),
  [325] = {.entry = {.count = 1, .reusable = true}}, SHIFT(126),
  [327] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(65),
  [330] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [332] = {.entry = {.count = 1, .reusable = false}}, SHIFT(71),
  [334] = {.entry = {.count = 1, .reusable = true}}, SHIFT(99),
  [336] = {.entry = {.count = 1, .reusable = false}}, SHIFT(99),
  [338] = {.entry = {.count = 1, .reusable = false}}, SHIFT(80),
  [340] = {.entry = {.count = 1, .reusable = true}}, SHIFT(122),
  [342] = {.entry = {.count = 1, .reusable = true}}, SHIFT(70),
  [344] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(99),
  [347] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(99),
  [350] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2),
  [352] = {.entry = {.count = 1, .reusable = true}}, SHIFT(97),
  [354] = {.entry = {.count = 1, .reusable = false}}, SHIFT(97),
  [356] = {.entry = {.count = 1, .reusable = false}}, SHIFT(85),
  [358] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(101),
  [361] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2),
  [363] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(101),
  [366] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2), SHIFT_REPEAT(122),
  [369] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2),
  [371] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(103),
  [374] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2),
  [376] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(103),
  [379] = {.entry = {.count = 1, .reusable = false}}, SHIFT(109),
  [381] = {.entry = {.count = 1, .reusable = false}}, SHIFT(25),
  [383] = {.entry = {.count = 1, .reusable = true}}, SHIFT(109),
  [385] = {.entry = {.count = 1, .reusable = false}}, SHIFT(107),
  [387] = {.entry = {.count = 1, .reusable = false}}, SHIFT(26),
  [389] = {.entry = {.count = 1, .reusable = true}}, SHIFT(107),
  [391] = {.entry = {.count = 1, .reusable = true}}, SHIFT(86),
  [393] = {.entry = {.count = 1, .reusable = false}}, SHIFT(103),
  [395] = {.entry = {.count = 1, .reusable = false}}, SHIFT(31),
  [397] = {.entry = {.count = 1, .reusable = true}}, SHIFT(103),
  [399] = {.entry = {.count = 1, .reusable = true}}, SHIFT(117),
  [401] = {.entry = {.count = 1, .reusable = false}}, SHIFT(101),
  [403] = {.entry = {.count = 1, .reusable = false}}, SHIFT(29),
  [405] = {.entry = {.count = 1, .reusable = true}}, SHIFT(101),
  [407] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [409] = {.entry = {.count = 1, .reusable = true}}, SHIFT(108),
  [411] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 2),
  [413] = {.entry = {.count = 1, .reusable = true}}, SHIFT(32),
  [415] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2), SHIFT_REPEAT(108),
  [418] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [420] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2), SHIFT_REPEAT(57),
  [423] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 1),
  [425] = {.entry = {.count = 1, .reusable = true}}, SHIFT(128),
  [427] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [429] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [431] = {.entry = {.count = 1, .reusable = true}}, SHIFT(129),
  [433] = {.entry = {.count = 1, .reusable = false}}, SHIFT(129),
  [435] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [437] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [439] = {.entry = {.count = 1, .reusable = true}}, SHIFT(19),
  [441] = {.entry = {.count = 1, .reusable = true}}, SHIFT(61),
  [443] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [445] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_primitive_type, 1),
  [447] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [449] = {.entry = {.count = 1, .reusable = true}}, SHIFT(89),
  [451] = {.entry = {.count = 1, .reusable = true}}, SHIFT(130),
  [453] = {.entry = {.count = 1, .reusable = true}}, SHIFT(94),
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
