#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 121
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 91
#define ALIAS_COUNT 0
#define TOKEN_COUNT 54
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 7
#define MAX_ALIAS_SEQUENCE_LENGTH 8
#define PRODUCTION_ID_COUNT 8

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
  anon_sym_AND = 10,
  anon_sym_OR = 11,
  anon_sym_SLASH_STAR = 12,
  aux_sym_comment_token1 = 13,
  aux_sym_comment_token2 = 14,
  anon_sym_STAR_SLASH = 15,
  anon_sym_LOGICAL = 16,
  anon_sym_INTEGER = 17,
  anon_sym_CHARACTER = 18,
  anon_sym_DECIMAL = 19,
  sym_number_literal = 20,
  anon_sym_DQUOTE = 21,
  aux_sym_double_quoted_string_token1 = 22,
  anon_sym_SQUOTE = 23,
  aux_sym_single_quoted_string_token1 = 24,
  anon_sym_DEFINE = 25,
  anon_sym_DEF = 26,
  anon_sym_VARIABLE = 27,
  anon_sym_VAR = 28,
  anon_sym_AS = 29,
  anon_sym_LPAREN = 30,
  anon_sym_COMMA = 31,
  anon_sym_RPAREN = 32,
  anon_sym_IF = 33,
  anon_sym_THENDO_COLON = 34,
  anon_sym_ELSEDO_COLON = 35,
  anon_sym_ELSEIF = 36,
  anon_sym_THEN = 37,
  anon_sym_ELSE = 38,
  anon_sym_REPEAT_COLON = 39,
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
  anon_sym_DISPLAY = 51,
  anon_sym_PUT = 52,
  anon_sym_ASSIGN = 53,
  sym_source_code = 54,
  sym_expression = 55,
  sym_comparison = 56,
  sym_statement = 57,
  sym_terminated_statement = 58,
  sym_conditions = 59,
  sym_comment = 60,
  sym_primitive_type = 61,
  sym_string_literal = 62,
  sym_double_quoted_string = 63,
  sym_single_quoted_string = 64,
  sym_assignment = 65,
  sym_variable_definition = 66,
  sym_variable_assignment = 67,
  sym_function_call_statement = 68,
  sym_function_call = 69,
  sym_if_statement = 70,
  sym_if_do_statement = 71,
  sym_else_do_statement = 72,
  sym_else_do_if_statement = 73,
  sym_if_then_statement = 74,
  sym_else_then_statement = 75,
  sym_where_clause = 76,
  sym_query_tunings = 77,
  sym_for_statement = 78,
  sym_abl_statement = 79,
  sym_assign_statement = 80,
  aux_sym_source_code_repeat1 = 81,
  aux_sym_conditions_repeat1 = 82,
  aux_sym_comment_repeat1 = 83,
  aux_sym_double_quoted_string_repeat1 = 84,
  aux_sym_single_quoted_string_repeat1 = 85,
  aux_sym_function_call_repeat1 = 86,
  aux_sym_if_do_statement_repeat1 = 87,
  aux_sym_query_tunings_repeat1 = 88,
  aux_sym_abl_statement_repeat1 = 89,
  aux_sym_assign_statement_repeat1 = 90,
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
  [anon_sym_AND] = "AND",
  [anon_sym_OR] = "OR",
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
  [anon_sym_IF] = "IF",
  [anon_sym_THENDO_COLON] = "THEN DO:",
  [anon_sym_ELSEDO_COLON] = "ELSE DO:",
  [anon_sym_ELSEIF] = "ELSE IF",
  [anon_sym_THEN] = "THEN",
  [anon_sym_ELSE] = "ELSE",
  [anon_sym_REPEAT_COLON] = "REPEAT:",
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
  [anon_sym_DISPLAY] = "DISPLAY",
  [anon_sym_PUT] = "PUT",
  [anon_sym_ASSIGN] = "ASSIGN",
  [sym_source_code] = "source_code",
  [sym_expression] = "expression",
  [sym_comparison] = "comparison",
  [sym_statement] = "statement",
  [sym_terminated_statement] = "terminated_statement",
  [sym_conditions] = "conditions",
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
  [sym_if_statement] = "if_statement",
  [sym_if_do_statement] = "if_do_statement",
  [sym_else_do_statement] = "else_do_statement",
  [sym_else_do_if_statement] = "else_do_if_statement",
  [sym_if_then_statement] = "if_then_statement",
  [sym_else_then_statement] = "else_then_statement",
  [sym_where_clause] = "where_clause",
  [sym_query_tunings] = "query_tunings",
  [sym_for_statement] = "for_statement",
  [sym_abl_statement] = "abl_statement",
  [sym_assign_statement] = "assign_statement",
  [aux_sym_source_code_repeat1] = "source_code_repeat1",
  [aux_sym_conditions_repeat1] = "conditions_repeat1",
  [aux_sym_comment_repeat1] = "comment_repeat1",
  [aux_sym_double_quoted_string_repeat1] = "double_quoted_string_repeat1",
  [aux_sym_single_quoted_string_repeat1] = "single_quoted_string_repeat1",
  [aux_sym_function_call_repeat1] = "function_call_repeat1",
  [aux_sym_if_do_statement_repeat1] = "if_do_statement_repeat1",
  [aux_sym_query_tunings_repeat1] = "query_tunings_repeat1",
  [aux_sym_abl_statement_repeat1] = "abl_statement_repeat1",
  [aux_sym_assign_statement_repeat1] = "assign_statement_repeat1",
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
  [anon_sym_AND] = anon_sym_AND,
  [anon_sym_OR] = anon_sym_OR,
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
  [anon_sym_IF] = anon_sym_IF,
  [anon_sym_THENDO_COLON] = anon_sym_THENDO_COLON,
  [anon_sym_ELSEDO_COLON] = anon_sym_ELSEDO_COLON,
  [anon_sym_ELSEIF] = anon_sym_ELSEIF,
  [anon_sym_THEN] = anon_sym_THEN,
  [anon_sym_ELSE] = anon_sym_ELSE,
  [anon_sym_REPEAT_COLON] = anon_sym_REPEAT_COLON,
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
  [anon_sym_DISPLAY] = anon_sym_DISPLAY,
  [anon_sym_PUT] = anon_sym_PUT,
  [anon_sym_ASSIGN] = anon_sym_ASSIGN,
  [sym_source_code] = sym_source_code,
  [sym_expression] = sym_expression,
  [sym_comparison] = sym_comparison,
  [sym_statement] = sym_statement,
  [sym_terminated_statement] = sym_terminated_statement,
  [sym_conditions] = sym_conditions,
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
  [sym_if_statement] = sym_if_statement,
  [sym_if_do_statement] = sym_if_do_statement,
  [sym_else_do_statement] = sym_else_do_statement,
  [sym_else_do_if_statement] = sym_else_do_if_statement,
  [sym_if_then_statement] = sym_if_then_statement,
  [sym_else_then_statement] = sym_else_then_statement,
  [sym_where_clause] = sym_where_clause,
  [sym_query_tunings] = sym_query_tunings,
  [sym_for_statement] = sym_for_statement,
  [sym_abl_statement] = sym_abl_statement,
  [sym_assign_statement] = sym_assign_statement,
  [aux_sym_source_code_repeat1] = aux_sym_source_code_repeat1,
  [aux_sym_conditions_repeat1] = aux_sym_conditions_repeat1,
  [aux_sym_comment_repeat1] = aux_sym_comment_repeat1,
  [aux_sym_double_quoted_string_repeat1] = aux_sym_double_quoted_string_repeat1,
  [aux_sym_single_quoted_string_repeat1] = aux_sym_single_quoted_string_repeat1,
  [aux_sym_function_call_repeat1] = aux_sym_function_call_repeat1,
  [aux_sym_if_do_statement_repeat1] = aux_sym_if_do_statement_repeat1,
  [aux_sym_query_tunings_repeat1] = aux_sym_query_tunings_repeat1,
  [aux_sym_abl_statement_repeat1] = aux_sym_abl_statement_repeat1,
  [aux_sym_assign_statement_repeat1] = aux_sym_assign_statement_repeat1,
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
  [anon_sym_AND] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_OR] = {
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
  [anon_sym_IF] = {
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
  [anon_sym_REPEAT_COLON] = {
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
  [anon_sym_DISPLAY] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PUT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_ASSIGN] = {
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
  [sym_conditions] = {
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
  [sym_abl_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_assign_statement] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_source_code_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_conditions_repeat1] = {
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
  [aux_sym_if_do_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_query_tunings_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_abl_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_assign_statement_repeat1] = {
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
  [6] = {.index = 7, .length = 3},
  [7] = {.index = 10, .length = 3},
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
    {field_query_tunings, 3},
    {field_table, 2},
    {field_type, 1},
  [10] =
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
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(134);
      if (lookahead == '"') ADVANCE(156);
      if (lookahead == '\'') ADVANCE(159);
      if (lookahead == '(') ADVANCE(168);
      if (lookahead == ')') ADVANCE(170);
      if (lookahead == '*') ADVANCE(11);
      if (lookahead == ',') ADVANCE(169);
      if (lookahead == '.') ADVANCE(136);
      if (lookahead == '/') ADVANCE(6);
      if (lookahead == ':') ADVANCE(188);
      if (lookahead == '<') ADVANCE(138);
      if (lookahead == '=') ADVANCE(141);
      if (lookahead == '>') ADVANCE(142);
      if (lookahead == 'A') ADVANCE(89);
      if (lookahead == 'C') ADVANCE(67);
      if (lookahead == 'D') ADVANCE(41);
      if (lookahead == 'E') ADVANCE(15);
      if (lookahead == 'F') ADVANCE(71);
      if (lookahead == 'I') ADVANCE(58);
      if (lookahead == 'L') ADVANCE(18);
      if (lookahead == 'N') ADVANCE(93);
      if (lookahead == 'O') ADVANCE(102);
      if (lookahead == 'P') ADVANCE(127);
      if (lookahead == 'R') ADVANCE(42);
      if (lookahead == 'S') ADVANCE(68);
      if (lookahead == 'T') ADVANCE(65);
      if (lookahead == 'V') ADVANCE(20);
      if (lookahead == 'W') ADVANCE(66);
      if (lookahead == '\\') ADVANCE(131);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(155);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 1:
      if (lookahead == ' ') ADVANCE(40);
      END_STATE();
    case 2:
      if (lookahead == ' ') ADVANCE(183);
      if (lookahead == ':') ADVANCE(188);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r') SKIP(2)
      END_STATE();
    case 3:
      if (lookahead == '"') ADVANCE(156);
      if (lookahead == '\\') ADVANCE(131);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(157);
      if (lookahead != 0) ADVANCE(158);
      END_STATE();
    case 4:
      if (lookahead == '\'') ADVANCE(159);
      if (lookahead == '\\') ADVANCE(131);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(160);
      if (lookahead != 0) ADVANCE(161);
      END_STATE();
    case 5:
      if (lookahead == '*') ADVANCE(11);
      if (lookahead == '\\') ADVANCE(131);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(147);
      if (lookahead != 0 &&
          lookahead != '/') ADVANCE(148);
      END_STATE();
    case 6:
      if (lookahead == '*') ADVANCE(146);
      END_STATE();
    case 7:
      if (lookahead == '-') ADVANCE(80);
      END_STATE();
    case 8:
      if (lookahead == '-') ADVANCE(85);
      END_STATE();
    case 9:
      if (lookahead == '-') ADVANCE(87);
      END_STATE();
    case 10:
      if (lookahead == '.') ADVANCE(137);
      END_STATE();
    case 11:
      if (lookahead == '/') ADVANCE(150);
      END_STATE();
    case 12:
      if (lookahead == ':') ADVANCE(177);
      END_STATE();
    case 13:
      if (lookahead == ':') ADVANCE(172);
      END_STATE();
    case 14:
      if (lookahead == ':') ADVANCE(173);
      END_STATE();
    case 15:
      if (lookahead == 'A') ADVANCE(33);
      if (lookahead == 'L') ADVANCE(115);
      if (lookahead == 'N') ADVANCE(38);
      if (lookahead == 'X') ADVANCE(29);
      END_STATE();
    case 16:
      if (lookahead == 'A') ADVANCE(28);
      END_STATE();
    case 17:
      if (lookahead == 'A') ADVANCE(130);
      END_STATE();
    case 18:
      if (lookahead == 'A') ADVANCE(114);
      if (lookahead == 'O') ADVANCE(61);
      END_STATE();
    case 19:
      if (lookahead == 'A') ADVANCE(78);
      END_STATE();
    case 20:
      if (lookahead == 'A') ADVANCE(104);
      END_STATE();
    case 21:
      if (lookahead == 'A') ADVANCE(36);
      END_STATE();
    case 22:
      if (lookahead == 'A') ADVANCE(74);
      END_STATE();
    case 23:
      if (lookahead == 'A') ADVANCE(79);
      END_STATE();
    case 24:
      if (lookahead == 'A') ADVANCE(107);
      END_STATE();
    case 25:
      if (lookahead == 'A') ADVANCE(123);
      END_STATE();
    case 26:
      if (lookahead == 'A') ADVANCE(108);
      END_STATE();
    case 27:
      if (lookahead == 'A') ADVANCE(112);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(27)
      END_STATE();
    case 28:
      if (lookahead == 'B') ADVANCE(84);
      END_STATE();
    case 29:
      if (lookahead == 'C') ADVANCE(81);
      END_STATE();
    case 30:
      if (lookahead == 'C') ADVANCE(75);
      END_STATE();
    case 31:
      if (lookahead == 'C') ADVANCE(69);
      if (lookahead == 'F') ADVANCE(163);
      END_STATE();
    case 32:
      if (lookahead == 'C') ADVANCE(76);
      END_STATE();
    case 33:
      if (lookahead == 'C') ADVANCE(64);
      END_STATE();
    case 34:
      if (lookahead == 'C') ADVANCE(77);
      END_STATE();
    case 35:
      if (lookahead == 'C') ADVANCE(23);
      END_STATE();
    case 36:
      if (lookahead == 'C') ADVANCE(126);
      END_STATE();
    case 37:
      if (lookahead == 'D') ADVANCE(144);
      END_STATE();
    case 38:
      if (lookahead == 'D') ADVANCE(10);
      END_STATE();
    case 39:
      if (lookahead == 'D') ADVANCE(94);
      END_STATE();
    case 40:
      if (lookahead == 'D') ADVANCE(96);
      if (lookahead == 'I') ADVANCE(60);
      END_STATE();
    case 41:
      if (lookahead == 'E') ADVANCE(31);
      if (lookahead == 'I') ADVANCE(113);
      END_STATE();
    case 42:
      if (lookahead == 'E') ADVANCE(101);
      END_STATE();
    case 43:
      if (lookahead == 'E') ADVANCE(90);
      END_STATE();
    case 44:
      if (lookahead == 'E') ADVANCE(176);
      END_STATE();
    case 45:
      if (lookahead == 'E') ADVANCE(178);
      END_STATE();
    case 46:
      if (lookahead == 'E') ADVANCE(162);
      END_STATE();
    case 47:
      if (lookahead == 'E') ADVANCE(164);
      END_STATE();
    case 48:
      if (lookahead == 'E') ADVANCE(1);
      END_STATE();
    case 49:
      if (lookahead == 'E') ADVANCE(8);
      END_STATE();
    case 50:
      if (lookahead == 'E') ADVANCE(59);
      if (lookahead == 'I') ADVANCE(113);
      END_STATE();
    case 51:
      if (lookahead == 'E') ADVANCE(63);
      END_STATE();
    case 52:
      if (lookahead == 'E') ADVANCE(25);
      END_STATE();
    case 53:
      if (lookahead == 'E') ADVANCE(105);
      END_STATE();
    case 54:
      if (lookahead == 'E') ADVANCE(106);
      END_STATE();
    case 55:
      if (lookahead == 'E') ADVANCE(109);
      END_STATE();
    case 56:
      if (lookahead == 'E') ADVANCE(9);
      END_STATE();
    case 57:
      if (lookahead == 'F') ADVANCE(171);
      END_STATE();
    case 58:
      if (lookahead == 'F') ADVANCE(171);
      if (lookahead == 'N') ADVANCE(125);
      END_STATE();
    case 59:
      if (lookahead == 'F') ADVANCE(163);
      END_STATE();
    case 60:
      if (lookahead == 'F') ADVANCE(174);
      END_STATE();
    case 61:
      if (lookahead == 'G') ADVANCE(73);
      END_STATE();
    case 62:
      if (lookahead == 'G') ADVANCE(91);
      END_STATE();
    case 63:
      if (lookahead == 'G') ADVANCE(53);
      END_STATE();
    case 64:
      if (lookahead == 'H') ADVANCE(185);
      END_STATE();
    case 65:
      if (lookahead == 'H') ADVANCE(43);
      END_STATE();
    case 66:
      if (lookahead == 'H') ADVANCE(55);
      END_STATE();
    case 67:
      if (lookahead == 'H') ADVANCE(24);
      END_STATE();
    case 68:
      if (lookahead == 'H') ADVANCE(26);
      END_STATE();
    case 69:
      if (lookahead == 'I') ADVANCE(88);
      END_STATE();
    case 70:
      if (lookahead == 'I') ADVANCE(129);
      END_STATE();
    case 71:
      if (lookahead == 'I') ADVANCE(110);
      if (lookahead == 'O') ADVANCE(103);
      END_STATE();
    case 72:
      if (lookahead == 'I') ADVANCE(62);
      END_STATE();
    case 73:
      if (lookahead == 'I') ADVANCE(35);
      END_STATE();
    case 74:
      if (lookahead == 'I') ADVANCE(124);
      END_STATE();
    case 75:
      if (lookahead == 'K') ADVANCE(179);
      END_STATE();
    case 76:
      if (lookahead == 'K') ADVANCE(181);
      END_STATE();
    case 77:
      if (lookahead == 'K') ADVANCE(182);
      END_STATE();
    case 78:
      if (lookahead == 'L') ADVANCE(154);
      END_STATE();
    case 79:
      if (lookahead == 'L') ADVANCE(151);
      END_STATE();
    case 80:
      if (lookahead == 'L') ADVANCE(97);
      if (lookahead == 'W') ADVANCE(22);
      END_STATE();
    case 81:
      if (lookahead == 'L') ADVANCE(128);
      END_STATE();
    case 82:
      if (lookahead == 'L') ADVANCE(115);
      if (lookahead == 'N') ADVANCE(38);
      END_STATE();
    case 83:
      if (lookahead == 'L') ADVANCE(17);
      END_STATE();
    case 84:
      if (lookahead == 'L') ADVANCE(47);
      END_STATE();
    case 85:
      if (lookahead == 'L') ADVANCE(98);
      END_STATE();
    case 86:
      if (lookahead == 'L') ADVANCE(119);
      if (lookahead == 'N') ADVANCE(38);
      END_STATE();
    case 87:
      if (lookahead == 'L') ADVANCE(99);
      END_STATE();
    case 88:
      if (lookahead == 'M') ADVANCE(19);
      END_STATE();
    case 89:
      if (lookahead == 'N') ADVANCE(37);
      if (lookahead == 'S') ADVANCE(167);
      END_STATE();
    case 90:
      if (lookahead == 'N') ADVANCE(175);
      END_STATE();
    case 91:
      if (lookahead == 'N') ADVANCE(191);
      END_STATE();
    case 92:
      if (lookahead == 'N') ADVANCE(46);
      END_STATE();
    case 93:
      if (lookahead == 'O') ADVANCE(7);
      END_STATE();
    case 94:
      if (lookahead == 'O') ADVANCE(13);
      END_STATE();
    case 95:
      if (lookahead == 'O') ADVANCE(103);
      END_STATE();
    case 96:
      if (lookahead == 'O') ADVANCE(14);
      END_STATE();
    case 97:
      if (lookahead == 'O') ADVANCE(30);
      END_STATE();
    case 98:
      if (lookahead == 'O') ADVANCE(32);
      END_STATE();
    case 99:
      if (lookahead == 'O') ADVANCE(34);
      END_STATE();
    case 100:
      if (lookahead == 'P') ADVANCE(83);
      END_STATE();
    case 101:
      if (lookahead == 'P') ADVANCE(52);
      END_STATE();
    case 102:
      if (lookahead == 'R') ADVANCE(145);
      END_STATE();
    case 103:
      if (lookahead == 'R') ADVANCE(184);
      END_STATE();
    case 104:
      if (lookahead == 'R') ADVANCE(165);
      END_STATE();
    case 105:
      if (lookahead == 'R') ADVANCE(152);
      END_STATE();
    case 106:
      if (lookahead == 'R') ADVANCE(153);
      END_STATE();
    case 107:
      if (lookahead == 'R') ADVANCE(21);
      END_STATE();
    case 108:
      if (lookahead == 'R') ADVANCE(49);
      END_STATE();
    case 109:
      if (lookahead == 'R') ADVANCE(45);
      END_STATE();
    case 110:
      if (lookahead == 'R') ADVANCE(116);
      END_STATE();
    case 111:
      if (lookahead == 'S') ADVANCE(72);
      END_STATE();
    case 112:
      if (lookahead == 'S') ADVANCE(166);
      END_STATE();
    case 113:
      if (lookahead == 'S') ADVANCE(100);
      END_STATE();
    case 114:
      if (lookahead == 'S') ADVANCE(121);
      END_STATE();
    case 115:
      if (lookahead == 'S') ADVANCE(44);
      END_STATE();
    case 116:
      if (lookahead == 'S') ADVANCE(122);
      END_STATE();
    case 117:
      if (lookahead == 'S') ADVANCE(70);
      END_STATE();
    case 118:
      if (lookahead == 'S') ADVANCE(111);
      END_STATE();
    case 119:
      if (lookahead == 'S') ADVANCE(48);
      END_STATE();
    case 120:
      if (lookahead == 'T') ADVANCE(190);
      END_STATE();
    case 121:
      if (lookahead == 'T') ADVANCE(187);
      END_STATE();
    case 122:
      if (lookahead == 'T') ADVANCE(186);
      END_STATE();
    case 123:
      if (lookahead == 'T') ADVANCE(12);
      END_STATE();
    case 124:
      if (lookahead == 'T') ADVANCE(180);
      END_STATE();
    case 125:
      if (lookahead == 'T') ADVANCE(51);
      END_STATE();
    case 126:
      if (lookahead == 'T') ADVANCE(54);
      END_STATE();
    case 127:
      if (lookahead == 'U') ADVANCE(120);
      END_STATE();
    case 128:
      if (lookahead == 'U') ADVANCE(117);
      END_STATE();
    case 129:
      if (lookahead == 'V') ADVANCE(56);
      END_STATE();
    case 130:
      if (lookahead == 'Y') ADVANCE(189);
      END_STATE();
    case 131:
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(149);
      END_STATE();
    case 132:
      if (eof) ADVANCE(134);
      if (lookahead == '/') ADVANCE(6);
      if (lookahead == 'A') ADVANCE(118);
      if (lookahead == 'D') ADVANCE(50);
      if (lookahead == 'E') ADVANCE(86);
      if (lookahead == 'F') ADVANCE(95);
      if (lookahead == 'I') ADVANCE(57);
      if (lookahead == 'P') ADVANCE(127);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(132)
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 133:
      if (eof) ADVANCE(134);
      if (lookahead == '/') ADVANCE(6);
      if (lookahead == 'A') ADVANCE(118);
      if (lookahead == 'D') ADVANCE(50);
      if (lookahead == 'E') ADVANCE(82);
      if (lookahead == 'F') ADVANCE(95);
      if (lookahead == 'I') ADVANCE(57);
      if (lookahead == 'P') ADVANCE(127);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(133)
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 134:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 135:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(135);
      END_STATE();
    case 136:
      ACCEPT_TOKEN(sym_terminator);
      END_STATE();
    case 137:
      ACCEPT_TOKEN(sym_block_terminator);
      END_STATE();
    case 138:
      ACCEPT_TOKEN(anon_sym_LT);
      if (lookahead == '=') ADVANCE(139);
      if (lookahead == '>') ADVANCE(140);
      END_STATE();
    case 139:
      ACCEPT_TOKEN(anon_sym_LT_EQ);
      END_STATE();
    case 140:
      ACCEPT_TOKEN(anon_sym_LT_GT);
      END_STATE();
    case 141:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 142:
      ACCEPT_TOKEN(anon_sym_GT);
      if (lookahead == '=') ADVANCE(143);
      END_STATE();
    case 143:
      ACCEPT_TOKEN(anon_sym_GT_EQ);
      END_STATE();
    case 144:
      ACCEPT_TOKEN(anon_sym_AND);
      END_STATE();
    case 145:
      ACCEPT_TOKEN(anon_sym_OR);
      END_STATE();
    case 146:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      END_STATE();
    case 147:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(147);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(148);
      END_STATE();
    case 148:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(148);
      END_STATE();
    case 149:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      END_STATE();
    case 150:
      ACCEPT_TOKEN(anon_sym_STAR_SLASH);
      END_STATE();
    case 151:
      ACCEPT_TOKEN(anon_sym_LOGICAL);
      END_STATE();
    case 152:
      ACCEPT_TOKEN(anon_sym_INTEGER);
      END_STATE();
    case 153:
      ACCEPT_TOKEN(anon_sym_CHARACTER);
      END_STATE();
    case 154:
      ACCEPT_TOKEN(anon_sym_DECIMAL);
      END_STATE();
    case 155:
      ACCEPT_TOKEN(sym_number_literal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(155);
      END_STATE();
    case 156:
      ACCEPT_TOKEN(anon_sym_DQUOTE);
      END_STATE();
    case 157:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(157);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(158);
      END_STATE();
    case 158:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(158);
      END_STATE();
    case 159:
      ACCEPT_TOKEN(anon_sym_SQUOTE);
      END_STATE();
    case 160:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(160);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(161);
      END_STATE();
    case 161:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(161);
      END_STATE();
    case 162:
      ACCEPT_TOKEN(anon_sym_DEFINE);
      END_STATE();
    case 163:
      ACCEPT_TOKEN(anon_sym_DEF);
      if (lookahead == 'I') ADVANCE(92);
      END_STATE();
    case 164:
      ACCEPT_TOKEN(anon_sym_VARIABLE);
      END_STATE();
    case 165:
      ACCEPT_TOKEN(anon_sym_VAR);
      if (lookahead == 'I') ADVANCE(16);
      END_STATE();
    case 166:
      ACCEPT_TOKEN(anon_sym_AS);
      END_STATE();
    case 167:
      ACCEPT_TOKEN(anon_sym_AS);
      if (lookahead == 'S') ADVANCE(72);
      END_STATE();
    case 168:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 169:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 170:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 171:
      ACCEPT_TOKEN(anon_sym_IF);
      END_STATE();
    case 172:
      ACCEPT_TOKEN(anon_sym_THENDO_COLON);
      END_STATE();
    case 173:
      ACCEPT_TOKEN(anon_sym_ELSEDO_COLON);
      END_STATE();
    case 174:
      ACCEPT_TOKEN(anon_sym_ELSEIF);
      END_STATE();
    case 175:
      ACCEPT_TOKEN(anon_sym_THEN);
      if (lookahead == ' ') ADVANCE(39);
      END_STATE();
    case 176:
      ACCEPT_TOKEN(anon_sym_ELSE);
      END_STATE();
    case 177:
      ACCEPT_TOKEN(anon_sym_REPEAT_COLON);
      END_STATE();
    case 178:
      ACCEPT_TOKEN(anon_sym_WHERE);
      END_STATE();
    case 179:
      ACCEPT_TOKEN(anon_sym_NO_DASHLOCK);
      END_STATE();
    case 180:
      ACCEPT_TOKEN(anon_sym_NO_DASHWAIT);
      END_STATE();
    case 181:
      ACCEPT_TOKEN(anon_sym_SHARE_DASHLOCK);
      END_STATE();
    case 182:
      ACCEPT_TOKEN(anon_sym_EXCLUSIVE_DASHLOCK);
      END_STATE();
    case 183:
      ACCEPT_TOKEN(anon_sym_);
      if (lookahead == ' ') ADVANCE(183);
      END_STATE();
    case 184:
      ACCEPT_TOKEN(anon_sym_FOR);
      END_STATE();
    case 185:
      ACCEPT_TOKEN(anon_sym_EACH);
      END_STATE();
    case 186:
      ACCEPT_TOKEN(anon_sym_FIRST);
      END_STATE();
    case 187:
      ACCEPT_TOKEN(anon_sym_LAST);
      END_STATE();
    case 188:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 189:
      ACCEPT_TOKEN(anon_sym_DISPLAY);
      END_STATE();
    case 190:
      ACCEPT_TOKEN(anon_sym_PUT);
      END_STATE();
    case 191:
      ACCEPT_TOKEN(anon_sym_ASSIGN);
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
  [1] = {.lex_state = 132},
  [2] = {.lex_state = 132},
  [3] = {.lex_state = 132},
  [4] = {.lex_state = 132},
  [5] = {.lex_state = 132},
  [6] = {.lex_state = 132},
  [7] = {.lex_state = 132},
  [8] = {.lex_state = 132},
  [9] = {.lex_state = 132},
  [10] = {.lex_state = 132},
  [11] = {.lex_state = 132},
  [12] = {.lex_state = 132},
  [13] = {.lex_state = 132},
  [14] = {.lex_state = 132},
  [15] = {.lex_state = 132},
  [16] = {.lex_state = 132},
  [17] = {.lex_state = 132},
  [18] = {.lex_state = 0},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 0},
  [21] = {.lex_state = 0},
  [22] = {.lex_state = 0},
  [23] = {.lex_state = 0},
  [24] = {.lex_state = 0},
  [25] = {.lex_state = 0},
  [26] = {.lex_state = 0},
  [27] = {.lex_state = 0},
  [28] = {.lex_state = 0},
  [29] = {.lex_state = 132},
  [30] = {.lex_state = 132},
  [31] = {.lex_state = 132},
  [32] = {.lex_state = 0},
  [33] = {.lex_state = 132},
  [34] = {.lex_state = 132},
  [35] = {.lex_state = 0},
  [36] = {.lex_state = 133},
  [37] = {.lex_state = 132},
  [38] = {.lex_state = 132},
  [39] = {.lex_state = 132},
  [40] = {.lex_state = 132},
  [41] = {.lex_state = 133},
  [42] = {.lex_state = 0},
  [43] = {.lex_state = 133},
  [44] = {.lex_state = 133},
  [45] = {.lex_state = 0},
  [46] = {.lex_state = 0},
  [47] = {.lex_state = 133},
  [48] = {.lex_state = 132},
  [49] = {.lex_state = 132},
  [50] = {.lex_state = 132},
  [51] = {.lex_state = 132},
  [52] = {.lex_state = 132},
  [53] = {.lex_state = 132},
  [54] = {.lex_state = 0},
  [55] = {.lex_state = 132},
  [56] = {.lex_state = 132},
  [57] = {.lex_state = 132},
  [58] = {.lex_state = 0},
  [59] = {.lex_state = 132},
  [60] = {.lex_state = 132},
  [61] = {.lex_state = 132},
  [62] = {.lex_state = 132},
  [63] = {.lex_state = 132},
  [64] = {.lex_state = 132},
  [65] = {.lex_state = 0},
  [66] = {.lex_state = 132},
  [67] = {.lex_state = 0},
  [68] = {.lex_state = 132},
  [69] = {.lex_state = 132},
  [70] = {.lex_state = 0},
  [71] = {.lex_state = 0},
  [72] = {.lex_state = 0},
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
  [83] = {.lex_state = 0},
  [84] = {.lex_state = 0},
  [85] = {.lex_state = 0},
  [86] = {.lex_state = 4},
  [87] = {.lex_state = 3},
  [88] = {.lex_state = 4},
  [89] = {.lex_state = 5},
  [90] = {.lex_state = 0},
  [91] = {.lex_state = 3},
  [92] = {.lex_state = 0},
  [93] = {.lex_state = 4},
  [94] = {.lex_state = 5},
  [95] = {.lex_state = 5},
  [96] = {.lex_state = 3},
  [97] = {.lex_state = 0},
  [98] = {.lex_state = 0},
  [99] = {.lex_state = 2},
  [100] = {.lex_state = 0},
  [101] = {.lex_state = 0},
  [102] = {.lex_state = 0},
  [103] = {.lex_state = 2},
  [104] = {.lex_state = 2},
  [105] = {.lex_state = 0},
  [106] = {.lex_state = 2},
  [107] = {.lex_state = 0},
  [108] = {.lex_state = 0},
  [109] = {.lex_state = 0},
  [110] = {.lex_state = 0},
  [111] = {.lex_state = 0},
  [112] = {.lex_state = 0},
  [113] = {.lex_state = 0},
  [114] = {.lex_state = 0},
  [115] = {.lex_state = 0},
  [116] = {.lex_state = 0},
  [117] = {.lex_state = 27},
  [118] = {.lex_state = 0},
  [119] = {.lex_state = 0},
  [120] = {.lex_state = 0},
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
    [anon_sym_AND] = ACTIONS(1),
    [anon_sym_OR] = ACTIONS(1),
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
    [anon_sym_IF] = ACTIONS(1),
    [anon_sym_THENDO_COLON] = ACTIONS(1),
    [anon_sym_THEN] = ACTIONS(1),
    [anon_sym_ELSE] = ACTIONS(1),
    [anon_sym_REPEAT_COLON] = ACTIONS(1),
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
    [anon_sym_DISPLAY] = ACTIONS(1),
    [anon_sym_PUT] = ACTIONS(1),
    [anon_sym_ASSIGN] = ACTIONS(1),
  },
  [1] = {
    [sym_source_code] = STATE(116),
    [sym_statement] = STATE(15),
    [sym_comment] = STATE(61),
    [sym_assignment] = STATE(115),
    [sym_variable_definition] = STATE(61),
    [sym_variable_assignment] = STATE(61),
    [sym_function_call_statement] = STATE(61),
    [sym_function_call] = STATE(114),
    [sym_if_statement] = STATE(61),
    [sym_if_do_statement] = STATE(57),
    [sym_if_then_statement] = STATE(57),
    [sym_for_statement] = STATE(61),
    [sym_abl_statement] = STATE(61),
    [sym_assign_statement] = STATE(59),
    [aux_sym_source_code_repeat1] = STATE(15),
    [ts_builtin_sym_end] = ACTIONS(3),
    [sym_identifier] = ACTIONS(5),
    [anon_sym_SLASH_STAR] = ACTIONS(7),
    [anon_sym_DEFINE] = ACTIONS(9),
    [anon_sym_DEF] = ACTIONS(11),
    [anon_sym_IF] = ACTIONS(13),
    [anon_sym_FOR] = ACTIONS(15),
    [anon_sym_DISPLAY] = ACTIONS(17),
    [anon_sym_PUT] = ACTIONS(17),
    [anon_sym_ASSIGN] = ACTIONS(19),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 15,
    ACTIONS(23), 1,
      sym_identifier,
    ACTIONS(26), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      anon_sym_DEFINE,
    ACTIONS(32), 1,
      anon_sym_DEF,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(38), 1,
      anon_sym_FOR,
    ACTIONS(44), 1,
      anon_sym_ASSIGN,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(21), 2,
      ts_builtin_sym_end,
      sym_block_terminator,
    ACTIONS(41), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [56] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(47), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(6), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [111] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(49), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [166] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(51), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(13), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [221] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(53), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [276] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(55), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(4), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [331] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(57), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [386] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(49), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(14), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [441] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(59), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [496] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(61), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(17), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [551] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(63), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(8), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [606] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(65), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [661] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(67), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [716] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(69), 1,
      ts_builtin_sym_end,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [771] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(71), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(10), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [826] = 15,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(7), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    ACTIONS(13), 1,
      anon_sym_IF,
    ACTIONS(15), 1,
      anon_sym_FOR,
    ACTIONS(19), 1,
      anon_sym_ASSIGN,
    ACTIONS(73), 1,
      sym_block_terminator,
    STATE(59), 1,
      sym_assign_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    ACTIONS(17), 2,
      anon_sym_DISPLAY,
      anon_sym_PUT,
    STATE(2), 2,
      sym_statement,
      aux_sym_source_code_repeat1,
    STATE(57), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(61), 7,
      sym_comment,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_for_statement,
      sym_abl_statement,
  [881] = 3,
    ACTIONS(79), 1,
      anon_sym_LPAREN,
    ACTIONS(77), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(75), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [911] = 2,
    ACTIONS(83), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(81), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [938] = 2,
    ACTIONS(87), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(85), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [965] = 2,
    ACTIONS(91), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(89), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [992] = 2,
    ACTIONS(95), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(93), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1019] = 2,
    ACTIONS(99), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(97), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1046] = 2,
    ACTIONS(103), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(101), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1073] = 2,
    ACTIONS(107), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(105), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1100] = 2,
    ACTIONS(77), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(75), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1127] = 2,
    ACTIONS(111), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(109), 19,
      sym_identifier,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1154] = 4,
    ACTIONS(119), 1,
      anon_sym_THEN,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(113), 15,
      sym_identifier,
      sym_terminator,
      anon_sym_AND,
      anon_sym_OR,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1185] = 5,
    ACTIONS(123), 1,
      anon_sym_DEF,
    ACTIONS(125), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(127), 1,
      anon_sym_ELSEIF,
    STATE(33), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(121), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1212] = 5,
    ACTIONS(125), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(127), 1,
      anon_sym_ELSEIF,
    ACTIONS(131), 1,
      anon_sym_DEF,
    STATE(34), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(129), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1239] = 5,
    ACTIONS(125), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(127), 1,
      anon_sym_ELSEIF,
    ACTIONS(135), 1,
      anon_sym_DEF,
    STATE(29), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(133), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1266] = 6,
    ACTIONS(141), 1,
      anon_sym_THEN,
    STATE(75), 1,
      aux_sym_conditions_repeat1,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(137), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(139), 6,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1295] = 5,
    ACTIONS(145), 1,
      anon_sym_DEF,
    ACTIONS(147), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(150), 1,
      anon_sym_ELSEIF,
    STATE(33), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(143), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1322] = 5,
    ACTIONS(125), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(127), 1,
      anon_sym_ELSEIF,
    ACTIONS(135), 1,
      anon_sym_DEF,
    STATE(33), 3,
      sym_else_do_statement,
      sym_else_do_if_statement,
      aux_sym_if_do_statement_repeat1,
    ACTIONS(133), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1349] = 4,
    ACTIONS(155), 1,
      anon_sym_THEN,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(153), 8,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [1373] = 4,
    ACTIONS(159), 1,
      anon_sym_DEF,
    ACTIONS(161), 1,
      anon_sym_ELSE,
    STATE(53), 1,
      sym_else_then_statement,
    ACTIONS(157), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1395] = 2,
    ACTIONS(165), 1,
      anon_sym_DEF,
    ACTIONS(163), 12,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1413] = 2,
    ACTIONS(169), 1,
      anon_sym_DEF,
    ACTIONS(167), 12,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1431] = 2,
    ACTIONS(173), 1,
      anon_sym_DEF,
    ACTIONS(171), 12,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1449] = 2,
    ACTIONS(177), 1,
      anon_sym_DEF,
    ACTIONS(175), 12,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1467] = 2,
    ACTIONS(181), 1,
      anon_sym_DEF,
    ACTIONS(179), 11,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1484] = 9,
    ACTIONS(183), 1,
      sym_identifier,
    ACTIONS(186), 1,
      sym_terminator,
    ACTIONS(188), 1,
      sym_number_literal,
    ACTIONS(191), 1,
      anon_sym_DQUOTE,
    ACTIONS(194), 1,
      anon_sym_SQUOTE,
    STATE(42), 1,
      aux_sym_abl_statement_repeat1,
    STATE(67), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1515] = 2,
    ACTIONS(199), 1,
      anon_sym_DEF,
    ACTIONS(197), 11,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1532] = 2,
    ACTIONS(203), 1,
      anon_sym_DEF,
    ACTIONS(201), 11,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1549] = 9,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(207), 1,
      sym_terminator,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(46), 1,
      aux_sym_abl_statement_repeat1,
    STATE(67), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1580] = 9,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    ACTIONS(215), 1,
      sym_terminator,
    STATE(42), 1,
      aux_sym_abl_statement_repeat1,
    STATE(67), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1611] = 2,
    ACTIONS(219), 1,
      anon_sym_DEF,
    ACTIONS(217), 11,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1628] = 2,
    ACTIONS(223), 1,
      anon_sym_DEF,
    ACTIONS(221), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1644] = 2,
    ACTIONS(227), 1,
      anon_sym_DEF,
    ACTIONS(225), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1660] = 2,
    ACTIONS(231), 1,
      anon_sym_DEF,
    ACTIONS(229), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1676] = 2,
    ACTIONS(235), 1,
      anon_sym_DEF,
    ACTIONS(233), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1692] = 2,
    ACTIONS(239), 1,
      anon_sym_DEF,
    ACTIONS(237), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1708] = 2,
    ACTIONS(243), 1,
      anon_sym_DEF,
    ACTIONS(241), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1724] = 8,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    ACTIONS(245), 1,
      anon_sym_RPAREN,
    STATE(77), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1752] = 2,
    ACTIONS(249), 1,
      anon_sym_DEF,
    ACTIONS(247), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1768] = 2,
    ACTIONS(253), 1,
      anon_sym_DEF,
    ACTIONS(251), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1784] = 2,
    ACTIONS(257), 1,
      anon_sym_DEF,
    ACTIONS(255), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1800] = 8,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(32), 1,
      sym_expression,
    STATE(118), 1,
      sym_conditions,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1828] = 2,
    ACTIONS(261), 1,
      anon_sym_DEF,
    ACTIONS(259), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1844] = 2,
    ACTIONS(265), 1,
      anon_sym_DEF,
    ACTIONS(263), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1860] = 2,
    ACTIONS(269), 1,
      anon_sym_DEF,
    ACTIONS(267), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1876] = 2,
    ACTIONS(273), 1,
      anon_sym_DEF,
    ACTIONS(271), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1892] = 2,
    ACTIONS(277), 1,
      anon_sym_DEF,
    ACTIONS(275), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1908] = 2,
    ACTIONS(281), 1,
      anon_sym_DEF,
    ACTIONS(279), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1924] = 8,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(32), 1,
      sym_expression,
    STATE(107), 1,
      sym_conditions,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [1952] = 2,
    ACTIONS(285), 1,
      anon_sym_DEF,
    ACTIONS(283), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [1968] = 3,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(287), 5,
      sym_identifier,
      sym_terminator,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [1986] = 2,
    ACTIONS(291), 1,
      anon_sym_DEF,
    ACTIONS(289), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [2002] = 2,
    ACTIONS(295), 1,
      anon_sym_DEF,
    ACTIONS(293), 10,
      ts_builtin_sym_end,
      sym_identifier,
      sym_block_terminator,
      anon_sym_SLASH_STAR,
      anon_sym_DEFINE,
      anon_sym_IF,
      anon_sym_FOR,
      anon_sym_DISPLAY,
      anon_sym_PUT,
      anon_sym_ASSIGN,
  [2018] = 8,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(32), 1,
      sym_expression,
    STATE(85), 1,
      sym_conditions,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [2046] = 4,
    ACTIONS(155), 1,
      anon_sym_THEN,
    STATE(71), 1,
      aux_sym_conditions_repeat1,
    ACTIONS(297), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(153), 6,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [2065] = 7,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(28), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [2090] = 7,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(81), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [2115] = 7,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(80), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [2140] = 4,
    ACTIONS(302), 1,
      anon_sym_THEN,
    STATE(71), 1,
      aux_sym_conditions_repeat1,
    ACTIONS(137), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(300), 6,
      anon_sym_THENDO_COLON,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [2159] = 7,
    ACTIONS(205), 1,
      sym_identifier,
    ACTIONS(209), 1,
      sym_number_literal,
    ACTIONS(211), 1,
      anon_sym_DQUOTE,
    ACTIONS(213), 1,
      anon_sym_SQUOTE,
    STATE(35), 1,
      sym_expression,
    STATE(20), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(26), 3,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
  [2184] = 5,
    ACTIONS(304), 1,
      anon_sym_COMMA,
    ACTIONS(306), 1,
      anon_sym_RPAREN,
    STATE(101), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [2204] = 7,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    STATE(68), 1,
      sym_terminated_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    STATE(44), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [2228] = 7,
    ACTIONS(5), 1,
      sym_identifier,
    ACTIONS(9), 1,
      anon_sym_DEFINE,
    ACTIONS(11), 1,
      anon_sym_DEF,
    STATE(36), 1,
      sym_terminated_statement,
    STATE(114), 1,
      sym_function_call,
    STATE(115), 1,
      sym_assignment,
    STATE(44), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [2252] = 3,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(308), 2,
      sym_identifier,
      sym_terminator,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [2267] = 3,
    ACTIONS(115), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(310), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
    ACTIONS(117), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [2282] = 5,
    ACTIONS(312), 1,
      anon_sym_WHERE,
    ACTIONS(316), 1,
      anon_sym_COLON,
    STATE(83), 1,
      sym_where_clause,
    STATE(109), 1,
      sym_query_tunings,
    ACTIONS(314), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [2301] = 3,
    ACTIONS(318), 1,
      anon_sym_COLON,
    STATE(119), 1,
      sym_query_tunings,
    ACTIONS(314), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [2314] = 2,
    STATE(120), 1,
      sym_primitive_type,
    ACTIONS(320), 4,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
  [2324] = 1,
    ACTIONS(322), 5,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
      anon_sym_COLON,
  [2332] = 4,
    ACTIONS(324), 1,
      aux_sym_comment_token2,
    ACTIONS(326), 1,
      anon_sym_SQUOTE,
    ACTIONS(328), 1,
      aux_sym_single_quoted_string_token1,
    STATE(93), 1,
      aux_sym_single_quoted_string_repeat1,
  [2345] = 4,
    ACTIONS(330), 1,
      aux_sym_comment_token2,
    ACTIONS(333), 1,
      anon_sym_DQUOTE,
    ACTIONS(335), 1,
      aux_sym_double_quoted_string_token1,
    STATE(87), 1,
      aux_sym_double_quoted_string_repeat1,
  [2358] = 4,
    ACTIONS(338), 1,
      aux_sym_comment_token2,
    ACTIONS(340), 1,
      anon_sym_SQUOTE,
    ACTIONS(342), 1,
      aux_sym_single_quoted_string_token1,
    STATE(86), 1,
      aux_sym_single_quoted_string_repeat1,
  [2371] = 4,
    ACTIONS(344), 1,
      aux_sym_comment_token1,
    ACTIONS(346), 1,
      aux_sym_comment_token2,
    ACTIONS(348), 1,
      anon_sym_STAR_SLASH,
    STATE(95), 1,
      aux_sym_comment_repeat1,
  [2384] = 1,
    ACTIONS(350), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [2391] = 4,
    ACTIONS(352), 1,
      aux_sym_comment_token2,
    ACTIONS(354), 1,
      anon_sym_DQUOTE,
    ACTIONS(356), 1,
      aux_sym_double_quoted_string_token1,
    STATE(96), 1,
      aux_sym_double_quoted_string_repeat1,
  [2404] = 3,
    ACTIONS(358), 1,
      sym_identifier,
    ACTIONS(360), 1,
      sym_terminator,
    STATE(98), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [2415] = 4,
    ACTIONS(362), 1,
      aux_sym_comment_token2,
    ACTIONS(365), 1,
      anon_sym_SQUOTE,
    ACTIONS(367), 1,
      aux_sym_single_quoted_string_token1,
    STATE(93), 1,
      aux_sym_single_quoted_string_repeat1,
  [2428] = 4,
    ACTIONS(370), 1,
      aux_sym_comment_token1,
    ACTIONS(373), 1,
      aux_sym_comment_token2,
    ACTIONS(376), 1,
      anon_sym_STAR_SLASH,
    STATE(94), 1,
      aux_sym_comment_repeat1,
  [2441] = 4,
    ACTIONS(378), 1,
      aux_sym_comment_token1,
    ACTIONS(380), 1,
      aux_sym_comment_token2,
    ACTIONS(382), 1,
      anon_sym_STAR_SLASH,
    STATE(94), 1,
      aux_sym_comment_repeat1,
  [2454] = 4,
    ACTIONS(384), 1,
      aux_sym_comment_token2,
    ACTIONS(386), 1,
      anon_sym_DQUOTE,
    ACTIONS(388), 1,
      aux_sym_double_quoted_string_token1,
    STATE(87), 1,
      aux_sym_double_quoted_string_repeat1,
  [2467] = 3,
    ACTIONS(358), 1,
      sym_identifier,
    ACTIONS(390), 1,
      sym_terminator,
    STATE(92), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [2478] = 3,
    ACTIONS(392), 1,
      sym_identifier,
    ACTIONS(395), 1,
      sym_terminator,
    STATE(98), 2,
      sym_assignment,
      aux_sym_assign_statement_repeat1,
  [2489] = 3,
    ACTIONS(397), 1,
      anon_sym_,
    ACTIONS(399), 1,
      anon_sym_COLON,
    STATE(103), 1,
      aux_sym_query_tunings_repeat1,
  [2499] = 3,
    ACTIONS(310), 1,
      anon_sym_RPAREN,
    ACTIONS(401), 1,
      anon_sym_COMMA,
    STATE(100), 1,
      aux_sym_function_call_repeat1,
  [2509] = 3,
    ACTIONS(304), 1,
      anon_sym_COMMA,
    ACTIONS(404), 1,
      anon_sym_RPAREN,
    STATE(100), 1,
      aux_sym_function_call_repeat1,
  [2519] = 1,
    ACTIONS(406), 3,
      anon_sym_EACH,
      anon_sym_FIRST,
      anon_sym_LAST,
  [2525] = 3,
    ACTIONS(408), 1,
      anon_sym_,
    ACTIONS(411), 1,
      anon_sym_COLON,
    STATE(103), 1,
      aux_sym_query_tunings_repeat1,
  [2535] = 3,
    ACTIONS(397), 1,
      anon_sym_,
    ACTIONS(413), 1,
      anon_sym_COLON,
    STATE(99), 1,
      aux_sym_query_tunings_repeat1,
  [2545] = 2,
    ACTIONS(79), 1,
      anon_sym_LPAREN,
    ACTIONS(415), 1,
      anon_sym_EQ,
  [2552] = 2,
    ACTIONS(411), 1,
      anon_sym_COLON,
    ACTIONS(417), 1,
      anon_sym_,
  [2559] = 2,
    ACTIONS(419), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(421), 1,
      anon_sym_THEN,
  [2566] = 2,
    ACTIONS(423), 1,
      anon_sym_VARIABLE,
    ACTIONS(425), 1,
      anon_sym_VAR,
  [2573] = 1,
    ACTIONS(427), 1,
      anon_sym_COLON,
  [2577] = 1,
    ACTIONS(429), 1,
      sym_identifier,
  [2581] = 1,
    ACTIONS(415), 1,
      anon_sym_EQ,
  [2585] = 1,
    ACTIONS(431), 1,
      sym_identifier,
  [2589] = 1,
    ACTIONS(433), 1,
      sym_terminator,
  [2593] = 1,
    ACTIONS(435), 1,
      sym_terminator,
  [2597] = 1,
    ACTIONS(437), 1,
      sym_terminator,
  [2601] = 1,
    ACTIONS(439), 1,
      ts_builtin_sym_end,
  [2605] = 1,
    ACTIONS(441), 1,
      anon_sym_AS,
  [2609] = 1,
    ACTIONS(443), 1,
      anon_sym_THENDO_COLON,
  [2613] = 1,
    ACTIONS(445), 1,
      anon_sym_COLON,
  [2617] = 1,
    ACTIONS(447), 1,
      sym_terminator,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 56,
  [SMALL_STATE(4)] = 111,
  [SMALL_STATE(5)] = 166,
  [SMALL_STATE(6)] = 221,
  [SMALL_STATE(7)] = 276,
  [SMALL_STATE(8)] = 331,
  [SMALL_STATE(9)] = 386,
  [SMALL_STATE(10)] = 441,
  [SMALL_STATE(11)] = 496,
  [SMALL_STATE(12)] = 551,
  [SMALL_STATE(13)] = 606,
  [SMALL_STATE(14)] = 661,
  [SMALL_STATE(15)] = 716,
  [SMALL_STATE(16)] = 771,
  [SMALL_STATE(17)] = 826,
  [SMALL_STATE(18)] = 881,
  [SMALL_STATE(19)] = 911,
  [SMALL_STATE(20)] = 938,
  [SMALL_STATE(21)] = 965,
  [SMALL_STATE(22)] = 992,
  [SMALL_STATE(23)] = 1019,
  [SMALL_STATE(24)] = 1046,
  [SMALL_STATE(25)] = 1073,
  [SMALL_STATE(26)] = 1100,
  [SMALL_STATE(27)] = 1127,
  [SMALL_STATE(28)] = 1154,
  [SMALL_STATE(29)] = 1185,
  [SMALL_STATE(30)] = 1212,
  [SMALL_STATE(31)] = 1239,
  [SMALL_STATE(32)] = 1266,
  [SMALL_STATE(33)] = 1295,
  [SMALL_STATE(34)] = 1322,
  [SMALL_STATE(35)] = 1349,
  [SMALL_STATE(36)] = 1373,
  [SMALL_STATE(37)] = 1395,
  [SMALL_STATE(38)] = 1413,
  [SMALL_STATE(39)] = 1431,
  [SMALL_STATE(40)] = 1449,
  [SMALL_STATE(41)] = 1467,
  [SMALL_STATE(42)] = 1484,
  [SMALL_STATE(43)] = 1515,
  [SMALL_STATE(44)] = 1532,
  [SMALL_STATE(45)] = 1549,
  [SMALL_STATE(46)] = 1580,
  [SMALL_STATE(47)] = 1611,
  [SMALL_STATE(48)] = 1628,
  [SMALL_STATE(49)] = 1644,
  [SMALL_STATE(50)] = 1660,
  [SMALL_STATE(51)] = 1676,
  [SMALL_STATE(52)] = 1692,
  [SMALL_STATE(53)] = 1708,
  [SMALL_STATE(54)] = 1724,
  [SMALL_STATE(55)] = 1752,
  [SMALL_STATE(56)] = 1768,
  [SMALL_STATE(57)] = 1784,
  [SMALL_STATE(58)] = 1800,
  [SMALL_STATE(59)] = 1828,
  [SMALL_STATE(60)] = 1844,
  [SMALL_STATE(61)] = 1860,
  [SMALL_STATE(62)] = 1876,
  [SMALL_STATE(63)] = 1892,
  [SMALL_STATE(64)] = 1908,
  [SMALL_STATE(65)] = 1924,
  [SMALL_STATE(66)] = 1952,
  [SMALL_STATE(67)] = 1968,
  [SMALL_STATE(68)] = 1986,
  [SMALL_STATE(69)] = 2002,
  [SMALL_STATE(70)] = 2018,
  [SMALL_STATE(71)] = 2046,
  [SMALL_STATE(72)] = 2065,
  [SMALL_STATE(73)] = 2090,
  [SMALL_STATE(74)] = 2115,
  [SMALL_STATE(75)] = 2140,
  [SMALL_STATE(76)] = 2159,
  [SMALL_STATE(77)] = 2184,
  [SMALL_STATE(78)] = 2204,
  [SMALL_STATE(79)] = 2228,
  [SMALL_STATE(80)] = 2252,
  [SMALL_STATE(81)] = 2267,
  [SMALL_STATE(82)] = 2282,
  [SMALL_STATE(83)] = 2301,
  [SMALL_STATE(84)] = 2314,
  [SMALL_STATE(85)] = 2324,
  [SMALL_STATE(86)] = 2332,
  [SMALL_STATE(87)] = 2345,
  [SMALL_STATE(88)] = 2358,
  [SMALL_STATE(89)] = 2371,
  [SMALL_STATE(90)] = 2384,
  [SMALL_STATE(91)] = 2391,
  [SMALL_STATE(92)] = 2404,
  [SMALL_STATE(93)] = 2415,
  [SMALL_STATE(94)] = 2428,
  [SMALL_STATE(95)] = 2441,
  [SMALL_STATE(96)] = 2454,
  [SMALL_STATE(97)] = 2467,
  [SMALL_STATE(98)] = 2478,
  [SMALL_STATE(99)] = 2489,
  [SMALL_STATE(100)] = 2499,
  [SMALL_STATE(101)] = 2509,
  [SMALL_STATE(102)] = 2519,
  [SMALL_STATE(103)] = 2525,
  [SMALL_STATE(104)] = 2535,
  [SMALL_STATE(105)] = 2545,
  [SMALL_STATE(106)] = 2552,
  [SMALL_STATE(107)] = 2559,
  [SMALL_STATE(108)] = 2566,
  [SMALL_STATE(109)] = 2573,
  [SMALL_STATE(110)] = 2577,
  [SMALL_STATE(111)] = 2581,
  [SMALL_STATE(112)] = 2585,
  [SMALL_STATE(113)] = 2589,
  [SMALL_STATE(114)] = 2593,
  [SMALL_STATE(115)] = 2597,
  [SMALL_STATE(116)] = 2601,
  [SMALL_STATE(117)] = 2605,
  [SMALL_STATE(118)] = 2609,
  [SMALL_STATE(119)] = 2613,
  [SMALL_STATE(120)] = 2617,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(105),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(89),
  [9] = {.entry = {.count = 1, .reusable = true}}, SHIFT(108),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(108),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(102),
  [17] = {.entry = {.count = 1, .reusable = true}}, SHIFT(45),
  [19] = {.entry = {.count = 1, .reusable = true}}, SHIFT(97),
  [21] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2),
  [23] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(105),
  [26] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(89),
  [29] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(108),
  [32] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(108),
  [35] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(65),
  [38] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(102),
  [41] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(45),
  [44] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(97),
  [47] = {.entry = {.count = 1, .reusable = true}}, SHIFT(40),
  [49] = {.entry = {.count = 1, .reusable = true}}, SHIFT(64),
  [51] = {.entry = {.count = 1, .reusable = true}}, SHIFT(37),
  [53] = {.entry = {.count = 1, .reusable = true}}, SHIFT(39),
  [55] = {.entry = {.count = 1, .reusable = true}}, SHIFT(51),
  [57] = {.entry = {.count = 1, .reusable = true}}, SHIFT(31),
  [59] = {.entry = {.count = 1, .reusable = true}}, SHIFT(50),
  [61] = {.entry = {.count = 1, .reusable = true}}, SHIFT(48),
  [63] = {.entry = {.count = 1, .reusable = true}}, SHIFT(30),
  [65] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [67] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [69] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 1),
  [71] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [73] = {.entry = {.count = 1, .reusable = true}}, SHIFT(63),
  [75] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression, 1),
  [77] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression, 1),
  [79] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [81] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 3),
  [83] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 3),
  [85] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string_literal, 1),
  [87] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string_literal, 1),
  [89] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 2),
  [91] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 2),
  [93] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [95] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 3, .production_id = 1),
  [97] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [99] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 5, .production_id = 1),
  [101] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 2),
  [103] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 2),
  [105] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [107] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 4, .production_id = 1),
  [109] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 3),
  [111] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 3),
  [113] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comparison, 3, .production_id = 2),
  [115] = {.entry = {.count = 1, .reusable = false}}, SHIFT(72),
  [117] = {.entry = {.count = 1, .reusable = true}}, SHIFT(72),
  [119] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comparison, 3, .production_id = 2),
  [121] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 6, .production_id = 3),
  [123] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 6, .production_id = 3),
  [125] = {.entry = {.count = 1, .reusable = true}}, SHIFT(5),
  [127] = {.entry = {.count = 1, .reusable = true}}, SHIFT(58),
  [129] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 4, .production_id = 3),
  [131] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 4, .production_id = 3),
  [133] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 5, .production_id = 3),
  [135] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 5, .production_id = 3),
  [137] = {.entry = {.count = 1, .reusable = true}}, SHIFT(76),
  [139] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_conditions, 1),
  [141] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_conditions, 1),
  [143] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 2),
  [145] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2),
  [147] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(5),
  [150] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(58),
  [153] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_conditions_repeat1, 2),
  [155] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_conditions_repeat1, 2),
  [157] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 4, .production_id = 3),
  [159] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 4, .production_id = 3),
  [161] = {.entry = {.count = 1, .reusable = true}}, SHIFT(78),
  [163] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_statement, 2),
  [165] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_statement, 2),
  [167] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_statement, 3),
  [169] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_statement, 3),
  [171] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 3),
  [173] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 3),
  [175] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 4, .production_id = 3),
  [177] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 4, .production_id = 3),
  [179] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call_statement, 2),
  [181] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call_statement, 2),
  [183] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(18),
  [186] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 2),
  [188] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(26),
  [191] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(91),
  [194] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(88),
  [197] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_assignment, 2),
  [199] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_assignment, 2),
  [201] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_terminated_statement, 1),
  [203] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_terminated_statement, 1),
  [205] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [207] = {.entry = {.count = 1, .reusable = true}}, SHIFT(69),
  [209] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [211] = {.entry = {.count = 1, .reusable = true}}, SHIFT(91),
  [213] = {.entry = {.count = 1, .reusable = true}}, SHIFT(88),
  [215] = {.entry = {.count = 1, .reusable = true}}, SHIFT(55),
  [217] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_definition, 6, .production_id = 5),
  [219] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_definition, 6, .production_id = 5),
  [221] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 6),
  [223] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 6),
  [225] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 3),
  [227] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comment, 3),
  [229] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 8, .production_id = 7),
  [231] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 8, .production_id = 7),
  [233] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [235] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [237] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [239] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [241] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 5, .production_id = 3),
  [243] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 5, .production_id = 3),
  [245] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [247] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_abl_statement, 3),
  [249] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_abl_statement, 3),
  [251] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 3),
  [253] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 3),
  [255] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 1),
  [257] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 1),
  [259] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_abl_statement, 1),
  [261] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_abl_statement, 1),
  [263] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [265] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 7),
  [267] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_statement, 1),
  [269] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_statement, 1),
  [271] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 2),
  [273] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 2),
  [275] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 6),
  [277] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 6),
  [279] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [281] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [283] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 2),
  [285] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comment, 2),
  [287] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 1),
  [289] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_then_statement, 2),
  [291] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_then_statement, 2),
  [293] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_abl_statement, 2),
  [295] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_abl_statement, 2),
  [297] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_conditions_repeat1, 2), SHIFT_REPEAT(76),
  [300] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_conditions, 2),
  [302] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_conditions, 2),
  [304] = {.entry = {.count = 1, .reusable = true}}, SHIFT(73),
  [306] = {.entry = {.count = 1, .reusable = true}}, SHIFT(25),
  [308] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assignment, 3),
  [310] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2),
  [312] = {.entry = {.count = 1, .reusable = true}}, SHIFT(70),
  [314] = {.entry = {.count = 1, .reusable = true}}, SHIFT(104),
  [316] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [318] = {.entry = {.count = 1, .reusable = true}}, SHIFT(9),
  [320] = {.entry = {.count = 1, .reusable = true}}, SHIFT(113),
  [322] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 2, .production_id = 3),
  [324] = {.entry = {.count = 1, .reusable = false}}, SHIFT(93),
  [326] = {.entry = {.count = 1, .reusable = false}}, SHIFT(19),
  [328] = {.entry = {.count = 1, .reusable = true}}, SHIFT(93),
  [330] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(87),
  [333] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2),
  [335] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(87),
  [338] = {.entry = {.count = 1, .reusable = false}}, SHIFT(86),
  [340] = {.entry = {.count = 1, .reusable = false}}, SHIFT(21),
  [342] = {.entry = {.count = 1, .reusable = true}}, SHIFT(86),
  [344] = {.entry = {.count = 1, .reusable = true}}, SHIFT(95),
  [346] = {.entry = {.count = 1, .reusable = false}}, SHIFT(95),
  [348] = {.entry = {.count = 1, .reusable = false}}, SHIFT(66),
  [350] = {.entry = {.count = 1, .reusable = true}}, SHIFT(106),
  [352] = {.entry = {.count = 1, .reusable = false}}, SHIFT(96),
  [354] = {.entry = {.count = 1, .reusable = false}}, SHIFT(24),
  [356] = {.entry = {.count = 1, .reusable = true}}, SHIFT(96),
  [358] = {.entry = {.count = 1, .reusable = true}}, SHIFT(111),
  [360] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [362] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(93),
  [365] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2),
  [367] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(93),
  [370] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(94),
  [373] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(94),
  [376] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2),
  [378] = {.entry = {.count = 1, .reusable = true}}, SHIFT(94),
  [380] = {.entry = {.count = 1, .reusable = false}}, SHIFT(94),
  [382] = {.entry = {.count = 1, .reusable = false}}, SHIFT(49),
  [384] = {.entry = {.count = 1, .reusable = false}}, SHIFT(87),
  [386] = {.entry = {.count = 1, .reusable = false}}, SHIFT(27),
  [388] = {.entry = {.count = 1, .reusable = true}}, SHIFT(87),
  [390] = {.entry = {.count = 1, .reusable = true}}, SHIFT(62),
  [392] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2), SHIFT_REPEAT(111),
  [395] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2),
  [397] = {.entry = {.count = 1, .reusable = true}}, SHIFT(90),
  [399] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 2),
  [401] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2), SHIFT_REPEAT(73),
  [404] = {.entry = {.count = 1, .reusable = true}}, SHIFT(23),
  [406] = {.entry = {.count = 1, .reusable = true}}, SHIFT(110),
  [408] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2), SHIFT_REPEAT(90),
  [411] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [413] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_query_tunings, 1),
  [415] = {.entry = {.count = 1, .reusable = true}}, SHIFT(74),
  [417] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_query_tunings_repeat1, 2),
  [419] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [421] = {.entry = {.count = 1, .reusable = false}}, SHIFT(79),
  [423] = {.entry = {.count = 1, .reusable = true}}, SHIFT(112),
  [425] = {.entry = {.count = 1, .reusable = false}}, SHIFT(112),
  [427] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [429] = {.entry = {.count = 1, .reusable = true}}, SHIFT(82),
  [431] = {.entry = {.count = 1, .reusable = true}}, SHIFT(117),
  [433] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_primitive_type, 1),
  [435] = {.entry = {.count = 1, .reusable = true}}, SHIFT(41),
  [437] = {.entry = {.count = 1, .reusable = true}}, SHIFT(43),
  [439] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [441] = {.entry = {.count = 1, .reusable = true}}, SHIFT(84),
  [443] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [445] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [447] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
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
