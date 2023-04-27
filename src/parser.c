#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#ifdef _MSC_VER
#pragma optimize("", off)
#elif defined(__clang__)
#pragma clang optimize off
#elif defined(__GNUC__)
#pragma GCC optimize ("O0")
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 383
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 137
#define ALIAS_COUNT 0
#define TOKEN_COUNT 80
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 8
#define MAX_ALIAS_SEQUENCE_LENGTH 11
#define PRODUCTION_ID_COUNT 8

enum {
  sym_identifier = 1,
  sym_terminator = 2,
  aux_sym_block_terminator_token1 = 3,
  aux_sym_block_terminator_token2 = 4,
  aux_sym_block_terminator_token3 = 5,
  anon_sym_LT = 6,
  anon_sym_LT_EQ = 7,
  anon_sym_LT_GT = 8,
  anon_sym_EQ = 9,
  anon_sym_GT = 10,
  anon_sym_GT_EQ = 11,
  anon_sym_AND = 12,
  anon_sym_OR = 13,
  anon_sym_SLASH_STAR = 14,
  aux_sym_comment_token1 = 15,
  aux_sym_comment_token2 = 16,
  anon_sym_STAR_SLASH = 17,
  anon_sym_LOGICAL = 18,
  anon_sym_INTEGER = 19,
  anon_sym_CHARACTER = 20,
  anon_sym_DECIMAL = 21,
  anon_sym_DATE = 22,
  anon_sym_DATETIME = 23,
  anon_sym_DATETIME_DASHTZ = 24,
  anon_sym_INT64 = 25,
  anon_sym_LONGCHAR = 26,
  anon_sym_MEMPTR = 27,
  anon_sym_RAW = 28,
  anon_sym_RECID = 29,
  anon_sym_ROWID = 30,
  anon_sym_HANDLE = 31,
  anon_sym_COM_DASHHANDLE = 32,
  sym_number_literal = 33,
  anon_sym_DQUOTE = 34,
  aux_sym_double_quoted_string_token1 = 35,
  anon_sym_SQUOTE = 36,
  aux_sym_single_quoted_string_token1 = 37,
  anon_sym_NO_DASHUNDO = 38,
  anon_sym_INITIAL = 39,
  anon_sym_DEFINE = 40,
  anon_sym_DEF = 41,
  anon_sym_VARIABLE = 42,
  anon_sym_VAR = 43,
  anon_sym_AS = 44,
  anon_sym_LPAREN = 45,
  anon_sym_COMMA = 46,
  anon_sym_RPAREN = 47,
  anon_sym_IF = 48,
  anon_sym_THENDO_COLON = 49,
  anon_sym_ELSEDO_COLON = 50,
  anon_sym_ELSEIF = 51,
  anon_sym_THEN = 52,
  anon_sym_ELSE = 53,
  anon_sym_REPEAT_COLON = 54,
  anon_sym_DOWHILE = 55,
  anon_sym_COLON = 56,
  anon_sym_DO = 57,
  anon_sym_TO = 58,
  anon_sym_WHERE = 59,
  anon_sym_DESCENDING = 60,
  anon_sym_BREAK = 61,
  anon_sym_BY = 62,
  anon_sym_NO_DASHLOCK = 63,
  anon_sym_NO_DASHWAIT = 64,
  anon_sym_SHARE_DASHLOCK = 65,
  anon_sym_EXCLUSIVE_DASHLOCK = 66,
  anon_sym_FOR = 67,
  anon_sym_EACH = 68,
  anon_sym_FIRST = 69,
  anon_sym_LAST = 70,
  anon_sym_PROCEDURE = 71,
  anon_sym_PRIVATE = 72,
  anon_sym_INPUT = 73,
  anon_sym_OUTPUT = 74,
  anon_sym_FUNCTION = 75,
  anon_sym_RETURNS = 76,
  anon_sym_RETURN = 77,
  aux_sym_object_property_token1 = 78,
  anon_sym_ASSIGN = 79,
  sym_source_code = 80,
  sym_block_terminator = 81,
  sym_expression = 82,
  sym_comparator = 83,
  sym_comparison = 84,
  sym_statement = 85,
  sym_terminated_statement = 86,
  sym_conditions = 87,
  sym_comment = 88,
  sym_primitive_type = 89,
  sym_string_literal = 90,
  sym_double_quoted_string = 91,
  sym_single_quoted_string = 92,
  sym_assignment = 93,
  sym_variable_tuning = 94,
  sym_variable_definition = 95,
  sym_variable_assignment = 96,
  sym_function_call_statement = 97,
  sym_function_call = 98,
  sym_if_statement = 99,
  sym_if_do_statement = 100,
  sym_else_do_statement = 101,
  sym_else_do_if_statement = 102,
  sym_if_then_statement = 103,
  sym_else_then_statement = 104,
  sym_loop_statement = 105,
  sym_repeat_statement = 106,
  sym_do_while_statement = 107,
  sym_do_statement = 108,
  sym_where_clause = 109,
  sym_sort_order = 110,
  sym_sort_column = 111,
  sym_sort_clause = 112,
  sym_query_tuning = 113,
  sym_for_statement = 114,
  sym_procedure_statement = 115,
  sym_function_parameter_mode = 116,
  sym_function_parameter = 117,
  sym_function_statement = 118,
  sym_return_statement = 119,
  sym_object_property = 120,
  sym_abl_statement = 121,
  sym_assign_statement = 122,
  aux_sym_source_code_repeat1 = 123,
  aux_sym_conditions_repeat1 = 124,
  aux_sym_comment_repeat1 = 125,
  aux_sym_double_quoted_string_repeat1 = 126,
  aux_sym_single_quoted_string_repeat1 = 127,
  aux_sym_variable_definition_repeat1 = 128,
  aux_sym_function_call_repeat1 = 129,
  aux_sym_if_do_statement_repeat1 = 130,
  aux_sym_sort_clause_repeat1 = 131,
  aux_sym_for_statement_repeat1 = 132,
  aux_sym_function_statement_repeat1 = 133,
  aux_sym_object_property_repeat1 = 134,
  aux_sym_abl_statement_repeat1 = 135,
  aux_sym_assign_statement_repeat1 = 136,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym_identifier] = "identifier",
  [sym_terminator] = "terminator",
  [aux_sym_block_terminator_token1] = "block_terminator_token1",
  [aux_sym_block_terminator_token2] = "block_terminator_token2",
  [aux_sym_block_terminator_token3] = "block_terminator_token3",
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
  [anon_sym_DATE] = "DATE",
  [anon_sym_DATETIME] = "DATETIME",
  [anon_sym_DATETIME_DASHTZ] = "DATETIME-TZ",
  [anon_sym_INT64] = "INT64",
  [anon_sym_LONGCHAR] = "LONGCHAR",
  [anon_sym_MEMPTR] = "MEMPTR",
  [anon_sym_RAW] = "RAW",
  [anon_sym_RECID] = "RECID",
  [anon_sym_ROWID] = "ROWID",
  [anon_sym_HANDLE] = "HANDLE",
  [anon_sym_COM_DASHHANDLE] = "COM-HANDLE",
  [sym_number_literal] = "number_literal",
  [anon_sym_DQUOTE] = "\"",
  [aux_sym_double_quoted_string_token1] = "double_quoted_string_token1",
  [anon_sym_SQUOTE] = "'",
  [aux_sym_single_quoted_string_token1] = "single_quoted_string_token1",
  [anon_sym_NO_DASHUNDO] = "NO-UNDO",
  [anon_sym_INITIAL] = "INITIAL",
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
  [anon_sym_DOWHILE] = "DO WHILE",
  [anon_sym_COLON] = ":",
  [anon_sym_DO] = "DO",
  [anon_sym_TO] = "TO",
  [anon_sym_WHERE] = "WHERE",
  [anon_sym_DESCENDING] = "DESCENDING",
  [anon_sym_BREAK] = "BREAK",
  [anon_sym_BY] = "BY",
  [anon_sym_NO_DASHLOCK] = "NO-LOCK",
  [anon_sym_NO_DASHWAIT] = "NO-WAIT",
  [anon_sym_SHARE_DASHLOCK] = "SHARE-LOCK",
  [anon_sym_EXCLUSIVE_DASHLOCK] = "EXCLUSIVE-LOCK",
  [anon_sym_FOR] = "FOR",
  [anon_sym_EACH] = "EACH",
  [anon_sym_FIRST] = "FIRST",
  [anon_sym_LAST] = "LAST",
  [anon_sym_PROCEDURE] = "PROCEDURE",
  [anon_sym_PRIVATE] = "PRIVATE",
  [anon_sym_INPUT] = "INPUT",
  [anon_sym_OUTPUT] = "OUTPUT",
  [anon_sym_FUNCTION] = "FUNCTION",
  [anon_sym_RETURNS] = "RETURNS",
  [anon_sym_RETURN] = "RETURN",
  [aux_sym_object_property_token1] = "object_property_token1",
  [anon_sym_ASSIGN] = "ASSIGN",
  [sym_source_code] = "source_code",
  [sym_block_terminator] = "block_terminator",
  [sym_expression] = "expression",
  [sym_comparator] = "comparator",
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
  [sym_variable_tuning] = "variable_tuning",
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
  [sym_loop_statement] = "loop_statement",
  [sym_repeat_statement] = "repeat_statement",
  [sym_do_while_statement] = "do_while_statement",
  [sym_do_statement] = "do_statement",
  [sym_where_clause] = "where_clause",
  [sym_sort_order] = "sort_order",
  [sym_sort_column] = "sort_column",
  [sym_sort_clause] = "sort_clause",
  [sym_query_tuning] = "query_tuning",
  [sym_for_statement] = "for_statement",
  [sym_procedure_statement] = "procedure_statement",
  [sym_function_parameter_mode] = "function_parameter_mode",
  [sym_function_parameter] = "function_parameter",
  [sym_function_statement] = "function_statement",
  [sym_return_statement] = "return_statement",
  [sym_object_property] = "object_property",
  [sym_abl_statement] = "abl_statement",
  [sym_assign_statement] = "assign_statement",
  [aux_sym_source_code_repeat1] = "source_code_repeat1",
  [aux_sym_conditions_repeat1] = "conditions_repeat1",
  [aux_sym_comment_repeat1] = "comment_repeat1",
  [aux_sym_double_quoted_string_repeat1] = "double_quoted_string_repeat1",
  [aux_sym_single_quoted_string_repeat1] = "single_quoted_string_repeat1",
  [aux_sym_variable_definition_repeat1] = "variable_definition_repeat1",
  [aux_sym_function_call_repeat1] = "function_call_repeat1",
  [aux_sym_if_do_statement_repeat1] = "if_do_statement_repeat1",
  [aux_sym_sort_clause_repeat1] = "sort_clause_repeat1",
  [aux_sym_for_statement_repeat1] = "for_statement_repeat1",
  [aux_sym_function_statement_repeat1] = "function_statement_repeat1",
  [aux_sym_object_property_repeat1] = "object_property_repeat1",
  [aux_sym_abl_statement_repeat1] = "abl_statement_repeat1",
  [aux_sym_assign_statement_repeat1] = "assign_statement_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym_identifier] = sym_identifier,
  [sym_terminator] = sym_terminator,
  [aux_sym_block_terminator_token1] = aux_sym_block_terminator_token1,
  [aux_sym_block_terminator_token2] = aux_sym_block_terminator_token2,
  [aux_sym_block_terminator_token3] = aux_sym_block_terminator_token3,
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
  [anon_sym_DATE] = anon_sym_DATE,
  [anon_sym_DATETIME] = anon_sym_DATETIME,
  [anon_sym_DATETIME_DASHTZ] = anon_sym_DATETIME_DASHTZ,
  [anon_sym_INT64] = anon_sym_INT64,
  [anon_sym_LONGCHAR] = anon_sym_LONGCHAR,
  [anon_sym_MEMPTR] = anon_sym_MEMPTR,
  [anon_sym_RAW] = anon_sym_RAW,
  [anon_sym_RECID] = anon_sym_RECID,
  [anon_sym_ROWID] = anon_sym_ROWID,
  [anon_sym_HANDLE] = anon_sym_HANDLE,
  [anon_sym_COM_DASHHANDLE] = anon_sym_COM_DASHHANDLE,
  [sym_number_literal] = sym_number_literal,
  [anon_sym_DQUOTE] = anon_sym_DQUOTE,
  [aux_sym_double_quoted_string_token1] = aux_sym_double_quoted_string_token1,
  [anon_sym_SQUOTE] = anon_sym_SQUOTE,
  [aux_sym_single_quoted_string_token1] = aux_sym_single_quoted_string_token1,
  [anon_sym_NO_DASHUNDO] = anon_sym_NO_DASHUNDO,
  [anon_sym_INITIAL] = anon_sym_INITIAL,
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
  [anon_sym_DOWHILE] = anon_sym_DOWHILE,
  [anon_sym_COLON] = anon_sym_COLON,
  [anon_sym_DO] = anon_sym_DO,
  [anon_sym_TO] = anon_sym_TO,
  [anon_sym_WHERE] = anon_sym_WHERE,
  [anon_sym_DESCENDING] = anon_sym_DESCENDING,
  [anon_sym_BREAK] = anon_sym_BREAK,
  [anon_sym_BY] = anon_sym_BY,
  [anon_sym_NO_DASHLOCK] = anon_sym_NO_DASHLOCK,
  [anon_sym_NO_DASHWAIT] = anon_sym_NO_DASHWAIT,
  [anon_sym_SHARE_DASHLOCK] = anon_sym_SHARE_DASHLOCK,
  [anon_sym_EXCLUSIVE_DASHLOCK] = anon_sym_EXCLUSIVE_DASHLOCK,
  [anon_sym_FOR] = anon_sym_FOR,
  [anon_sym_EACH] = anon_sym_EACH,
  [anon_sym_FIRST] = anon_sym_FIRST,
  [anon_sym_LAST] = anon_sym_LAST,
  [anon_sym_PROCEDURE] = anon_sym_PROCEDURE,
  [anon_sym_PRIVATE] = anon_sym_PRIVATE,
  [anon_sym_INPUT] = anon_sym_INPUT,
  [anon_sym_OUTPUT] = anon_sym_OUTPUT,
  [anon_sym_FUNCTION] = anon_sym_FUNCTION,
  [anon_sym_RETURNS] = anon_sym_RETURNS,
  [anon_sym_RETURN] = anon_sym_RETURN,
  [aux_sym_object_property_token1] = aux_sym_object_property_token1,
  [anon_sym_ASSIGN] = anon_sym_ASSIGN,
  [sym_source_code] = sym_source_code,
  [sym_block_terminator] = sym_block_terminator,
  [sym_expression] = sym_expression,
  [sym_comparator] = sym_comparator,
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
  [sym_variable_tuning] = sym_variable_tuning,
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
  [sym_loop_statement] = sym_loop_statement,
  [sym_repeat_statement] = sym_repeat_statement,
  [sym_do_while_statement] = sym_do_while_statement,
  [sym_do_statement] = sym_do_statement,
  [sym_where_clause] = sym_where_clause,
  [sym_sort_order] = sym_sort_order,
  [sym_sort_column] = sym_sort_column,
  [sym_sort_clause] = sym_sort_clause,
  [sym_query_tuning] = sym_query_tuning,
  [sym_for_statement] = sym_for_statement,
  [sym_procedure_statement] = sym_procedure_statement,
  [sym_function_parameter_mode] = sym_function_parameter_mode,
  [sym_function_parameter] = sym_function_parameter,
  [sym_function_statement] = sym_function_statement,
  [sym_return_statement] = sym_return_statement,
  [sym_object_property] = sym_object_property,
  [sym_abl_statement] = sym_abl_statement,
  [sym_assign_statement] = sym_assign_statement,
  [aux_sym_source_code_repeat1] = aux_sym_source_code_repeat1,
  [aux_sym_conditions_repeat1] = aux_sym_conditions_repeat1,
  [aux_sym_comment_repeat1] = aux_sym_comment_repeat1,
  [aux_sym_double_quoted_string_repeat1] = aux_sym_double_quoted_string_repeat1,
  [aux_sym_single_quoted_string_repeat1] = aux_sym_single_quoted_string_repeat1,
  [aux_sym_variable_definition_repeat1] = aux_sym_variable_definition_repeat1,
  [aux_sym_function_call_repeat1] = aux_sym_function_call_repeat1,
  [aux_sym_if_do_statement_repeat1] = aux_sym_if_do_statement_repeat1,
  [aux_sym_sort_clause_repeat1] = aux_sym_sort_clause_repeat1,
  [aux_sym_for_statement_repeat1] = aux_sym_for_statement_repeat1,
  [aux_sym_function_statement_repeat1] = aux_sym_function_statement_repeat1,
  [aux_sym_object_property_repeat1] = aux_sym_object_property_repeat1,
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
  [aux_sym_block_terminator_token1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_block_terminator_token2] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_block_terminator_token3] = {
    .visible = false,
    .named = false,
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
  [anon_sym_DATE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DATETIME] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DATETIME_DASHTZ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_INT64] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LONGCHAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_MEMPTR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RAW] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RECID] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_ROWID] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_HANDLE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COM_DASHHANDLE] = {
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
  [anon_sym_NO_DASHUNDO] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_INITIAL] = {
    .visible = true,
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
  [anon_sym_DOWHILE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DO] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_TO] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_WHERE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DESCENDING] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BREAK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BY] = {
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
  [anon_sym_PROCEDURE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PRIVATE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_INPUT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_OUTPUT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_FUNCTION] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RETURNS] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RETURN] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_object_property_token1] = {
    .visible = false,
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
  [sym_block_terminator] = {
    .visible = true,
    .named = true,
  },
  [sym_expression] = {
    .visible = true,
    .named = true,
  },
  [sym_comparator] = {
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
  [sym_variable_tuning] = {
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
  [sym_loop_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_repeat_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_do_while_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_do_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_where_clause] = {
    .visible = true,
    .named = true,
  },
  [sym_sort_order] = {
    .visible = true,
    .named = true,
  },
  [sym_sort_column] = {
    .visible = true,
    .named = true,
  },
  [sym_sort_clause] = {
    .visible = true,
    .named = true,
  },
  [sym_query_tuning] = {
    .visible = true,
    .named = true,
  },
  [sym_for_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_procedure_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_function_parameter_mode] = {
    .visible = true,
    .named = true,
  },
  [sym_function_parameter] = {
    .visible = true,
    .named = true,
  },
  [sym_function_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_return_statement] = {
    .visible = true,
    .named = true,
  },
  [sym_object_property] = {
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
  [aux_sym_variable_definition_repeat1] = {
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
  [aux_sym_sort_clause_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_for_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_function_statement_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_object_property_repeat1] = {
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
  field_column = 1,
  field_conditions = 2,
  field_function = 3,
  field_name = 4,
  field_return_type = 5,
  field_statement = 6,
  field_table = 7,
  field_type = 8,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_column] = "column",
  [field_conditions] = "conditions",
  [field_function] = "function",
  [field_name] = "name",
  [field_return_type] = "return_type",
  [field_statement] = "statement",
  [field_table] = "table",
  [field_type] = "type",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 1},
  [2] = {.index = 1, .length = 1},
  [3] = {.index = 2, .length = 1},
  [4] = {.index = 3, .length = 2},
  [5] = {.index = 5, .length = 1},
  [6] = {.index = 6, .length = 2},
  [7] = {.index = 8, .length = 2},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_statement, 0},
  [1] =
    {field_function, 0},
  [2] =
    {field_conditions, 1},
  [3] =
    {field_table, 2},
    {field_type, 1},
  [5] =
    {field_column, 0},
  [6] =
    {field_name, 2},
    {field_type, 4},
  [8] =
    {field_name, 1},
    {field_return_type, 3},
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
  [9] = 4,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 6,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
  [20] = 20,
  [21] = 8,
  [22] = 12,
  [23] = 23,
  [24] = 10,
  [25] = 25,
  [26] = 26,
  [27] = 27,
  [28] = 28,
  [29] = 2,
  [30] = 30,
  [31] = 31,
  [32] = 32,
  [33] = 33,
  [34] = 34,
  [35] = 35,
  [36] = 7,
  [37] = 35,
  [38] = 32,
  [39] = 28,
  [40] = 23,
  [41] = 33,
  [42] = 34,
  [43] = 3,
  [44] = 5,
  [45] = 31,
  [46] = 19,
  [47] = 17,
  [48] = 16,
  [49] = 15,
  [50] = 30,
  [51] = 27,
  [52] = 26,
  [53] = 11,
  [54] = 54,
  [55] = 13,
  [56] = 18,
  [57] = 20,
  [58] = 25,
  [59] = 59,
  [60] = 54,
  [61] = 59,
  [62] = 62,
  [63] = 62,
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
  [81] = 74,
  [82] = 79,
  [83] = 77,
  [84] = 84,
  [85] = 78,
  [86] = 86,
  [87] = 76,
  [88] = 75,
  [89] = 89,
  [90] = 67,
  [91] = 91,
  [92] = 92,
  [93] = 65,
  [94] = 94,
  [95] = 95,
  [96] = 80,
  [97] = 84,
  [98] = 66,
  [99] = 99,
  [100] = 100,
  [101] = 86,
  [102] = 102,
  [103] = 103,
  [104] = 104,
  [105] = 95,
  [106] = 106,
  [107] = 107,
  [108] = 108,
  [109] = 104,
  [110] = 110,
  [111] = 111,
  [112] = 107,
  [113] = 113,
  [114] = 114,
  [115] = 110,
  [116] = 116,
  [117] = 117,
  [118] = 100,
  [119] = 119,
  [120] = 120,
  [121] = 94,
  [122] = 92,
  [123] = 123,
  [124] = 102,
  [125] = 125,
  [126] = 126,
  [127] = 92,
  [128] = 128,
  [129] = 129,
  [130] = 130,
  [131] = 131,
  [132] = 132,
  [133] = 133,
  [134] = 134,
  [135] = 135,
  [136] = 136,
  [137] = 137,
  [138] = 138,
  [139] = 139,
  [140] = 140,
  [141] = 141,
  [142] = 142,
  [143] = 143,
  [144] = 144,
  [145] = 145,
  [146] = 99,
  [147] = 147,
  [148] = 148,
  [149] = 149,
  [150] = 103,
  [151] = 120,
  [152] = 152,
  [153] = 153,
  [154] = 89,
  [155] = 155,
  [156] = 156,
  [157] = 157,
  [158] = 116,
  [159] = 159,
  [160] = 114,
  [161] = 106,
  [162] = 108,
  [163] = 113,
  [164] = 79,
  [165] = 153,
  [166] = 149,
  [167] = 138,
  [168] = 152,
  [169] = 86,
  [170] = 145,
  [171] = 156,
  [172] = 128,
  [173] = 84,
  [174] = 125,
  [175] = 135,
  [176] = 126,
  [177] = 148,
  [178] = 155,
  [179] = 123,
  [180] = 144,
  [181] = 143,
  [182] = 92,
  [183] = 183,
  [184] = 132,
  [185] = 147,
  [186] = 141,
  [187] = 131,
  [188] = 129,
  [189] = 133,
  [190] = 134,
  [191] = 119,
  [192] = 136,
  [193] = 140,
  [194] = 137,
  [195] = 80,
  [196] = 142,
  [197] = 130,
  [198] = 198,
  [199] = 157,
  [200] = 183,
  [201] = 139,
  [202] = 202,
  [203] = 104,
  [204] = 204,
  [205] = 204,
  [206] = 65,
  [207] = 207,
  [208] = 208,
  [209] = 95,
  [210] = 210,
  [211] = 67,
  [212] = 91,
  [213] = 202,
  [214] = 214,
  [215] = 66,
  [216] = 216,
  [217] = 210,
  [218] = 214,
  [219] = 207,
  [220] = 202,
  [221] = 71,
  [222] = 69,
  [223] = 68,
  [224] = 73,
  [225] = 225,
  [226] = 226,
  [227] = 225,
  [228] = 228,
  [229] = 72,
  [230] = 117,
  [231] = 231,
  [232] = 226,
  [233] = 228,
  [234] = 226,
  [235] = 70,
  [236] = 236,
  [237] = 237,
  [238] = 238,
  [239] = 239,
  [240] = 239,
  [241] = 236,
  [242] = 242,
  [243] = 242,
  [244] = 244,
  [245] = 236,
  [246] = 246,
  [247] = 238,
  [248] = 248,
  [249] = 249,
  [250] = 249,
  [251] = 251,
  [252] = 251,
  [253] = 253,
  [254] = 254,
  [255] = 248,
  [256] = 256,
  [257] = 257,
  [258] = 258,
  [259] = 259,
  [260] = 260,
  [261] = 260,
  [262] = 262,
  [263] = 263,
  [264] = 246,
  [265] = 237,
  [266] = 266,
  [267] = 263,
  [268] = 262,
  [269] = 269,
  [270] = 270,
  [271] = 269,
  [272] = 272,
  [273] = 273,
  [274] = 274,
  [275] = 275,
  [276] = 276,
  [277] = 277,
  [278] = 277,
  [279] = 272,
  [280] = 280,
  [281] = 281,
  [282] = 282,
  [283] = 273,
  [284] = 284,
  [285] = 285,
  [286] = 286,
  [287] = 287,
  [288] = 288,
  [289] = 282,
  [290] = 280,
  [291] = 291,
  [292] = 292,
  [293] = 293,
  [294] = 294,
  [295] = 295,
  [296] = 296,
  [297] = 297,
  [298] = 298,
  [299] = 299,
  [300] = 295,
  [301] = 299,
  [302] = 302,
  [303] = 303,
  [304] = 304,
  [305] = 294,
  [306] = 298,
  [307] = 307,
  [308] = 308,
  [309] = 295,
  [310] = 310,
  [311] = 311,
  [312] = 312,
  [313] = 313,
  [314] = 314,
  [315] = 311,
  [316] = 316,
  [317] = 317,
  [318] = 318,
  [319] = 318,
  [320] = 320,
  [321] = 316,
  [322] = 322,
  [323] = 314,
  [324] = 313,
  [325] = 313,
  [326] = 326,
  [327] = 327,
  [328] = 328,
  [329] = 329,
  [330] = 330,
  [331] = 331,
  [332] = 332,
  [333] = 333,
  [334] = 334,
  [335] = 335,
  [336] = 336,
  [337] = 332,
  [338] = 338,
  [339] = 339,
  [340] = 329,
  [341] = 341,
  [342] = 342,
  [343] = 343,
  [344] = 344,
  [345] = 345,
  [346] = 346,
  [347] = 334,
  [348] = 348,
  [349] = 336,
  [350] = 333,
  [351] = 351,
  [352] = 352,
  [353] = 353,
  [354] = 354,
  [355] = 331,
  [356] = 354,
  [357] = 357,
  [358] = 358,
  [359] = 359,
  [360] = 360,
  [361] = 343,
  [362] = 335,
  [363] = 344,
  [364] = 328,
  [365] = 346,
  [366] = 358,
  [367] = 352,
  [368] = 330,
  [369] = 357,
  [370] = 338,
  [371] = 371,
  [372] = 348,
  [373] = 359,
  [374] = 342,
  [375] = 360,
  [376] = 353,
  [377] = 345,
  [378] = 378,
  [379] = 378,
  [380] = 380,
  [381] = 381,
  [382] = 382,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(210);
      if (lookahead == '"') ADVANCE(428);
      if (lookahead == '\'') ADVANCE(432);
      if (lookahead == '(') ADVANCE(446);
      if (lookahead == ')') ADVANCE(448);
      if (lookahead == '*') ADVANCE(27);
      if (lookahead == ',') ADVANCE(447);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(456);
      if (lookahead == '<') ADVANCE(380);
      if (lookahead == '=') ADVANCE(383);
      if (lookahead == '>') ADVANCE(384);
      if (lookahead == 'A') ADVANCE(319);
      if (lookahead == 'B') ADVANCE(344);
      if (lookahead == 'C') ADVANCE(283);
      if (lookahead == 'D') ADVANCE(222);
      if (lookahead == 'E') ADVANCE(228);
      if (lookahead == 'F') ADVANCE(288);
      if (lookahead == 'H') ADVANCE(227);
      if (lookahead == 'I') ADVANCE(320);
      if (lookahead == 'L') ADVANCE(223);
      if (lookahead == 'M') ADVANCE(266);
      if (lookahead == 'N') ADVANCE(328);
      if (lookahead == 'O') ADVANCE(337);
      if (lookahead == 'P') ADVANCE(343);
      if (lookahead == 'R') ADVANCE(224);
      if (lookahead == 'S') ADVANCE(284);
      if (lookahead == 'T') ADVANCE(281);
      if (lookahead == 'V') ADVANCE(229);
      if (lookahead == 'W') ADVANCE(282);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(0)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(8);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      if (lookahead == '-' ||
          ('G' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 1:
      if (lookahead == '\n') SKIP(13)
      END_STATE();
    case 2:
      if (lookahead == '\n') SKIP(13)
      if (lookahead == '\r') SKIP(1)
      END_STATE();
    case 3:
      if (lookahead == '\n') SKIP(14)
      END_STATE();
    case 4:
      if (lookahead == '\n') SKIP(14)
      if (lookahead == '\r') SKIP(3)
      END_STATE();
    case 5:
      if (lookahead == '\n') SKIP(12)
      if (lookahead == '\r') ADVANCE(395);
      if (lookahead != 0) ADVANCE(395);
      END_STATE();
    case 6:
      if (lookahead == '\n') SKIP(15)
      if (lookahead == '\r') ADVANCE(395);
      if (lookahead != 0) ADVANCE(395);
      END_STATE();
    case 7:
      if (lookahead == '\n') SKIP(11)
      if (lookahead == '\r') ADVANCE(395);
      if (lookahead != 0) ADVANCE(395);
      END_STATE();
    case 8:
      if (lookahead == '"') ADVANCE(428);
      if (lookahead == '\'') ADVANCE(432);
      if (lookahead == '(') ADVANCE(446);
      if (lookahead == ')') ADVANCE(448);
      if (lookahead == '*') ADVANCE(27);
      if (lookahead == ',') ADVANCE(447);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(456);
      if (lookahead == '<') ADVANCE(380);
      if (lookahead == '=') ADVANCE(383);
      if (lookahead == '>') ADVANCE(384);
      if (lookahead == 'A') ADVANCE(319);
      if (lookahead == 'B') ADVANCE(344);
      if (lookahead == 'C') ADVANCE(283);
      if (lookahead == 'D') ADVANCE(222);
      if (lookahead == 'E') ADVANCE(228);
      if (lookahead == 'F') ADVANCE(288);
      if (lookahead == 'H') ADVANCE(227);
      if (lookahead == 'I') ADVANCE(320);
      if (lookahead == 'L') ADVANCE(223);
      if (lookahead == 'M') ADVANCE(266);
      if (lookahead == 'N') ADVANCE(328);
      if (lookahead == 'O') ADVANCE(337);
      if (lookahead == 'P') ADVANCE(343);
      if (lookahead == 'R') ADVANCE(224);
      if (lookahead == 'S') ADVANCE(284);
      if (lookahead == 'T') ADVANCE(281);
      if (lookahead == 'V') ADVANCE(229);
      if (lookahead == 'W') ADVANCE(282);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(8)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(8);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      if (lookahead == '-' ||
          ('G' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 9:
      if (lookahead == '"') ADVANCE(428);
      if (lookahead == '\'') ADVANCE(432);
      if (lookahead == '(') ADVANCE(446);
      if (lookahead == ')') ADVANCE(448);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(486);
      if (lookahead == '<') ADVANCE(380);
      if (lookahead == '=') ADVANCE(383);
      if (lookahead == '>') ADVANCE(384);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(9)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(9);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 10:
      if (lookahead == '"') ADVANCE(428);
      if (lookahead == '\'') ADVANCE(432);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == 'I') ADVANCE(325);
      if (lookahead == 'N') ADVANCE(330);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(10)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(10);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 11:
      if (lookahead == '"') ADVANCE(428);
      if (lookahead == '/') ADVANCE(429);
      if (lookahead == '\\') ADVANCE(7);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) ADVANCE(430);
      if (lookahead != 0) ADVANCE(431);
      END_STATE();
    case 12:
      if (lookahead == '\'') ADVANCE(432);
      if (lookahead == '/') ADVANCE(433);
      if (lookahead == '\\') ADVANCE(5);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) ADVANCE(434);
      if (lookahead != 0) ADVANCE(435);
      END_STATE();
    case 13:
      if (lookahead == '(') ADVANCE(446);
      if (lookahead == ')') ADVANCE(448);
      if (lookahead == ',') ADVANCE(447);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(456);
      if (lookahead == '<') ADVANCE(380);
      if (lookahead == '=') ADVANCE(383);
      if (lookahead == '>') ADVANCE(384);
      if (lookahead == 'A') ADVANCE(141);
      if (lookahead == 'B') ADVANCE(169);
      if (lookahead == 'C') ADVANCE(100);
      if (lookahead == 'D') ADVANCE(36);
      if (lookahead == 'E') ADVANCE(40);
      if (lookahead == 'F') ADVANCE(108);
      if (lookahead == 'H') ADVANCE(39);
      if (lookahead == 'I') ADVANCE(138);
      if (lookahead == 'L') ADVANCE(32);
      if (lookahead == 'M') ADVANCE(82);
      if (lookahead == 'N') ADVANCE(148);
      if (lookahead == 'O') ADVANCE(161);
      if (lookahead == 'P') ADVANCE(168);
      if (lookahead == 'R') ADVANCE(35);
      if (lookahead == 'S') ADVANCE(97);
      if (lookahead == 'T') ADVANCE(98);
      if (lookahead == 'V') ADVANCE(41);
      if (lookahead == 'W') ADVANCE(99);
      if (lookahead == '\\') SKIP(2)
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(13)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(13);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      END_STATE();
    case 14:
      if (lookahead == '(') ADVANCE(446);
      if (lookahead == ')') ADVANCE(448);
      if (lookahead == ',') ADVANCE(447);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(486);
      if (lookahead == '<') ADVANCE(380);
      if (lookahead == '=') ADVANCE(383);
      if (lookahead == '>') ADVANCE(384);
      if (lookahead == 'A') ADVANCE(140);
      if (lookahead == 'I') ADVANCE(144);
      if (lookahead == 'N') ADVANCE(153);
      if (lookahead == 'O') ADVANCE(160);
      if (lookahead == 'T') ADVANCE(98);
      if (lookahead == '\\') SKIP(4)
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(14)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(14);
      END_STATE();
    case 15:
      if (lookahead == '*') ADVANCE(27);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == '\\') ADVANCE(6);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) ADVANCE(393);
      if (lookahead != 0) ADVANCE(394);
      END_STATE();
    case 16:
      if (lookahead == '*') ADVANCE(390);
      END_STATE();
    case 17:
      if (lookahead == '-') ADVANCE(129);
      END_STATE();
    case 18:
      if (lookahead == '-') ADVANCE(102);
      END_STATE();
    case 19:
      if (lookahead == '-') ADVANCE(130);
      END_STATE();
    case 20:
      if (lookahead == '-') ADVANCE(195);
      END_STATE();
    case 21:
      if (lookahead == '-') ADVANCE(131);
      END_STATE();
    case 22:
      if (lookahead == '.') ADVANCE(378);
      END_STATE();
    case 23:
      if (lookahead == '.') ADVANCE(377);
      END_STATE();
    case 24:
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(456);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(24)
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 25:
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == 'D') ADVANCE(327);
      if (lookahead == 'E') ADVANCE(308);
      if (lookahead == 'R') ADVANCE(271);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(25)
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 26:
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == 'D') ADVANCE(327);
      if (lookahead == 'E') ADVANCE(322);
      if (lookahead == 'R') ADVANCE(271);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(26)
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 27:
      if (lookahead == '/') ADVANCE(396);
      END_STATE();
    case 28:
      if (lookahead == '4') ADVANCE(411);
      END_STATE();
    case 29:
      if (lookahead == '6') ADVANCE(28);
      if (lookahead == 'E') ADVANCE(94);
      END_STATE();
    case 30:
      if (lookahead == ':') ADVANCE(449);
      END_STATE();
    case 31:
      if (lookahead == ':') ADVANCE(450);
      END_STATE();
    case 32:
      if (lookahead == 'A') ADVANCE(176);
      if (lookahead == 'O') ADVANCE(92);
      END_STATE();
    case 33:
      if (lookahead == 'A') ADVANCE(117);
      END_STATE();
    case 34:
      if (lookahead == 'A') ADVANCE(50);
      END_STATE();
    case 35:
      if (lookahead == 'A') ADVANCE(202);
      if (lookahead == 'E') ADVANCE(59);
      if (lookahead == 'O') ADVANCE(203);
      END_STATE();
    case 36:
      if (lookahead == 'A') ADVANCE(188);
      if (lookahead == 'E') ADVANCE(58);
      END_STATE();
    case 37:
      if (lookahead == 'A') ADVANCE(122);
      END_STATE();
    case 38:
      if (lookahead == 'A') ADVANCE(123);
      END_STATE();
    case 39:
      if (lookahead == 'A') ADVANCE(143);
      END_STATE();
    case 40:
      if (lookahead == 'A') ADVANCE(56);
      if (lookahead == 'X') ADVANCE(52);
      END_STATE();
    case 41:
      if (lookahead == 'A') ADVANCE(162);
      END_STATE();
    case 42:
      if (lookahead == 'A') ADVANCE(124);
      END_STATE();
    case 43:
      if (lookahead == 'A') ADVANCE(170);
      END_STATE();
    case 44:
      if (lookahead == 'A') ADVANCE(165);
      END_STATE();
    case 45:
      if (lookahead == 'A') ADVANCE(113);
      END_STATE();
    case 46:
      if (lookahead == 'A') ADVANCE(62);
      END_STATE();
    case 47:
      if (lookahead == 'A') ADVANCE(172);
      END_STATE();
    case 48:
      if (lookahead == 'A') ADVANCE(190);
      END_STATE();
    case 49:
      if (lookahead == 'A') ADVANCE(146);
      END_STATE();
    case 50:
      if (lookahead == 'B') ADVANCE(127);
      END_STATE();
    case 51:
      if (lookahead == 'C') ADVANCE(185);
      END_STATE();
    case 52:
      if (lookahead == 'C') ADVANCE(125);
      END_STATE();
    case 53:
      if (lookahead == 'C') ADVANCE(80);
      END_STATE();
    case 54:
      if (lookahead == 'C') ADVANCE(118);
      END_STATE();
    case 55:
      if (lookahead == 'C') ADVANCE(119);
      END_STATE();
    case 56:
      if (lookahead == 'C') ADVANCE(96);
      END_STATE();
    case 57:
      if (lookahead == 'C') ADVANCE(120);
      END_STATE();
    case 58:
      if (lookahead == 'C') ADVANCE(107);
      END_STATE();
    case 59:
      if (lookahead == 'C') ADVANCE(110);
      if (lookahead == 'T') ADVANCE(197);
      END_STATE();
    case 60:
      if (lookahead == 'C') ADVANCE(42);
      END_STATE();
    case 61:
      if (lookahead == 'C') ADVANCE(101);
      END_STATE();
    case 62:
      if (lookahead == 'C') ADVANCE(191);
      END_STATE();
    case 63:
      if (lookahead == 'D') ADVANCE(386);
      END_STATE();
    case 64:
      if (lookahead == 'D') ADVANCE(419);
      END_STATE();
    case 65:
      if (lookahead == 'D') ADVANCE(421);
      END_STATE();
    case 66:
      if (lookahead == 'D') ADVANCE(193);
      END_STATE();
    case 67:
      if (lookahead == 'D') ADVANCE(147);
      END_STATE();
    case 68:
      if (lookahead == 'D') ADVANCE(149);
      END_STATE();
    case 69:
      if (lookahead == 'D') ADVANCE(152);
      if (lookahead == 'I') ADVANCE(91);
      END_STATE();
    case 70:
      if (lookahead == 'D') ADVANCE(126);
      END_STATE();
    case 71:
      if (lookahead == 'D') ADVANCE(128);
      END_STATE();
    case 72:
      if (lookahead == 'E') ADVANCE(455);
      END_STATE();
    case 73:
      if (lookahead == 'E') ADVANCE(405);
      END_STATE();
    case 74:
      if (lookahead == 'E') ADVANCE(459);
      END_STATE();
    case 75:
      if (lookahead == 'E') ADVANCE(423);
      END_STATE();
    case 76:
      if (lookahead == 'E') ADVANCE(479);
      END_STATE();
    case 77:
      if (lookahead == 'E') ADVANCE(407);
      END_STATE();
    case 78:
      if (lookahead == 'E') ADVANCE(440);
      END_STATE();
    case 79:
      if (lookahead == 'E') ADVANCE(425);
      END_STATE();
    case 80:
      if (lookahead == 'E') ADVANCE(66);
      END_STATE();
    case 81:
      if (lookahead == 'E') ADVANCE(23);
      END_STATE();
    case 82:
      if (lookahead == 'E') ADVANCE(132);
      END_STATE();
    case 83:
      if (lookahead == 'E') ADVANCE(19);
      END_STATE();
    case 84:
      if (lookahead == 'E') ADVANCE(33);
      END_STATE();
    case 85:
      if (lookahead == 'E') ADVANCE(139);
      END_STATE();
    case 86:
      if (lookahead == 'E') ADVANCE(164);
      END_STATE();
    case 87:
      if (lookahead == 'E') ADVANCE(166);
      END_STATE();
    case 88:
      if (lookahead == 'E') ADVANCE(173);
      END_STATE();
    case 89:
      if (lookahead == 'E') ADVANCE(21);
      END_STATE();
    case 90:
      if (lookahead == 'F') ADVANCE(192);
      if (lookahead == 'P') ADVANCE(159);
      END_STATE();
    case 91:
      if (lookahead == 'F') ADVANCE(451);
      END_STATE();
    case 92:
      if (lookahead == 'G') ADVANCE(112);
      if (lookahead == 'N') ADVANCE(93);
      END_STATE();
    case 93:
      if (lookahead == 'G') ADVANCE(61);
      END_STATE();
    case 94:
      if (lookahead == 'G') ADVANCE(86);
      END_STATE();
    case 95:
      if (lookahead == 'H') ADVANCE(103);
      END_STATE();
    case 96:
      if (lookahead == 'H') ADVANCE(473);
      END_STATE();
    case 97:
      if (lookahead == 'H') ADVANCE(47);
      END_STATE();
    case 98:
      if (lookahead == 'H') ADVANCE(85);
      if (lookahead == 'O') ADVANCE(457);
      END_STATE();
    case 99:
      if (lookahead == 'H') ADVANCE(88);
      END_STATE();
    case 100:
      if (lookahead == 'H') ADVANCE(43);
      if (lookahead == 'O') ADVANCE(133);
      END_STATE();
    case 101:
      if (lookahead == 'H') ADVANCE(44);
      END_STATE();
    case 102:
      if (lookahead == 'H') ADVANCE(49);
      END_STATE();
    case 103:
      if (lookahead == 'I') ADVANCE(121);
      END_STATE();
    case 104:
      if (lookahead == 'I') ADVANCE(199);
      END_STATE();
    case 105:
      if (lookahead == 'I') ADVANCE(200);
      END_STATE();
    case 106:
      if (lookahead == 'I') ADVANCE(150);
      END_STATE();
    case 107:
      if (lookahead == 'I') ADVANCE(134);
      END_STATE();
    case 108:
      if (lookahead == 'I') ADVANCE(174);
      END_STATE();
    case 109:
      if (lookahead == 'I') ADVANCE(135);
      END_STATE();
    case 110:
      if (lookahead == 'I') ADVANCE(64);
      END_STATE();
    case 111:
      if (lookahead == 'I') ADVANCE(65);
      END_STATE();
    case 112:
      if (lookahead == 'I') ADVANCE(60);
      END_STATE();
    case 113:
      if (lookahead == 'I') ADVANCE(183);
      END_STATE();
    case 114:
      if (lookahead == 'I') ADVANCE(38);
      END_STATE();
    case 115:
      if (lookahead == 'I') ADVANCE(189);
      END_STATE();
    case 116:
      if (lookahead == 'I') ADVANCE(189);
      if (lookahead == 'P') ADVANCE(196);
      if (lookahead == 'T') ADVANCE(29);
      END_STATE();
    case 117:
      if (lookahead == 'K') ADVANCE(461);
      END_STATE();
    case 118:
      if (lookahead == 'K') ADVANCE(465);
      END_STATE();
    case 119:
      if (lookahead == 'K') ADVANCE(469);
      END_STATE();
    case 120:
      if (lookahead == 'K') ADVANCE(471);
      END_STATE();
    case 121:
      if (lookahead == 'L') ADVANCE(72);
      END_STATE();
    case 122:
      if (lookahead == 'L') ADVANCE(403);
      END_STATE();
    case 123:
      if (lookahead == 'L') ADVANCE(438);
      END_STATE();
    case 124:
      if (lookahead == 'L') ADVANCE(397);
      END_STATE();
    case 125:
      if (lookahead == 'L') ADVANCE(194);
      END_STATE();
    case 126:
      if (lookahead == 'L') ADVANCE(75);
      END_STATE();
    case 127:
      if (lookahead == 'L') ADVANCE(78);
      END_STATE();
    case 128:
      if (lookahead == 'L') ADVANCE(79);
      END_STATE();
    case 129:
      if (lookahead == 'L') ADVANCE(154);
      if (lookahead == 'U') ADVANCE(145);
      if (lookahead == 'W') ADVANCE(45);
      END_STATE();
    case 130:
      if (lookahead == 'L') ADVANCE(155);
      END_STATE();
    case 131:
      if (lookahead == 'L') ADVANCE(156);
      END_STATE();
    case 132:
      if (lookahead == 'M') ADVANCE(157);
      END_STATE();
    case 133:
      if (lookahead == 'M') ADVANCE(18);
      END_STATE();
    case 134:
      if (lookahead == 'M') ADVANCE(37);
      END_STATE();
    case 135:
      if (lookahead == 'M') ADVANCE(77);
      END_STATE();
    case 136:
      if (lookahead == 'N') ADVANCE(51);
      END_STATE();
    case 137:
      if (lookahead == 'N') ADVANCE(22);
      END_STATE();
    case 138:
      if (lookahead == 'N') ADVANCE(116);
      END_STATE();
    case 139:
      if (lookahead == 'N') ADVANCE(452);
      END_STATE();
    case 140:
      if (lookahead == 'N') ADVANCE(63);
      END_STATE();
    case 141:
      if (lookahead == 'N') ADVANCE(63);
      if (lookahead == 'S') ADVANCE(444);
      END_STATE();
    case 142:
      if (lookahead == 'N') ADVANCE(175);
      END_STATE();
    case 143:
      if (lookahead == 'N') ADVANCE(70);
      END_STATE();
    case 144:
      if (lookahead == 'N') ADVANCE(115);
      END_STATE();
    case 145:
      if (lookahead == 'N') ADVANCE(68);
      END_STATE();
    case 146:
      if (lookahead == 'N') ADVANCE(71);
      END_STATE();
    case 147:
      if (lookahead == 'O') ADVANCE(30);
      END_STATE();
    case 148:
      if (lookahead == 'O') ADVANCE(17);
      END_STATE();
    case 149:
      if (lookahead == 'O') ADVANCE(436);
      END_STATE();
    case 150:
      if (lookahead == 'O') ADVANCE(137);
      END_STATE();
    case 151:
      if (lookahead == 'O') ADVANCE(53);
      END_STATE();
    case 152:
      if (lookahead == 'O') ADVANCE(31);
      END_STATE();
    case 153:
      if (lookahead == 'O') ADVANCE(20);
      END_STATE();
    case 154:
      if (lookahead == 'O') ADVANCE(54);
      END_STATE();
    case 155:
      if (lookahead == 'O') ADVANCE(55);
      END_STATE();
    case 156:
      if (lookahead == 'O') ADVANCE(57);
      END_STATE();
    case 157:
      if (lookahead == 'P') ADVANCE(187);
      END_STATE();
    case 158:
      if (lookahead == 'P') ADVANCE(198);
      END_STATE();
    case 159:
      if (lookahead == 'R') ADVANCE(151);
      END_STATE();
    case 160:
      if (lookahead == 'R') ADVANCE(388);
      END_STATE();
    case 161:
      if (lookahead == 'R') ADVANCE(388);
      if (lookahead == 'U') ADVANCE(186);
      END_STATE();
    case 162:
      if (lookahead == 'R') ADVANCE(443);
      END_STATE();
    case 163:
      if (lookahead == 'R') ADVANCE(415);
      END_STATE();
    case 164:
      if (lookahead == 'R') ADVANCE(399);
      END_STATE();
    case 165:
      if (lookahead == 'R') ADVANCE(413);
      END_STATE();
    case 166:
      if (lookahead == 'R') ADVANCE(401);
      END_STATE();
    case 167:
      if (lookahead == 'R') ADVANCE(81);
      END_STATE();
    case 168:
      if (lookahead == 'R') ADVANCE(104);
      END_STATE();
    case 169:
      if (lookahead == 'R') ADVANCE(84);
      if (lookahead == 'Y') ADVANCE(463);
      END_STATE();
    case 170:
      if (lookahead == 'R') ADVANCE(46);
      END_STATE();
    case 171:
      if (lookahead == 'R') ADVANCE(142);
      END_STATE();
    case 172:
      if (lookahead == 'R') ADVANCE(83);
      END_STATE();
    case 173:
      if (lookahead == 'R') ADVANCE(74);
      END_STATE();
    case 174:
      if (lookahead == 'R') ADVANCE(177);
      END_STATE();
    case 175:
      if (lookahead == 'S') ADVANCE(485);
      END_STATE();
    case 176:
      if (lookahead == 'S') ADVANCE(179);
      END_STATE();
    case 177:
      if (lookahead == 'S') ADVANCE(180);
      END_STATE();
    case 178:
      if (lookahead == 'S') ADVANCE(105);
      END_STATE();
    case 179:
      if (lookahead == 'T') ADVANCE(477);
      END_STATE();
    case 180:
      if (lookahead == 'T') ADVANCE(475);
      END_STATE();
    case 181:
      if (lookahead == 'T') ADVANCE(481);
      END_STATE();
    case 182:
      if (lookahead == 'T') ADVANCE(483);
      END_STATE();
    case 183:
      if (lookahead == 'T') ADVANCE(467);
      END_STATE();
    case 184:
      if (lookahead == 'T') ADVANCE(204);
      END_STATE();
    case 185:
      if (lookahead == 'T') ADVANCE(106);
      END_STATE();
    case 186:
      if (lookahead == 'T') ADVANCE(158);
      END_STATE();
    case 187:
      if (lookahead == 'T') ADVANCE(163);
      END_STATE();
    case 188:
      if (lookahead == 'T') ADVANCE(73);
      END_STATE();
    case 189:
      if (lookahead == 'T') ADVANCE(114);
      END_STATE();
    case 190:
      if (lookahead == 'T') ADVANCE(76);
      END_STATE();
    case 191:
      if (lookahead == 'T') ADVANCE(87);
      END_STATE();
    case 192:
      if (lookahead == 'U') ADVANCE(136);
      END_STATE();
    case 193:
      if (lookahead == 'U') ADVANCE(167);
      END_STATE();
    case 194:
      if (lookahead == 'U') ADVANCE(178);
      END_STATE();
    case 195:
      if (lookahead == 'U') ADVANCE(145);
      END_STATE();
    case 196:
      if (lookahead == 'U') ADVANCE(181);
      END_STATE();
    case 197:
      if (lookahead == 'U') ADVANCE(171);
      END_STATE();
    case 198:
      if (lookahead == 'U') ADVANCE(182);
      END_STATE();
    case 199:
      if (lookahead == 'V') ADVANCE(48);
      END_STATE();
    case 200:
      if (lookahead == 'V') ADVANCE(89);
      END_STATE();
    case 201:
      if (lookahead == 'W') ADVANCE(95);
      END_STATE();
    case 202:
      if (lookahead == 'W') ADVANCE(417);
      END_STATE();
    case 203:
      if (lookahead == 'W') ADVANCE(111);
      END_STATE();
    case 204:
      if (lookahead == 'Z') ADVANCE(409);
      END_STATE();
    case 205:
      if (eof) ADVANCE(210);
      if (lookahead == '\n') SKIP(207)
      END_STATE();
    case 206:
      if (eof) ADVANCE(210);
      if (lookahead == '\n') SKIP(207)
      if (lookahead == '\r') SKIP(205)
      END_STATE();
    case 207:
      if (eof) ADVANCE(210);
      if (lookahead == '(') ADVANCE(446);
      if (lookahead == ')') ADVANCE(448);
      if (lookahead == ',') ADVANCE(447);
      if (lookahead == '.') ADVANCE(376);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == ':') ADVANCE(456);
      if (lookahead == '<') ADVANCE(380);
      if (lookahead == '=') ADVANCE(383);
      if (lookahead == '>') ADVANCE(384);
      if (lookahead == 'A') ADVANCE(141);
      if (lookahead == 'B') ADVANCE(169);
      if (lookahead == 'C') ADVANCE(100);
      if (lookahead == 'D') ADVANCE(36);
      if (lookahead == 'E') ADVANCE(40);
      if (lookahead == 'F') ADVANCE(108);
      if (lookahead == 'H') ADVANCE(39);
      if (lookahead == 'I') ADVANCE(138);
      if (lookahead == 'L') ADVANCE(32);
      if (lookahead == 'M') ADVANCE(82);
      if (lookahead == 'N') ADVANCE(148);
      if (lookahead == 'O') ADVANCE(161);
      if (lookahead == 'P') ADVANCE(168);
      if (lookahead == 'R') ADVANCE(35);
      if (lookahead == 'S') ADVANCE(97);
      if (lookahead == 'T') ADVANCE(98);
      if (lookahead == 'V') ADVANCE(41);
      if (lookahead == 'W') ADVANCE(99);
      if (lookahead == '\\') SKIP(206)
      if (lookahead == '\f' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(207)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(13);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      END_STATE();
    case 208:
      if (eof) ADVANCE(210);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == 'D') ADVANCE(327);
      if (lookahead == 'E') ADVANCE(309);
      if (lookahead == 'R') ADVANCE(271);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(208)
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 209:
      if (eof) ADVANCE(210);
      if (lookahead == '/') ADVANCE(16);
      if (lookahead == 'D') ADVANCE(327);
      if (lookahead == 'R') ADVANCE(271);
      if (lookahead == '\\') ADVANCE(375);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(209)
      if (lookahead == '-' ||
          ('A' <= lookahead && lookahead <= 'z')) ADVANCE(375);
      END_STATE();
    case 210:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 211:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == ' ') ADVANCE(201);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 212:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == ' ') ADVANCE(90);
      if (lookahead == '.') ADVANCE(379);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 213:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == ' ') ADVANCE(69);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 214:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '-') ADVANCE(306);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 215:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '-') ADVANCE(369);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 216:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '-') ADVANCE(286);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 217:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '-') ADVANCE(313);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 218:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '-') ADVANCE(314);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 219:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '4') ADVANCE(412);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 220:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '6') ADVANCE(219);
      if (lookahead == 'E') ADVANCE(279);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 221:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == ':') ADVANCE(454);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 222:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(361);
      if (lookahead == 'E') ADVANCE(244);
      if (lookahead == 'O') ADVANCE(211);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 223:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(349);
      if (lookahead == 'O') ADVANCE(277);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 224:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(372);
      if (lookahead == 'E') ADVANCE(248);
      if (lookahead == 'O') ADVANCE(373);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 225:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(299);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 226:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(241);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 227:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(323);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 228:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(245);
      if (lookahead == 'N') ADVANCE(253);
      if (lookahead == 'X') ADVANCE(242);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 229:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(338);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 230:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(303);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 231:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(345);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 232:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(304);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 233:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(346);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 234:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(305);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 235:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(250);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 236:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(298);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 237:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(341);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 238:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(357);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 239:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(364);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 240:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'A') ADVANCE(326);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('B' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 241:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'B') ADVANCE(311);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 242:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(307);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 243:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(300);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 244:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(290);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 245:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(280);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 246:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(301);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 247:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(302);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 248:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(293);
      if (lookahead == 'P') ADVANCE(272);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 249:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(234);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 250:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(365);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 251:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'C') ADVANCE(285);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 252:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(387);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 253:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(212);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 254:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(420);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 255:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(422);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 256:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(310);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 257:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(329);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 258:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'D') ADVANCE(312);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 259:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(406);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 260:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(460);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 261:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(424);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 262:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(480);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 263:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(408);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 264:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(441);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 265:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(426);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 266:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(315);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 267:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(213);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 268:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(225);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 269:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(321);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 270:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(217);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 271:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(336);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 272:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(238);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 273:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(340);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 274:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(342);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 275:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(347);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 276:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'E') ADVANCE(218);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 277:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'G') ADVANCE(295);
      if (lookahead == 'N') ADVANCE(278);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 278:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'G') ADVANCE(251);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 279:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'G') ADVANCE(273);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 280:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(474);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 281:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(269);
      if (lookahead == 'O') ADVANCE(458);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 282:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(275);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 283:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(231);
      if (lookahead == 'O') ADVANCE(316);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 284:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(233);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 285:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(237);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 286:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'H') ADVANCE(240);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 287:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(370);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 288:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(348);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 289:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(371);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 290:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(317);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 291:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(363);
      if (lookahead == 'P') ADVANCE(367);
      if (lookahead == 'T') ADVANCE(220);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 292:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(363);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 293:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(254);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 294:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(318);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 295:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(249);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 296:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(255);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 297:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(232);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 298:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'I') ADVANCE(358);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 299:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'K') ADVANCE(462);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 300:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'K') ADVANCE(466);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 301:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'K') ADVANCE(470);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 302:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'K') ADVANCE(472);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 303:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(404);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 304:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(439);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 305:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(398);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 306:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(331);
      if (lookahead == 'U') ADVANCE(324);
      if (lookahead == 'W') ADVANCE(236);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 307:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(366);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 308:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(352);
      if (lookahead == 'N') ADVANCE(253);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 309:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(352);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 310:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(261);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 311:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(264);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 312:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(265);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 313:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(332);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 314:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'L') ADVANCE(333);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 315:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'M') ADVANCE(334);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 316:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'M') ADVANCE(216);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 317:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'M') ADVANCE(230);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 318:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'M') ADVANCE(263);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 319:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(252);
      if (lookahead == 'S') ADVANCE(445);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 320:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(291);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 321:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(453);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 322:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(253);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 323:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(256);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 324:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(257);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 325:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(292);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 326:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'N') ADVANCE(258);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 327:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(211);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 328:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(214);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 329:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(437);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 330:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(215);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 331:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(243);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 332:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(246);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 333:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'O') ADVANCE(247);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 334:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'P') ADVANCE(362);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 335:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'P') ADVANCE(368);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 336:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'P') ADVANCE(272);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 337:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(389);
      if (lookahead == 'U') ADVANCE(360);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 338:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(442);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 339:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(416);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 340:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(400);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 341:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(414);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 342:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(402);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 343:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(287);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 344:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(268);
      if (lookahead == 'Y') ADVANCE(464);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 345:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(235);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 346:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(270);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 347:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(260);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 348:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'R') ADVANCE(350);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 349:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'S') ADVANCE(353);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 350:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'S') ADVANCE(354);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 351:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'S') ADVANCE(289);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 352:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'S') ADVANCE(267);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 353:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(478);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 354:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(476);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 355:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(482);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 356:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(484);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 357:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(221);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 358:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(468);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 359:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(374);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 360:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(335);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 361:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(259);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 362:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(339);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 363:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(297);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 364:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(262);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 365:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'T') ADVANCE(274);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 366:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'U') ADVANCE(351);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 367:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'U') ADVANCE(355);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 368:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'U') ADVANCE(356);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 369:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'U') ADVANCE(324);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 370:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'V') ADVANCE(239);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 371:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'V') ADVANCE(276);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 372:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'W') ADVANCE(418);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 373:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'W') ADVANCE(296);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 374:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == 'Z') ADVANCE(410);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 375:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 376:
      ACCEPT_TOKEN(sym_terminator);
      END_STATE();
    case 377:
      ACCEPT_TOKEN(aux_sym_block_terminator_token1);
      END_STATE();
    case 378:
      ACCEPT_TOKEN(aux_sym_block_terminator_token2);
      END_STATE();
    case 379:
      ACCEPT_TOKEN(aux_sym_block_terminator_token3);
      END_STATE();
    case 380:
      ACCEPT_TOKEN(anon_sym_LT);
      if (lookahead == '=') ADVANCE(381);
      if (lookahead == '>') ADVANCE(382);
      END_STATE();
    case 381:
      ACCEPT_TOKEN(anon_sym_LT_EQ);
      END_STATE();
    case 382:
      ACCEPT_TOKEN(anon_sym_LT_GT);
      END_STATE();
    case 383:
      ACCEPT_TOKEN(anon_sym_EQ);
      END_STATE();
    case 384:
      ACCEPT_TOKEN(anon_sym_GT);
      if (lookahead == '=') ADVANCE(385);
      END_STATE();
    case 385:
      ACCEPT_TOKEN(anon_sym_GT_EQ);
      END_STATE();
    case 386:
      ACCEPT_TOKEN(anon_sym_AND);
      END_STATE();
    case 387:
      ACCEPT_TOKEN(anon_sym_AND);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 388:
      ACCEPT_TOKEN(anon_sym_OR);
      END_STATE();
    case 389:
      ACCEPT_TOKEN(anon_sym_OR);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 390:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      END_STATE();
    case 391:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(431);
      END_STATE();
    case 392:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(435);
      END_STATE();
    case 393:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '\\') ADVANCE(6);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) ADVANCE(393);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/') ADVANCE(394);
      END_STATE();
    case 394:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '*' &&
          lookahead != '/' &&
          lookahead != '\\') ADVANCE(394);
      END_STATE();
    case 395:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      END_STATE();
    case 396:
      ACCEPT_TOKEN(anon_sym_STAR_SLASH);
      END_STATE();
    case 397:
      ACCEPT_TOKEN(anon_sym_LOGICAL);
      END_STATE();
    case 398:
      ACCEPT_TOKEN(anon_sym_LOGICAL);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 399:
      ACCEPT_TOKEN(anon_sym_INTEGER);
      END_STATE();
    case 400:
      ACCEPT_TOKEN(anon_sym_INTEGER);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 401:
      ACCEPT_TOKEN(anon_sym_CHARACTER);
      END_STATE();
    case 402:
      ACCEPT_TOKEN(anon_sym_CHARACTER);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 403:
      ACCEPT_TOKEN(anon_sym_DECIMAL);
      END_STATE();
    case 404:
      ACCEPT_TOKEN(anon_sym_DECIMAL);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 405:
      ACCEPT_TOKEN(anon_sym_DATE);
      if (lookahead == 'T') ADVANCE(109);
      END_STATE();
    case 406:
      ACCEPT_TOKEN(anon_sym_DATE);
      if (lookahead == 'T') ADVANCE(294);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 407:
      ACCEPT_TOKEN(anon_sym_DATETIME);
      if (lookahead == '-') ADVANCE(184);
      END_STATE();
    case 408:
      ACCEPT_TOKEN(anon_sym_DATETIME);
      if (lookahead == '-') ADVANCE(359);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 409:
      ACCEPT_TOKEN(anon_sym_DATETIME_DASHTZ);
      END_STATE();
    case 410:
      ACCEPT_TOKEN(anon_sym_DATETIME_DASHTZ);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 411:
      ACCEPT_TOKEN(anon_sym_INT64);
      END_STATE();
    case 412:
      ACCEPT_TOKEN(anon_sym_INT64);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 413:
      ACCEPT_TOKEN(anon_sym_LONGCHAR);
      END_STATE();
    case 414:
      ACCEPT_TOKEN(anon_sym_LONGCHAR);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 415:
      ACCEPT_TOKEN(anon_sym_MEMPTR);
      END_STATE();
    case 416:
      ACCEPT_TOKEN(anon_sym_MEMPTR);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 417:
      ACCEPT_TOKEN(anon_sym_RAW);
      END_STATE();
    case 418:
      ACCEPT_TOKEN(anon_sym_RAW);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 419:
      ACCEPT_TOKEN(anon_sym_RECID);
      END_STATE();
    case 420:
      ACCEPT_TOKEN(anon_sym_RECID);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 421:
      ACCEPT_TOKEN(anon_sym_ROWID);
      END_STATE();
    case 422:
      ACCEPT_TOKEN(anon_sym_ROWID);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 423:
      ACCEPT_TOKEN(anon_sym_HANDLE);
      END_STATE();
    case 424:
      ACCEPT_TOKEN(anon_sym_HANDLE);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 425:
      ACCEPT_TOKEN(anon_sym_COM_DASHHANDLE);
      END_STATE();
    case 426:
      ACCEPT_TOKEN(anon_sym_COM_DASHHANDLE);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 427:
      ACCEPT_TOKEN(sym_number_literal);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(427);
      END_STATE();
    case 428:
      ACCEPT_TOKEN(anon_sym_DQUOTE);
      END_STATE();
    case 429:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead == '*') ADVANCE(391);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(431);
      END_STATE();
    case 430:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead == '/') ADVANCE(429);
      if (lookahead == '\\') ADVANCE(7);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) ADVANCE(430);
      if (lookahead != 0 &&
          lookahead != '"') ADVANCE(431);
      END_STATE();
    case 431:
      ACCEPT_TOKEN(aux_sym_double_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '"' &&
          lookahead != '\\') ADVANCE(431);
      END_STATE();
    case 432:
      ACCEPT_TOKEN(anon_sym_SQUOTE);
      END_STATE();
    case 433:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead == '*') ADVANCE(392);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(435);
      END_STATE();
    case 434:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead == '/') ADVANCE(433);
      if (lookahead == '\\') ADVANCE(5);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) ADVANCE(434);
      if (lookahead != 0 &&
          lookahead != '\'') ADVANCE(435);
      END_STATE();
    case 435:
      ACCEPT_TOKEN(aux_sym_single_quoted_string_token1);
      if (lookahead != 0 &&
          lookahead != '\'' &&
          lookahead != '\\') ADVANCE(435);
      END_STATE();
    case 436:
      ACCEPT_TOKEN(anon_sym_NO_DASHUNDO);
      END_STATE();
    case 437:
      ACCEPT_TOKEN(anon_sym_NO_DASHUNDO);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 438:
      ACCEPT_TOKEN(anon_sym_INITIAL);
      END_STATE();
    case 439:
      ACCEPT_TOKEN(anon_sym_INITIAL);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 440:
      ACCEPT_TOKEN(anon_sym_VARIABLE);
      END_STATE();
    case 441:
      ACCEPT_TOKEN(anon_sym_VARIABLE);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 442:
      ACCEPT_TOKEN(anon_sym_VAR);
      if (lookahead == 'I') ADVANCE(226);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 443:
      ACCEPT_TOKEN(anon_sym_VAR);
      if (lookahead == 'I') ADVANCE(34);
      END_STATE();
    case 444:
      ACCEPT_TOKEN(anon_sym_AS);
      END_STATE();
    case 445:
      ACCEPT_TOKEN(anon_sym_AS);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 446:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 447:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 448:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 449:
      ACCEPT_TOKEN(anon_sym_THENDO_COLON);
      END_STATE();
    case 450:
      ACCEPT_TOKEN(anon_sym_ELSEDO_COLON);
      END_STATE();
    case 451:
      ACCEPT_TOKEN(anon_sym_ELSEIF);
      END_STATE();
    case 452:
      ACCEPT_TOKEN(anon_sym_THEN);
      if (lookahead == ' ') ADVANCE(67);
      END_STATE();
    case 453:
      ACCEPT_TOKEN(anon_sym_THEN);
      if (lookahead == ' ') ADVANCE(67);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 454:
      ACCEPT_TOKEN(anon_sym_REPEAT_COLON);
      END_STATE();
    case 455:
      ACCEPT_TOKEN(anon_sym_DOWHILE);
      END_STATE();
    case 456:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 457:
      ACCEPT_TOKEN(anon_sym_TO);
      END_STATE();
    case 458:
      ACCEPT_TOKEN(anon_sym_TO);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 459:
      ACCEPT_TOKEN(anon_sym_WHERE);
      END_STATE();
    case 460:
      ACCEPT_TOKEN(anon_sym_WHERE);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 461:
      ACCEPT_TOKEN(anon_sym_BREAK);
      END_STATE();
    case 462:
      ACCEPT_TOKEN(anon_sym_BREAK);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 463:
      ACCEPT_TOKEN(anon_sym_BY);
      END_STATE();
    case 464:
      ACCEPT_TOKEN(anon_sym_BY);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 465:
      ACCEPT_TOKEN(anon_sym_NO_DASHLOCK);
      END_STATE();
    case 466:
      ACCEPT_TOKEN(anon_sym_NO_DASHLOCK);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 467:
      ACCEPT_TOKEN(anon_sym_NO_DASHWAIT);
      END_STATE();
    case 468:
      ACCEPT_TOKEN(anon_sym_NO_DASHWAIT);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 469:
      ACCEPT_TOKEN(anon_sym_SHARE_DASHLOCK);
      END_STATE();
    case 470:
      ACCEPT_TOKEN(anon_sym_SHARE_DASHLOCK);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 471:
      ACCEPT_TOKEN(anon_sym_EXCLUSIVE_DASHLOCK);
      END_STATE();
    case 472:
      ACCEPT_TOKEN(anon_sym_EXCLUSIVE_DASHLOCK);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 473:
      ACCEPT_TOKEN(anon_sym_EACH);
      END_STATE();
    case 474:
      ACCEPT_TOKEN(anon_sym_EACH);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 475:
      ACCEPT_TOKEN(anon_sym_FIRST);
      END_STATE();
    case 476:
      ACCEPT_TOKEN(anon_sym_FIRST);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 477:
      ACCEPT_TOKEN(anon_sym_LAST);
      END_STATE();
    case 478:
      ACCEPT_TOKEN(anon_sym_LAST);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 479:
      ACCEPT_TOKEN(anon_sym_PRIVATE);
      END_STATE();
    case 480:
      ACCEPT_TOKEN(anon_sym_PRIVATE);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 481:
      ACCEPT_TOKEN(anon_sym_INPUT);
      END_STATE();
    case 482:
      ACCEPT_TOKEN(anon_sym_INPUT);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 483:
      ACCEPT_TOKEN(anon_sym_OUTPUT);
      END_STATE();
    case 484:
      ACCEPT_TOKEN(anon_sym_OUTPUT);
      if (lookahead == '-' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'z') ||
          lookahead == '|') ADVANCE(375);
      END_STATE();
    case 485:
      ACCEPT_TOKEN(anon_sym_RETURNS);
      END_STATE();
    case 486:
      ACCEPT_TOKEN(aux_sym_object_property_token1);
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
      if (lookahead == 'A') ADVANCE(1);
      if (lookahead == 'D') ADVANCE(2);
      if (lookahead == 'E') ADVANCE(3);
      if (lookahead == 'F') ADVANCE(4);
      if (lookahead == 'I') ADVANCE(5);
      if (lookahead == 'P') ADVANCE(6);
      if (lookahead == 'R') ADVANCE(7);
      if (lookahead == '\\') SKIP(8)
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\f' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == 8203 ||
          lookahead == 8288 ||
          lookahead == 65279) SKIP(0)
      END_STATE();
    case 1:
      if (lookahead == 'S') ADVANCE(9);
      END_STATE();
    case 2:
      if (lookahead == 'E') ADVANCE(10);
      if (lookahead == 'O') ADVANCE(11);
      END_STATE();
    case 3:
      if (lookahead == 'L') ADVANCE(12);
      END_STATE();
    case 4:
      if (lookahead == 'O') ADVANCE(13);
      if (lookahead == 'U') ADVANCE(14);
      END_STATE();
    case 5:
      if (lookahead == 'F') ADVANCE(15);
      END_STATE();
    case 6:
      if (lookahead == 'R') ADVANCE(16);
      END_STATE();
    case 7:
      if (lookahead == 'E') ADVANCE(17);
      END_STATE();
    case 8:
      if (lookahead == '\n') SKIP(0)
      if (lookahead == '\r') SKIP(18)
      END_STATE();
    case 9:
      if (lookahead == 'S') ADVANCE(19);
      END_STATE();
    case 10:
      if (lookahead == 'F') ADVANCE(20);
      if (lookahead == 'S') ADVANCE(21);
      END_STATE();
    case 11:
      ACCEPT_TOKEN(anon_sym_DO);
      END_STATE();
    case 12:
      if (lookahead == 'S') ADVANCE(22);
      END_STATE();
    case 13:
      if (lookahead == 'R') ADVANCE(23);
      END_STATE();
    case 14:
      if (lookahead == 'N') ADVANCE(24);
      END_STATE();
    case 15:
      ACCEPT_TOKEN(anon_sym_IF);
      END_STATE();
    case 16:
      if (lookahead == 'O') ADVANCE(25);
      END_STATE();
    case 17:
      if (lookahead == 'T') ADVANCE(26);
      END_STATE();
    case 18:
      if (lookahead == '\n') SKIP(0)
      END_STATE();
    case 19:
      if (lookahead == 'I') ADVANCE(27);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(anon_sym_DEF);
      if (lookahead == 'I') ADVANCE(28);
      END_STATE();
    case 21:
      if (lookahead == 'C') ADVANCE(29);
      END_STATE();
    case 22:
      if (lookahead == 'E') ADVANCE(30);
      END_STATE();
    case 23:
      ACCEPT_TOKEN(anon_sym_FOR);
      END_STATE();
    case 24:
      if (lookahead == 'C') ADVANCE(31);
      END_STATE();
    case 25:
      if (lookahead == 'C') ADVANCE(32);
      END_STATE();
    case 26:
      if (lookahead == 'U') ADVANCE(33);
      END_STATE();
    case 27:
      if (lookahead == 'G') ADVANCE(34);
      END_STATE();
    case 28:
      if (lookahead == 'N') ADVANCE(35);
      END_STATE();
    case 29:
      if (lookahead == 'E') ADVANCE(36);
      END_STATE();
    case 30:
      ACCEPT_TOKEN(anon_sym_ELSE);
      END_STATE();
    case 31:
      if (lookahead == 'T') ADVANCE(37);
      END_STATE();
    case 32:
      if (lookahead == 'E') ADVANCE(38);
      END_STATE();
    case 33:
      if (lookahead == 'R') ADVANCE(39);
      END_STATE();
    case 34:
      if (lookahead == 'N') ADVANCE(40);
      END_STATE();
    case 35:
      if (lookahead == 'E') ADVANCE(41);
      END_STATE();
    case 36:
      if (lookahead == 'N') ADVANCE(42);
      END_STATE();
    case 37:
      if (lookahead == 'I') ADVANCE(43);
      END_STATE();
    case 38:
      if (lookahead == 'D') ADVANCE(44);
      END_STATE();
    case 39:
      if (lookahead == 'N') ADVANCE(45);
      END_STATE();
    case 40:
      ACCEPT_TOKEN(anon_sym_ASSIGN);
      END_STATE();
    case 41:
      ACCEPT_TOKEN(anon_sym_DEFINE);
      END_STATE();
    case 42:
      if (lookahead == 'D') ADVANCE(46);
      END_STATE();
    case 43:
      if (lookahead == 'O') ADVANCE(47);
      END_STATE();
    case 44:
      if (lookahead == 'U') ADVANCE(48);
      END_STATE();
    case 45:
      ACCEPT_TOKEN(anon_sym_RETURN);
      END_STATE();
    case 46:
      if (lookahead == 'I') ADVANCE(49);
      END_STATE();
    case 47:
      if (lookahead == 'N') ADVANCE(50);
      END_STATE();
    case 48:
      if (lookahead == 'R') ADVANCE(51);
      END_STATE();
    case 49:
      if (lookahead == 'N') ADVANCE(52);
      END_STATE();
    case 50:
      ACCEPT_TOKEN(anon_sym_FUNCTION);
      END_STATE();
    case 51:
      if (lookahead == 'E') ADVANCE(53);
      END_STATE();
    case 52:
      if (lookahead == 'G') ADVANCE(54);
      END_STATE();
    case 53:
      ACCEPT_TOKEN(anon_sym_PROCEDURE);
      END_STATE();
    case 54:
      ACCEPT_TOKEN(anon_sym_DESCENDING);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 209},
  [2] = {.lex_state = 26},
  [3] = {.lex_state = 26},
  [4] = {.lex_state = 26},
  [5] = {.lex_state = 26},
  [6] = {.lex_state = 26},
  [7] = {.lex_state = 26},
  [8] = {.lex_state = 26},
  [9] = {.lex_state = 26},
  [10] = {.lex_state = 26},
  [11] = {.lex_state = 26},
  [12] = {.lex_state = 26},
  [13] = {.lex_state = 26},
  [14] = {.lex_state = 26},
  [15] = {.lex_state = 26},
  [16] = {.lex_state = 26},
  [17] = {.lex_state = 26},
  [18] = {.lex_state = 26},
  [19] = {.lex_state = 26},
  [20] = {.lex_state = 26},
  [21] = {.lex_state = 26},
  [22] = {.lex_state = 26},
  [23] = {.lex_state = 26},
  [24] = {.lex_state = 26},
  [25] = {.lex_state = 26},
  [26] = {.lex_state = 26},
  [27] = {.lex_state = 26},
  [28] = {.lex_state = 26},
  [29] = {.lex_state = 26},
  [30] = {.lex_state = 26},
  [31] = {.lex_state = 26},
  [32] = {.lex_state = 26},
  [33] = {.lex_state = 26},
  [34] = {.lex_state = 26},
  [35] = {.lex_state = 26},
  [36] = {.lex_state = 26},
  [37] = {.lex_state = 26},
  [38] = {.lex_state = 26},
  [39] = {.lex_state = 26},
  [40] = {.lex_state = 26},
  [41] = {.lex_state = 26},
  [42] = {.lex_state = 26},
  [43] = {.lex_state = 26},
  [44] = {.lex_state = 26},
  [45] = {.lex_state = 26},
  [46] = {.lex_state = 26},
  [47] = {.lex_state = 26},
  [48] = {.lex_state = 26},
  [49] = {.lex_state = 26},
  [50] = {.lex_state = 26},
  [51] = {.lex_state = 26},
  [52] = {.lex_state = 26},
  [53] = {.lex_state = 26},
  [54] = {.lex_state = 26},
  [55] = {.lex_state = 26},
  [56] = {.lex_state = 26},
  [57] = {.lex_state = 26},
  [58] = {.lex_state = 26},
  [59] = {.lex_state = 26},
  [60] = {.lex_state = 26},
  [61] = {.lex_state = 26},
  [62] = {.lex_state = 26},
  [63] = {.lex_state = 209},
  [64] = {.lex_state = 209},
  [65] = {.lex_state = 207},
  [66] = {.lex_state = 207},
  [67] = {.lex_state = 207},
  [68] = {.lex_state = 207},
  [69] = {.lex_state = 207},
  [70] = {.lex_state = 207},
  [71] = {.lex_state = 207},
  [72] = {.lex_state = 207},
  [73] = {.lex_state = 207},
  [74] = {.lex_state = 25},
  [75] = {.lex_state = 25},
  [76] = {.lex_state = 25},
  [77] = {.lex_state = 25},
  [78] = {.lex_state = 25},
  [79] = {.lex_state = 14},
  [80] = {.lex_state = 14},
  [81] = {.lex_state = 208},
  [82] = {.lex_state = 207},
  [83] = {.lex_state = 208},
  [84] = {.lex_state = 14},
  [85] = {.lex_state = 208},
  [86] = {.lex_state = 14},
  [87] = {.lex_state = 208},
  [88] = {.lex_state = 208},
  [89] = {.lex_state = 25},
  [90] = {.lex_state = 14},
  [91] = {.lex_state = 207},
  [92] = {.lex_state = 25},
  [93] = {.lex_state = 14},
  [94] = {.lex_state = 25},
  [95] = {.lex_state = 207},
  [96] = {.lex_state = 207},
  [97] = {.lex_state = 207},
  [98] = {.lex_state = 14},
  [99] = {.lex_state = 25},
  [100] = {.lex_state = 25},
  [101] = {.lex_state = 207},
  [102] = {.lex_state = 25},
  [103] = {.lex_state = 26},
  [104] = {.lex_state = 14},
  [105] = {.lex_state = 207},
  [106] = {.lex_state = 26},
  [107] = {.lex_state = 207},
  [108] = {.lex_state = 26},
  [109] = {.lex_state = 207},
  [110] = {.lex_state = 207},
  [111] = {.lex_state = 207},
  [112] = {.lex_state = 207},
  [113] = {.lex_state = 26},
  [114] = {.lex_state = 26},
  [115] = {.lex_state = 207},
  [116] = {.lex_state = 26},
  [117] = {.lex_state = 207},
  [118] = {.lex_state = 208},
  [119] = {.lex_state = 26},
  [120] = {.lex_state = 9},
  [121] = {.lex_state = 208},
  [122] = {.lex_state = 208},
  [123] = {.lex_state = 26},
  [124] = {.lex_state = 208},
  [125] = {.lex_state = 26},
  [126] = {.lex_state = 26},
  [127] = {.lex_state = 26},
  [128] = {.lex_state = 26},
  [129] = {.lex_state = 26},
  [130] = {.lex_state = 26},
  [131] = {.lex_state = 26},
  [132] = {.lex_state = 26},
  [133] = {.lex_state = 26},
  [134] = {.lex_state = 26},
  [135] = {.lex_state = 26},
  [136] = {.lex_state = 26},
  [137] = {.lex_state = 26},
  [138] = {.lex_state = 26},
  [139] = {.lex_state = 26},
  [140] = {.lex_state = 26},
  [141] = {.lex_state = 26},
  [142] = {.lex_state = 26},
  [143] = {.lex_state = 26},
  [144] = {.lex_state = 26},
  [145] = {.lex_state = 26},
  [146] = {.lex_state = 208},
  [147] = {.lex_state = 26},
  [148] = {.lex_state = 26},
  [149] = {.lex_state = 26},
  [150] = {.lex_state = 209},
  [151] = {.lex_state = 9},
  [152] = {.lex_state = 26},
  [153] = {.lex_state = 26},
  [154] = {.lex_state = 208},
  [155] = {.lex_state = 26},
  [156] = {.lex_state = 26},
  [157] = {.lex_state = 26},
  [158] = {.lex_state = 209},
  [159] = {.lex_state = 10},
  [160] = {.lex_state = 209},
  [161] = {.lex_state = 209},
  [162] = {.lex_state = 209},
  [163] = {.lex_state = 209},
  [164] = {.lex_state = 9},
  [165] = {.lex_state = 209},
  [166] = {.lex_state = 209},
  [167] = {.lex_state = 209},
  [168] = {.lex_state = 209},
  [169] = {.lex_state = 9},
  [170] = {.lex_state = 209},
  [171] = {.lex_state = 209},
  [172] = {.lex_state = 209},
  [173] = {.lex_state = 9},
  [174] = {.lex_state = 209},
  [175] = {.lex_state = 209},
  [176] = {.lex_state = 209},
  [177] = {.lex_state = 209},
  [178] = {.lex_state = 209},
  [179] = {.lex_state = 209},
  [180] = {.lex_state = 209},
  [181] = {.lex_state = 209},
  [182] = {.lex_state = 209},
  [183] = {.lex_state = 9},
  [184] = {.lex_state = 209},
  [185] = {.lex_state = 209},
  [186] = {.lex_state = 209},
  [187] = {.lex_state = 209},
  [188] = {.lex_state = 209},
  [189] = {.lex_state = 209},
  [190] = {.lex_state = 209},
  [191] = {.lex_state = 209},
  [192] = {.lex_state = 209},
  [193] = {.lex_state = 209},
  [194] = {.lex_state = 209},
  [195] = {.lex_state = 9},
  [196] = {.lex_state = 209},
  [197] = {.lex_state = 209},
  [198] = {.lex_state = 9},
  [199] = {.lex_state = 209},
  [200] = {.lex_state = 9},
  [201] = {.lex_state = 209},
  [202] = {.lex_state = 9},
  [203] = {.lex_state = 9},
  [204] = {.lex_state = 9},
  [205] = {.lex_state = 9},
  [206] = {.lex_state = 9},
  [207] = {.lex_state = 207},
  [208] = {.lex_state = 9},
  [209] = {.lex_state = 9},
  [210] = {.lex_state = 9},
  [211] = {.lex_state = 9},
  [212] = {.lex_state = 207},
  [213] = {.lex_state = 9},
  [214] = {.lex_state = 9},
  [215] = {.lex_state = 9},
  [216] = {.lex_state = 9},
  [217] = {.lex_state = 9},
  [218] = {.lex_state = 9},
  [219] = {.lex_state = 207},
  [220] = {.lex_state = 9},
  [221] = {.lex_state = 9},
  [222] = {.lex_state = 9},
  [223] = {.lex_state = 9},
  [224] = {.lex_state = 9},
  [225] = {.lex_state = 9},
  [226] = {.lex_state = 9},
  [227] = {.lex_state = 9},
  [228] = {.lex_state = 9},
  [229] = {.lex_state = 9},
  [230] = {.lex_state = 207},
  [231] = {.lex_state = 9},
  [232] = {.lex_state = 9},
  [233] = {.lex_state = 9},
  [234] = {.lex_state = 9},
  [235] = {.lex_state = 9},
  [236] = {.lex_state = 207},
  [237] = {.lex_state = 207},
  [238] = {.lex_state = 207},
  [239] = {.lex_state = 207},
  [240] = {.lex_state = 207},
  [241] = {.lex_state = 207},
  [242] = {.lex_state = 207},
  [243] = {.lex_state = 207},
  [244] = {.lex_state = 207},
  [245] = {.lex_state = 207},
  [246] = {.lex_state = 207},
  [247] = {.lex_state = 207},
  [248] = {.lex_state = 207},
  [249] = {.lex_state = 9},
  [250] = {.lex_state = 9},
  [251] = {.lex_state = 9},
  [252] = {.lex_state = 9},
  [253] = {.lex_state = 207},
  [254] = {.lex_state = 207},
  [255] = {.lex_state = 9},
  [256] = {.lex_state = 207},
  [257] = {.lex_state = 207},
  [258] = {.lex_state = 207},
  [259] = {.lex_state = 207},
  [260] = {.lex_state = 207},
  [261] = {.lex_state = 207},
  [262] = {.lex_state = 207},
  [263] = {.lex_state = 207},
  [264] = {.lex_state = 207},
  [265] = {.lex_state = 207},
  [266] = {.lex_state = 207},
  [267] = {.lex_state = 207},
  [268] = {.lex_state = 207},
  [269] = {.lex_state = 9},
  [270] = {.lex_state = 9},
  [271] = {.lex_state = 9},
  [272] = {.lex_state = 12},
  [273] = {.lex_state = 9},
  [274] = {.lex_state = 15},
  [275] = {.lex_state = 24},
  [276] = {.lex_state = 15},
  [277] = {.lex_state = 11},
  [278] = {.lex_state = 11},
  [279] = {.lex_state = 12},
  [280] = {.lex_state = 11},
  [281] = {.lex_state = 15},
  [282] = {.lex_state = 12},
  [283] = {.lex_state = 9},
  [284] = {.lex_state = 9},
  [285] = {.lex_state = 11},
  [286] = {.lex_state = 24},
  [287] = {.lex_state = 12},
  [288] = {.lex_state = 207},
  [289] = {.lex_state = 12},
  [290] = {.lex_state = 11},
  [291] = {.lex_state = 24},
  [292] = {.lex_state = 24},
  [293] = {.lex_state = 11},
  [294] = {.lex_state = 207},
  [295] = {.lex_state = 207},
  [296] = {.lex_state = 9},
  [297] = {.lex_state = 12},
  [298] = {.lex_state = 207},
  [299] = {.lex_state = 207},
  [300] = {.lex_state = 207},
  [301] = {.lex_state = 207},
  [302] = {.lex_state = 15},
  [303] = {.lex_state = 9},
  [304] = {.lex_state = 207},
  [305] = {.lex_state = 207},
  [306] = {.lex_state = 207},
  [307] = {.lex_state = 207},
  [308] = {.lex_state = 207},
  [309] = {.lex_state = 207},
  [310] = {.lex_state = 24},
  [311] = {.lex_state = 207},
  [312] = {.lex_state = 207},
  [313] = {.lex_state = 9},
  [314] = {.lex_state = 207},
  [315] = {.lex_state = 207},
  [316] = {.lex_state = 207},
  [317] = {.lex_state = 207},
  [318] = {.lex_state = 9},
  [319] = {.lex_state = 9},
  [320] = {.lex_state = 24},
  [321] = {.lex_state = 207},
  [322] = {.lex_state = 207},
  [323] = {.lex_state = 207},
  [324] = {.lex_state = 9},
  [325] = {.lex_state = 9},
  [326] = {.lex_state = 24},
  [327] = {.lex_state = 9},
  [328] = {.lex_state = 9},
  [329] = {.lex_state = 207},
  [330] = {.lex_state = 207},
  [331] = {.lex_state = 207},
  [332] = {.lex_state = 9},
  [333] = {.lex_state = 207},
  [334] = {.lex_state = 207},
  [335] = {.lex_state = 9},
  [336] = {.lex_state = 207},
  [337] = {.lex_state = 9},
  [338] = {.lex_state = 207},
  [339] = {.lex_state = 9},
  [340] = {.lex_state = 207},
  [341] = {.lex_state = 9},
  [342] = {.lex_state = 207},
  [343] = {.lex_state = 9},
  [344] = {.lex_state = 207},
  [345] = {.lex_state = 207},
  [346] = {.lex_state = 207},
  [347] = {.lex_state = 207},
  [348] = {.lex_state = 207},
  [349] = {.lex_state = 207},
  [350] = {.lex_state = 207},
  [351] = {.lex_state = 207},
  [352] = {.lex_state = 207},
  [353] = {.lex_state = 207},
  [354] = {.lex_state = 207},
  [355] = {.lex_state = 207},
  [356] = {.lex_state = 207},
  [357] = {.lex_state = 207},
  [358] = {.lex_state = 207},
  [359] = {.lex_state = 207},
  [360] = {.lex_state = 207},
  [361] = {.lex_state = 9},
  [362] = {.lex_state = 9},
  [363] = {.lex_state = 207},
  [364] = {.lex_state = 9},
  [365] = {.lex_state = 207},
  [366] = {.lex_state = 207},
  [367] = {.lex_state = 207},
  [368] = {.lex_state = 207},
  [369] = {.lex_state = 207},
  [370] = {.lex_state = 207},
  [371] = {.lex_state = 207},
  [372] = {.lex_state = 207},
  [373] = {.lex_state = 207},
  [374] = {.lex_state = 207},
  [375] = {.lex_state = 207},
  [376] = {.lex_state = 207},
  [377] = {.lex_state = 207},
  [378] = {.lex_state = 9},
  [379] = {.lex_state = 9},
  [380] = {.lex_state = 207},
  [381] = {(TSStateId)(-1)},
  [382] = {(TSStateId)(-1)},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [sym_comment] = STATE(0),
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym_identifier] = ACTIONS(1),
    [sym_terminator] = ACTIONS(1),
    [aux_sym_block_terminator_token1] = ACTIONS(1),
    [aux_sym_block_terminator_token2] = ACTIONS(1),
    [aux_sym_block_terminator_token3] = ACTIONS(1),
    [anon_sym_LT] = ACTIONS(1),
    [anon_sym_LT_EQ] = ACTIONS(1),
    [anon_sym_LT_GT] = ACTIONS(1),
    [anon_sym_EQ] = ACTIONS(1),
    [anon_sym_GT] = ACTIONS(1),
    [anon_sym_GT_EQ] = ACTIONS(1),
    [anon_sym_AND] = ACTIONS(1),
    [anon_sym_OR] = ACTIONS(1),
    [anon_sym_SLASH_STAR] = ACTIONS(3),
    [anon_sym_STAR_SLASH] = ACTIONS(1),
    [anon_sym_LOGICAL] = ACTIONS(1),
    [anon_sym_INTEGER] = ACTIONS(1),
    [anon_sym_CHARACTER] = ACTIONS(1),
    [anon_sym_DECIMAL] = ACTIONS(1),
    [anon_sym_DATE] = ACTIONS(1),
    [anon_sym_DATETIME] = ACTIONS(1),
    [anon_sym_DATETIME_DASHTZ] = ACTIONS(1),
    [anon_sym_INT64] = ACTIONS(1),
    [anon_sym_LONGCHAR] = ACTIONS(1),
    [anon_sym_MEMPTR] = ACTIONS(1),
    [anon_sym_RAW] = ACTIONS(1),
    [anon_sym_RECID] = ACTIONS(1),
    [anon_sym_ROWID] = ACTIONS(1),
    [anon_sym_HANDLE] = ACTIONS(1),
    [anon_sym_COM_DASHHANDLE] = ACTIONS(1),
    [sym_number_literal] = ACTIONS(1),
    [anon_sym_DQUOTE] = ACTIONS(1),
    [anon_sym_SQUOTE] = ACTIONS(1),
    [anon_sym_NO_DASHUNDO] = ACTIONS(1),
    [anon_sym_INITIAL] = ACTIONS(1),
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
    [anon_sym_DOWHILE] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [anon_sym_DO] = ACTIONS(1),
    [anon_sym_TO] = ACTIONS(1),
    [anon_sym_WHERE] = ACTIONS(1),
    [anon_sym_DESCENDING] = ACTIONS(1),
    [anon_sym_BREAK] = ACTIONS(1),
    [anon_sym_BY] = ACTIONS(1),
    [anon_sym_NO_DASHLOCK] = ACTIONS(1),
    [anon_sym_NO_DASHWAIT] = ACTIONS(1),
    [anon_sym_SHARE_DASHLOCK] = ACTIONS(1),
    [anon_sym_EXCLUSIVE_DASHLOCK] = ACTIONS(1),
    [anon_sym_FOR] = ACTIONS(1),
    [anon_sym_EACH] = ACTIONS(1),
    [anon_sym_FIRST] = ACTIONS(1),
    [anon_sym_LAST] = ACTIONS(1),
    [anon_sym_PROCEDURE] = ACTIONS(1),
    [anon_sym_PRIVATE] = ACTIONS(1),
    [anon_sym_INPUT] = ACTIONS(1),
    [anon_sym_OUTPUT] = ACTIONS(1),
    [anon_sym_FUNCTION] = ACTIONS(1),
    [anon_sym_RETURN] = ACTIONS(1),
    [aux_sym_object_property_token1] = ACTIONS(1),
    [anon_sym_ASSIGN] = ACTIONS(1),
  },
  [1] = {
    [sym_source_code] = STATE(351),
    [sym_statement] = STATE(196),
    [sym_comment] = STATE(1),
    [sym_assignment] = STATE(366),
    [sym_variable_definition] = STATE(194),
    [sym_variable_assignment] = STATE(194),
    [sym_function_call_statement] = STATE(194),
    [sym_function_call] = STATE(369),
    [sym_if_statement] = STATE(194),
    [sym_if_do_statement] = STATE(192),
    [sym_if_then_statement] = STATE(192),
    [sym_loop_statement] = STATE(194),
    [sym_repeat_statement] = STATE(190),
    [sym_do_while_statement] = STATE(190),
    [sym_do_statement] = STATE(190),
    [sym_for_statement] = STATE(194),
    [sym_procedure_statement] = STATE(194),
    [sym_function_statement] = STATE(194),
    [sym_return_statement] = STATE(194),
    [sym_abl_statement] = STATE(194),
    [sym_assign_statement] = STATE(189),
    [aux_sym_source_code_repeat1] = STATE(64),
    [ts_builtin_sym_end] = ACTIONS(5),
    [sym_identifier] = ACTIONS(7),
    [anon_sym_SLASH_STAR] = ACTIONS(3),
    [anon_sym_DEFINE] = ACTIONS(9),
    [anon_sym_DEF] = ACTIONS(9),
    [anon_sym_IF] = ACTIONS(11),
    [anon_sym_REPEAT_COLON] = ACTIONS(13),
    [anon_sym_DOWHILE] = ACTIONS(15),
    [anon_sym_DO] = ACTIONS(17),
    [anon_sym_FOR] = ACTIONS(19),
    [anon_sym_PROCEDURE] = ACTIONS(21),
    [anon_sym_FUNCTION] = ACTIONS(23),
    [anon_sym_RETURN] = ACTIONS(25),
    [anon_sym_ASSIGN] = ACTIONS(27),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(2), 1,
      sym_comment,
    STATE(51), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(167), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [85] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(3), 1,
      sym_comment,
    STATE(30), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(140), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [170] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(4), 1,
      sym_comment,
    STATE(21), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(154), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(55), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [255] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(5), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(102), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(57), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [340] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(6), 1,
      sym_comment,
    STATE(41), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(176), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [425] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(5), 1,
      aux_sym_source_code_repeat1,
    STATE(7), 1,
      sym_comment,
    STATE(100), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(57), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [510] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(8), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(99), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(57), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [595] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(8), 1,
      aux_sym_source_code_repeat1,
    STATE(9), 1,
      sym_comment,
    STATE(89), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(57), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [680] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(10), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(78), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(57), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [765] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(11), 1,
      sym_comment,
    STATE(19), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(178), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [850] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(10), 1,
      aux_sym_source_code_repeat1,
    STATE(12), 1,
      sym_comment,
    STATE(77), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(57), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [935] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(13), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(178), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1020] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(14), 1,
      sym_comment,
    STATE(33), 1,
      aux_sym_source_code_repeat1,
    STATE(126), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1105] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(15), 1,
      sym_comment,
    STATE(23), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(168), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1190] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(16), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(166), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1275] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(17), 1,
      sym_comment,
    STATE(28), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(166), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1360] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(16), 1,
      aux_sym_source_code_repeat1,
    STATE(18), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(185), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1445] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(19), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(170), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1530] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(20), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(186), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1615] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(21), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(146), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(55), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1700] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(22), 1,
      sym_comment,
    STATE(24), 1,
      aux_sym_source_code_repeat1,
    STATE(83), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(55), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1785] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(23), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(180), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1870] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(24), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(85), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(55), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [1955] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(25), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(123), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2040] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(25), 1,
      aux_sym_source_code_repeat1,
    STATE(26), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(135), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2125] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(27), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(135), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2210] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(28), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(181), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2295] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(27), 1,
      aux_sym_source_code_repeat1,
    STATE(29), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(138), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2380] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(30), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(138), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2465] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(31), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(139), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2550] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(32), 1,
      sym_comment,
    STATE(37), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(181), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2635] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(33), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(128), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2720] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(31), 1,
      aux_sym_source_code_repeat1,
    STATE(34), 1,
      sym_comment,
    STATE(119), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2805] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(35), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(119), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2890] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(36), 1,
      sym_comment,
    STATE(44), 1,
      aux_sym_source_code_repeat1,
    STATE(118), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(55), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [2975] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(37), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(191), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3060] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(35), 1,
      aux_sym_source_code_repeat1,
    STATE(38), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(143), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3145] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(39), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(143), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3230] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(40), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(144), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3315] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(41), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(172), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3400] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(42), 1,
      sym_comment,
    STATE(45), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(191), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3485] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(43), 1,
      sym_comment,
    STATE(50), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(193), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3570] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(44), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(124), 1,
      sym_block_terminator,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(55), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3655] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(45), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(201), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3740] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(46), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(145), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3825] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(39), 1,
      aux_sym_source_code_repeat1,
    STATE(47), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(149), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3910] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(48), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(149), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [3995] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(40), 1,
      aux_sym_source_code_repeat1,
    STATE(49), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(152), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4080] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(50), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(167), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4165] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(51), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(175), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4250] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(52), 1,
      sym_comment,
    STATE(58), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(175), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4335] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(46), 1,
      aux_sym_source_code_repeat1,
    STATE(53), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(155), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4420] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(54), 1,
      sym_comment,
    STATE(57), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(156), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4505] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(55), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(155), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4590] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(48), 1,
      aux_sym_source_code_repeat1,
    STATE(56), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(147), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4675] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(57), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(141), 1,
      sym_block_terminator,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4760] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(58), 1,
      sym_comment,
    STATE(62), 1,
      aux_sym_source_code_repeat1,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(179), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4845] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(13), 1,
      aux_sym_source_code_repeat1,
    STATE(59), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(199), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [4930] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(20), 1,
      aux_sym_source_code_repeat1,
    STATE(60), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(171), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(31), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [5015] = 23,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(29), 1,
      sym_identifier,
    ACTIONS(35), 1,
      anon_sym_IF,
    ACTIONS(37), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(39), 1,
      anon_sym_DOWHILE,
    ACTIONS(41), 1,
      anon_sym_DO,
    ACTIONS(43), 1,
      anon_sym_FOR,
    ACTIONS(45), 1,
      anon_sym_PROCEDURE,
    ACTIONS(47), 1,
      anon_sym_FUNCTION,
    ACTIONS(49), 1,
      anon_sym_RETURN,
    ACTIONS(51), 1,
      anon_sym_ASSIGN,
    STATE(55), 1,
      aux_sym_source_code_repeat1,
    STATE(61), 1,
      sym_comment,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(157), 1,
      sym_block_terminator,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(53), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [5100] = 21,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(59), 1,
      sym_identifier,
    ACTIONS(67), 1,
      anon_sym_IF,
    ACTIONS(70), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(73), 1,
      anon_sym_DOWHILE,
    ACTIONS(76), 1,
      anon_sym_DO,
    ACTIONS(79), 1,
      anon_sym_FOR,
    ACTIONS(82), 1,
      anon_sym_PROCEDURE,
    ACTIONS(85), 1,
      anon_sym_FUNCTION,
    ACTIONS(88), 1,
      anon_sym_RETURN,
    ACTIONS(91), 1,
      anon_sym_ASSIGN,
    STATE(133), 1,
      sym_assign_statement,
    STATE(142), 1,
      sym_statement,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(64), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(62), 2,
      sym_comment,
      aux_sym_source_code_repeat1,
    STATE(136), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    ACTIONS(62), 3,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
    STATE(134), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(137), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [5180] = 21,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(94), 1,
      ts_builtin_sym_end,
    ACTIONS(96), 1,
      sym_identifier,
    ACTIONS(102), 1,
      anon_sym_IF,
    ACTIONS(105), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(108), 1,
      anon_sym_DOWHILE,
    ACTIONS(111), 1,
      anon_sym_DO,
    ACTIONS(114), 1,
      anon_sym_FOR,
    ACTIONS(117), 1,
      anon_sym_PROCEDURE,
    ACTIONS(120), 1,
      anon_sym_FUNCTION,
    ACTIONS(123), 1,
      anon_sym_RETURN,
    ACTIONS(126), 1,
      anon_sym_ASSIGN,
    STATE(189), 1,
      sym_assign_statement,
    STATE(196), 1,
      sym_statement,
    STATE(366), 1,
      sym_assignment,
    STATE(369), 1,
      sym_function_call,
    ACTIONS(99), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(63), 2,
      sym_comment,
      aux_sym_source_code_repeat1,
    STATE(192), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(190), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(194), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [5258] = 22,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(7), 1,
      sym_identifier,
    ACTIONS(11), 1,
      anon_sym_IF,
    ACTIONS(13), 1,
      anon_sym_REPEAT_COLON,
    ACTIONS(15), 1,
      anon_sym_DOWHILE,
    ACTIONS(17), 1,
      anon_sym_DO,
    ACTIONS(19), 1,
      anon_sym_FOR,
    ACTIONS(21), 1,
      anon_sym_PROCEDURE,
    ACTIONS(23), 1,
      anon_sym_FUNCTION,
    ACTIONS(25), 1,
      anon_sym_RETURN,
    ACTIONS(27), 1,
      anon_sym_ASSIGN,
    ACTIONS(129), 1,
      ts_builtin_sym_end,
    STATE(63), 1,
      aux_sym_source_code_repeat1,
    STATE(64), 1,
      sym_comment,
    STATE(189), 1,
      sym_assign_statement,
    STATE(196), 1,
      sym_statement,
    STATE(366), 1,
      sym_assignment,
    STATE(369), 1,
      sym_function_call,
    ACTIONS(9), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(192), 2,
      sym_if_do_statement,
      sym_if_then_statement,
    STATE(190), 3,
      sym_repeat_statement,
      sym_do_while_statement,
      sym_do_statement,
    STATE(194), 10,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
      sym_if_statement,
      sym_loop_statement,
      sym_for_statement,
      sym_procedure_statement,
      sym_function_statement,
      sym_return_statement,
      sym_abl_statement,
  [5338] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(65), 1,
      sym_comment,
    ACTIONS(133), 4,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
      aux_sym_object_property_token1,
    ACTIONS(131), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5373] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(66), 1,
      sym_comment,
    ACTIONS(139), 4,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
      aux_sym_object_property_token1,
    ACTIONS(137), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5408] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(67), 1,
      sym_comment,
    ACTIONS(143), 4,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
      aux_sym_object_property_token1,
    ACTIONS(141), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5443] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(68), 1,
      sym_comment,
    ACTIONS(147), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(145), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5477] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(69), 1,
      sym_comment,
    ACTIONS(151), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(149), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5511] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(70), 1,
      sym_comment,
    ACTIONS(155), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(153), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5545] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(71), 1,
      sym_comment,
    ACTIONS(159), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(157), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5579] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(72), 1,
      sym_comment,
    ACTIONS(163), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(161), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5613] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(73), 1,
      sym_comment,
    ACTIONS(167), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(165), 20,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_COLON,
      anon_sym_TO,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5647] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(171), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(173), 1,
      anon_sym_ELSEIF,
    STATE(74), 1,
      sym_comment,
    STATE(76), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(94), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(169), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [5684] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(171), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(173), 1,
      anon_sym_ELSEIF,
    STATE(75), 1,
      sym_comment,
    STATE(76), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(94), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(175), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [5721] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(179), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(182), 1,
      anon_sym_ELSEIF,
    STATE(76), 2,
      sym_comment,
      aux_sym_if_do_statement_repeat1,
    STATE(94), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(177), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [5756] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(171), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(173), 1,
      anon_sym_ELSEIF,
    STATE(75), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(77), 1,
      sym_comment,
    STATE(94), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(185), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [5793] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(171), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(173), 1,
      anon_sym_ELSEIF,
    STATE(74), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(78), 1,
      sym_comment,
    STATE(94), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(175), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [5830] = 7,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(187), 1,
      anon_sym_LPAREN,
    ACTIONS(189), 1,
      aux_sym_object_property_token1,
    STATE(79), 1,
      sym_comment,
    STATE(86), 1,
      aux_sym_object_property_repeat1,
    ACTIONS(163), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(161), 13,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
  [5866] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(195), 1,
      aux_sym_object_property_token1,
    STATE(80), 2,
      sym_comment,
      aux_sym_object_property_repeat1,
    ACTIONS(193), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(191), 13,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
  [5897] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(198), 1,
      ts_builtin_sym_end,
    ACTIONS(200), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(202), 1,
      anon_sym_ELSEIF,
    STATE(81), 1,
      sym_comment,
    STATE(87), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(121), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(169), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [5934] = 7,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(187), 1,
      anon_sym_LPAREN,
    ACTIONS(204), 1,
      aux_sym_object_property_token1,
    STATE(82), 1,
      sym_comment,
    STATE(101), 1,
      aux_sym_object_property_repeat1,
    ACTIONS(163), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(161), 13,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [5969] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(200), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(202), 1,
      anon_sym_ELSEIF,
    ACTIONS(206), 1,
      ts_builtin_sym_end,
    STATE(83), 1,
      sym_comment,
    STATE(88), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(121), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(185), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6006] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(208), 1,
      anon_sym_LPAREN,
    STATE(84), 1,
      sym_comment,
    ACTIONS(193), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(191), 14,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
      aux_sym_object_property_token1,
  [6037] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(200), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(202), 1,
      anon_sym_ELSEIF,
    ACTIONS(210), 1,
      ts_builtin_sym_end,
    STATE(81), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(85), 1,
      sym_comment,
    STATE(121), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(175), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6074] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(189), 1,
      aux_sym_object_property_token1,
    STATE(80), 1,
      aux_sym_object_property_repeat1,
    STATE(86), 1,
      sym_comment,
    ACTIONS(214), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(212), 13,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
  [6107] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(216), 1,
      ts_builtin_sym_end,
    ACTIONS(218), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(221), 1,
      anon_sym_ELSEIF,
    STATE(87), 2,
      sym_comment,
      aux_sym_if_do_statement_repeat1,
    STATE(121), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(177), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6142] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(200), 1,
      anon_sym_ELSEDO_COLON,
    ACTIONS(202), 1,
      anon_sym_ELSEIF,
    ACTIONS(210), 1,
      ts_builtin_sym_end,
    STATE(87), 1,
      aux_sym_if_do_statement_repeat1,
    STATE(88), 1,
      sym_comment,
    STATE(121), 2,
      sym_else_do_statement,
      sym_else_do_if_statement,
    ACTIONS(175), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6179] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(89), 1,
      sym_comment,
    ACTIONS(224), 17,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6205] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(90), 1,
      sym_comment,
    ACTIONS(143), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(141), 14,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
      aux_sym_object_property_token1,
  [6233] = 8,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(91), 1,
      sym_comment,
    STATE(226), 1,
      sym_comparator,
    STATE(246), 1,
      aux_sym_conditions_repeat1,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(230), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(232), 7,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6269] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(92), 1,
      sym_comment,
    ACTIONS(234), 17,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6295] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(93), 1,
      sym_comment,
    ACTIONS(133), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(131), 14,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
      aux_sym_object_property_token1,
  [6323] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(94), 1,
      sym_comment,
    ACTIONS(236), 17,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6349] = 7,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(240), 1,
      anon_sym_THEN,
    STATE(95), 1,
      sym_comment,
    STATE(232), 1,
      sym_comparator,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(238), 9,
      sym_terminator,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
  [6383] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(242), 1,
      aux_sym_object_property_token1,
    ACTIONS(193), 2,
      anon_sym_LT,
      anon_sym_GT,
    STATE(96), 2,
      sym_comment,
      aux_sym_object_property_repeat1,
    ACTIONS(191), 13,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6413] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(187), 1,
      anon_sym_LPAREN,
    STATE(97), 1,
      sym_comment,
    ACTIONS(193), 3,
      anon_sym_LT,
      anon_sym_GT,
      aux_sym_object_property_token1,
    ACTIONS(191), 13,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6443] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(98), 1,
      sym_comment,
    ACTIONS(139), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(137), 14,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
      aux_sym_object_property_token1,
  [6471] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(99), 1,
      sym_comment,
    ACTIONS(245), 17,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6497] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(100), 1,
      sym_comment,
    ACTIONS(247), 17,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6523] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(204), 1,
      aux_sym_object_property_token1,
    STATE(96), 1,
      aux_sym_object_property_repeat1,
    STATE(101), 1,
      sym_comment,
    ACTIONS(214), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(212), 13,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6555] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(102), 1,
      sym_comment,
    ACTIONS(249), 17,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6581] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(253), 1,
      anon_sym_ELSE,
    STATE(103), 1,
      sym_comment,
    STATE(129), 1,
      sym_else_then_statement,
    ACTIONS(251), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6611] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(104), 1,
      sym_comment,
    ACTIONS(193), 3,
      anon_sym_LT,
      anon_sym_GT,
      anon_sym_THEN,
    ACTIONS(191), 14,
      sym_terminator,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      anon_sym_THENDO_COLON,
      anon_sym_TO,
      aux_sym_object_property_token1,
  [6639] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(105), 1,
      sym_comment,
    STATE(226), 1,
      sym_comparator,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(238), 9,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6670] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(106), 1,
      sym_comment,
    ACTIONS(255), 16,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6695] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(107), 1,
      sym_comment,
    STATE(267), 1,
      sym_primitive_type,
    ACTIONS(259), 2,
      anon_sym_DATE,
      anon_sym_DATETIME,
    ACTIONS(257), 13,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
      anon_sym_DATETIME_DASHTZ,
      anon_sym_INT64,
      anon_sym_LONGCHAR,
      anon_sym_MEMPTR,
      anon_sym_RAW,
      anon_sym_RECID,
      anon_sym_ROWID,
      anon_sym_HANDLE,
      anon_sym_COM_DASHHANDLE,
  [6724] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(108), 1,
      sym_comment,
    ACTIONS(261), 16,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6749] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(109), 1,
      sym_comment,
    ACTIONS(193), 3,
      anon_sym_LT,
      anon_sym_GT,
      aux_sym_object_property_token1,
    ACTIONS(191), 13,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6776] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(110), 1,
      sym_comment,
    STATE(360), 1,
      sym_primitive_type,
    ACTIONS(259), 2,
      anon_sym_DATE,
      anon_sym_DATETIME,
    ACTIONS(257), 13,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
      anon_sym_DATETIME_DASHTZ,
      anon_sym_INT64,
      anon_sym_LONGCHAR,
      anon_sym_MEMPTR,
      anon_sym_RAW,
      anon_sym_RECID,
      anon_sym_ROWID,
      anon_sym_HANDLE,
      anon_sym_COM_DASHHANDLE,
  [6805] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(111), 1,
      sym_comment,
    STATE(317), 1,
      sym_primitive_type,
    ACTIONS(259), 2,
      anon_sym_DATE,
      anon_sym_DATETIME,
    ACTIONS(257), 13,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
      anon_sym_DATETIME_DASHTZ,
      anon_sym_INT64,
      anon_sym_LONGCHAR,
      anon_sym_MEMPTR,
      anon_sym_RAW,
      anon_sym_RECID,
      anon_sym_ROWID,
      anon_sym_HANDLE,
      anon_sym_COM_DASHHANDLE,
  [6834] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(112), 1,
      sym_comment,
    STATE(263), 1,
      sym_primitive_type,
    ACTIONS(259), 2,
      anon_sym_DATE,
      anon_sym_DATETIME,
    ACTIONS(257), 13,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
      anon_sym_DATETIME_DASHTZ,
      anon_sym_INT64,
      anon_sym_LONGCHAR,
      anon_sym_MEMPTR,
      anon_sym_RAW,
      anon_sym_RECID,
      anon_sym_ROWID,
      anon_sym_HANDLE,
      anon_sym_COM_DASHHANDLE,
  [6863] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(113), 1,
      sym_comment,
    ACTIONS(263), 16,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6888] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(114), 1,
      sym_comment,
    ACTIONS(265), 16,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6913] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(115), 1,
      sym_comment,
    STATE(375), 1,
      sym_primitive_type,
    ACTIONS(259), 2,
      anon_sym_DATE,
      anon_sym_DATETIME,
    ACTIONS(257), 13,
      anon_sym_LOGICAL,
      anon_sym_INTEGER,
      anon_sym_CHARACTER,
      anon_sym_DECIMAL,
      anon_sym_DATETIME_DASHTZ,
      anon_sym_INT64,
      anon_sym_LONGCHAR,
      anon_sym_MEMPTR,
      anon_sym_RAW,
      anon_sym_RECID,
      anon_sym_ROWID,
      anon_sym_HANDLE,
      anon_sym_COM_DASHHANDLE,
  [6942] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(116), 1,
      sym_comment,
    ACTIONS(267), 16,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [6967] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(117), 1,
      sym_comment,
    STATE(226), 1,
      sym_comparator,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
    ACTIONS(269), 9,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [6998] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(271), 1,
      ts_builtin_sym_end,
    STATE(118), 1,
      sym_comment,
    ACTIONS(247), 14,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7024] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(119), 1,
      sym_comment,
    ACTIONS(273), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7048] = 13,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(275), 1,
      sym_identifier,
    ACTIONS(277), 1,
      sym_terminator,
    ACTIONS(279), 1,
      anon_sym_EQ,
    ACTIONS(281), 1,
      sym_number_literal,
    ACTIONS(283), 1,
      anon_sym_DQUOTE,
    ACTIONS(285), 1,
      anon_sym_SQUOTE,
    ACTIONS(287), 1,
      anon_sym_LPAREN,
    STATE(120), 1,
      sym_comment,
    STATE(200), 1,
      aux_sym_abl_statement_repeat1,
    STATE(216), 1,
      sym_expression,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [7092] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(289), 1,
      ts_builtin_sym_end,
    STATE(121), 1,
      sym_comment,
    ACTIONS(236), 14,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7118] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(291), 1,
      ts_builtin_sym_end,
    STATE(122), 1,
      sym_comment,
    ACTIONS(234), 14,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7144] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(123), 1,
      sym_comment,
    ACTIONS(293), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7168] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(295), 1,
      ts_builtin_sym_end,
    STATE(124), 1,
      sym_comment,
    ACTIONS(249), 14,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7194] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(125), 1,
      sym_comment,
    ACTIONS(297), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7218] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(126), 1,
      sym_comment,
    ACTIONS(299), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7242] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(127), 1,
      sym_comment,
    ACTIONS(234), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7266] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(128), 1,
      sym_comment,
    ACTIONS(301), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7290] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(129), 1,
      sym_comment,
    ACTIONS(303), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7314] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(130), 1,
      sym_comment,
    ACTIONS(305), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7338] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(131), 1,
      sym_comment,
    ACTIONS(307), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7362] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(132), 1,
      sym_comment,
    ACTIONS(309), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7386] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(133), 1,
      sym_comment,
    ACTIONS(311), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7410] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(134), 1,
      sym_comment,
    ACTIONS(313), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7434] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(135), 1,
      sym_comment,
    ACTIONS(315), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7458] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(136), 1,
      sym_comment,
    ACTIONS(317), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7482] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(137), 1,
      sym_comment,
    ACTIONS(319), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7506] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(138), 1,
      sym_comment,
    ACTIONS(321), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7530] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(139), 1,
      sym_comment,
    ACTIONS(323), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7554] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(140), 1,
      sym_comment,
    ACTIONS(325), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7578] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(141), 1,
      sym_comment,
    ACTIONS(327), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7602] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(142), 1,
      sym_comment,
    ACTIONS(329), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7626] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(143), 1,
      sym_comment,
    ACTIONS(331), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7650] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(144), 1,
      sym_comment,
    ACTIONS(333), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7674] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(145), 1,
      sym_comment,
    ACTIONS(335), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7698] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(337), 1,
      ts_builtin_sym_end,
    STATE(146), 1,
      sym_comment,
    ACTIONS(245), 14,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7724] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(147), 1,
      sym_comment,
    ACTIONS(339), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7748] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(148), 1,
      sym_comment,
    ACTIONS(341), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7772] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(149), 1,
      sym_comment,
    ACTIONS(343), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7796] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(345), 1,
      ts_builtin_sym_end,
    ACTIONS(347), 1,
      anon_sym_ELSE,
    STATE(150), 1,
      sym_comment,
    STATE(188), 1,
      sym_else_then_statement,
    ACTIONS(251), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7826] = 13,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(275), 1,
      sym_identifier,
    ACTIONS(279), 1,
      anon_sym_EQ,
    ACTIONS(281), 1,
      sym_number_literal,
    ACTIONS(283), 1,
      anon_sym_DQUOTE,
    ACTIONS(285), 1,
      anon_sym_SQUOTE,
    ACTIONS(287), 1,
      anon_sym_LPAREN,
    ACTIONS(349), 1,
      sym_terminator,
    STATE(151), 1,
      sym_comment,
    STATE(183), 1,
      aux_sym_abl_statement_repeat1,
    STATE(216), 1,
      sym_expression,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [7870] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(152), 1,
      sym_comment,
    ACTIONS(351), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7894] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(153), 1,
      sym_comment,
    ACTIONS(353), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7918] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(355), 1,
      ts_builtin_sym_end,
    STATE(154), 1,
      sym_comment,
    ACTIONS(224), 14,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSEDO_COLON,
      anon_sym_ELSEIF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7944] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(155), 1,
      sym_comment,
    ACTIONS(357), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7968] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(156), 1,
      sym_comment,
    ACTIONS(359), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [7992] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(157), 1,
      sym_comment,
    ACTIONS(361), 15,
      sym_identifier,
      aux_sym_block_terminator_token1,
      aux_sym_block_terminator_token2,
      aux_sym_block_terminator_token3,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8016] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(363), 1,
      ts_builtin_sym_end,
    STATE(158), 1,
      sym_comment,
    ACTIONS(267), 13,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8041] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(365), 1,
      sym_identifier,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    STATE(159), 1,
      sym_comment,
    STATE(244), 1,
      sym_expression,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    ACTIONS(367), 3,
      sym_terminator,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [8078] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(375), 1,
      ts_builtin_sym_end,
    STATE(160), 1,
      sym_comment,
    ACTIONS(265), 13,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8103] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(377), 1,
      ts_builtin_sym_end,
    STATE(161), 1,
      sym_comment,
    ACTIONS(255), 13,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8128] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(379), 1,
      ts_builtin_sym_end,
    STATE(162), 1,
      sym_comment,
    ACTIONS(261), 13,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8153] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(381), 1,
      ts_builtin_sym_end,
    STATE(163), 1,
      sym_comment,
    ACTIONS(263), 13,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_ELSE,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8178] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(161), 1,
      sym_identifier,
    ACTIONS(383), 1,
      anon_sym_LPAREN,
    ACTIONS(385), 1,
      aux_sym_object_property_token1,
    STATE(164), 1,
      sym_comment,
    STATE(169), 1,
      aux_sym_object_property_repeat1,
    ACTIONS(163), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [8209] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(387), 1,
      ts_builtin_sym_end,
    STATE(165), 1,
      sym_comment,
    ACTIONS(353), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8233] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(389), 1,
      ts_builtin_sym_end,
    STATE(166), 1,
      sym_comment,
    ACTIONS(343), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8257] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(391), 1,
      ts_builtin_sym_end,
    STATE(167), 1,
      sym_comment,
    ACTIONS(321), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8281] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(393), 1,
      ts_builtin_sym_end,
    STATE(168), 1,
      sym_comment,
    ACTIONS(351), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8305] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(212), 1,
      sym_identifier,
    ACTIONS(385), 1,
      aux_sym_object_property_token1,
    STATE(169), 1,
      sym_comment,
    STATE(195), 1,
      aux_sym_object_property_repeat1,
    ACTIONS(214), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [8333] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(395), 1,
      ts_builtin_sym_end,
    STATE(170), 1,
      sym_comment,
    ACTIONS(335), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8357] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(397), 1,
      ts_builtin_sym_end,
    STATE(171), 1,
      sym_comment,
    ACTIONS(359), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8381] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(399), 1,
      ts_builtin_sym_end,
    STATE(172), 1,
      sym_comment,
    ACTIONS(301), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8405] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(191), 1,
      sym_identifier,
    ACTIONS(383), 1,
      anon_sym_LPAREN,
    STATE(173), 1,
      sym_comment,
    ACTIONS(193), 11,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      aux_sym_object_property_token1,
  [8431] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(401), 1,
      ts_builtin_sym_end,
    STATE(174), 1,
      sym_comment,
    ACTIONS(297), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8455] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(403), 1,
      ts_builtin_sym_end,
    STATE(175), 1,
      sym_comment,
    ACTIONS(315), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8479] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(405), 1,
      ts_builtin_sym_end,
    STATE(176), 1,
      sym_comment,
    ACTIONS(299), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8503] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(407), 1,
      ts_builtin_sym_end,
    STATE(177), 1,
      sym_comment,
    ACTIONS(341), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8527] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(409), 1,
      ts_builtin_sym_end,
    STATE(178), 1,
      sym_comment,
    ACTIONS(357), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8551] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(411), 1,
      ts_builtin_sym_end,
    STATE(179), 1,
      sym_comment,
    ACTIONS(293), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8575] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(413), 1,
      ts_builtin_sym_end,
    STATE(180), 1,
      sym_comment,
    ACTIONS(333), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8599] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(415), 1,
      ts_builtin_sym_end,
    STATE(181), 1,
      sym_comment,
    ACTIONS(331), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8623] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(291), 1,
      ts_builtin_sym_end,
    STATE(182), 1,
      sym_comment,
    ACTIONS(234), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8647] = 11,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(275), 1,
      sym_identifier,
    ACTIONS(281), 1,
      sym_number_literal,
    ACTIONS(283), 1,
      anon_sym_DQUOTE,
    ACTIONS(285), 1,
      anon_sym_SQUOTE,
    ACTIONS(417), 1,
      sym_terminator,
    STATE(183), 1,
      sym_comment,
    STATE(198), 1,
      aux_sym_abl_statement_repeat1,
    STATE(216), 1,
      sym_expression,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [8685] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(419), 1,
      ts_builtin_sym_end,
    STATE(184), 1,
      sym_comment,
    ACTIONS(309), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8709] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(421), 1,
      ts_builtin_sym_end,
    STATE(185), 1,
      sym_comment,
    ACTIONS(339), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8733] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(423), 1,
      ts_builtin_sym_end,
    STATE(186), 1,
      sym_comment,
    ACTIONS(327), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8757] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(425), 1,
      ts_builtin_sym_end,
    STATE(187), 1,
      sym_comment,
    ACTIONS(307), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8781] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(427), 1,
      ts_builtin_sym_end,
    STATE(188), 1,
      sym_comment,
    ACTIONS(303), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8805] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(429), 1,
      ts_builtin_sym_end,
    STATE(189), 1,
      sym_comment,
    ACTIONS(311), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8829] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(431), 1,
      ts_builtin_sym_end,
    STATE(190), 1,
      sym_comment,
    ACTIONS(313), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8853] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(433), 1,
      ts_builtin_sym_end,
    STATE(191), 1,
      sym_comment,
    ACTIONS(273), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8877] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(435), 1,
      ts_builtin_sym_end,
    STATE(192), 1,
      sym_comment,
    ACTIONS(317), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8901] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(437), 1,
      ts_builtin_sym_end,
    STATE(193), 1,
      sym_comment,
    ACTIONS(325), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8925] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(439), 1,
      ts_builtin_sym_end,
    STATE(194), 1,
      sym_comment,
    ACTIONS(319), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8949] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(191), 1,
      sym_identifier,
    ACTIONS(441), 1,
      aux_sym_object_property_token1,
    STATE(195), 2,
      sym_comment,
      aux_sym_object_property_repeat1,
    ACTIONS(193), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [8975] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(444), 1,
      ts_builtin_sym_end,
    STATE(196), 1,
      sym_comment,
    ACTIONS(329), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [8999] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(446), 1,
      ts_builtin_sym_end,
    STATE(197), 1,
      sym_comment,
    ACTIONS(305), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [9023] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(448), 1,
      sym_identifier,
    ACTIONS(451), 1,
      sym_terminator,
    ACTIONS(453), 1,
      sym_number_literal,
    ACTIONS(456), 1,
      anon_sym_DQUOTE,
    ACTIONS(459), 1,
      anon_sym_SQUOTE,
    STATE(216), 1,
      sym_expression,
    STATE(198), 2,
      sym_comment,
      aux_sym_abl_statement_repeat1,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9059] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(462), 1,
      ts_builtin_sym_end,
    STATE(199), 1,
      sym_comment,
    ACTIONS(361), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [9083] = 11,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(275), 1,
      sym_identifier,
    ACTIONS(281), 1,
      sym_number_literal,
    ACTIONS(283), 1,
      anon_sym_DQUOTE,
    ACTIONS(285), 1,
      anon_sym_SQUOTE,
    ACTIONS(464), 1,
      sym_terminator,
    STATE(198), 1,
      aux_sym_abl_statement_repeat1,
    STATE(200), 1,
      sym_comment,
    STATE(216), 1,
      sym_expression,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9121] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(466), 1,
      ts_builtin_sym_end,
    STATE(201), 1,
      sym_comment,
    ACTIONS(323), 12,
      sym_identifier,
      anon_sym_DEFINE,
      anon_sym_DEF,
      anon_sym_IF,
      anon_sym_REPEAT_COLON,
      anon_sym_DOWHILE,
      anon_sym_DO,
      anon_sym_FOR,
      anon_sym_PROCEDURE,
      anon_sym_FUNCTION,
      anon_sym_RETURN,
      anon_sym_ASSIGN,
  [9145] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    ACTIONS(470), 1,
      anon_sym_RPAREN,
    STATE(202), 1,
      sym_comment,
    STATE(245), 1,
      sym_expression,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9180] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(191), 1,
      sym_identifier,
    STATE(203), 1,
      sym_comment,
    ACTIONS(193), 11,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      aux_sym_object_property_token1,
  [9203] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(204), 1,
      sym_comment,
    STATE(212), 1,
      sym_expression,
    STATE(330), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9238] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(205), 1,
      sym_comment,
    STATE(212), 1,
      sym_expression,
    STATE(368), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9273] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(131), 1,
      sym_identifier,
    STATE(206), 1,
      sym_comment,
    ACTIONS(133), 11,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      aux_sym_object_property_token1,
  [9296] = 11,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(472), 1,
      anon_sym_COLON,
    ACTIONS(474), 1,
      anon_sym_WHERE,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    STATE(207), 1,
      sym_comment,
    STATE(239), 1,
      aux_sym_for_statement_repeat1,
    STATE(243), 1,
      sym_where_clause,
    STATE(256), 1,
      sym_query_tuning,
    STATE(340), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [9333] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(482), 1,
      sym_identifier,
    STATE(91), 1,
      sym_expression,
    STATE(208), 1,
      sym_comment,
    STATE(258), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9368] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(238), 1,
      sym_identifier,
    STATE(209), 1,
      sym_comment,
    STATE(234), 1,
      sym_comparator,
    ACTIONS(240), 4,
      sym_terminator,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
    ACTIONS(226), 6,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
  [9395] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(210), 1,
      sym_comment,
    STATE(212), 1,
      sym_expression,
    STATE(311), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9430] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(141), 1,
      sym_identifier,
    STATE(211), 1,
      sym_comment,
    ACTIONS(143), 11,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      aux_sym_object_property_token1,
  [9453] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(232), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(486), 1,
      anon_sym_THEN,
    STATE(212), 1,
      sym_comment,
    STATE(232), 1,
      sym_comparator,
    STATE(264), 1,
      aux_sym_conditions_repeat1,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(484), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [9486] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    ACTIONS(488), 1,
      anon_sym_RPAREN,
    STATE(213), 1,
      sym_comment,
    STATE(236), 1,
      sym_expression,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9521] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(482), 1,
      sym_identifier,
    STATE(91), 1,
      sym_expression,
    STATE(214), 1,
      sym_comment,
    STATE(348), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9556] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(137), 1,
      sym_identifier,
    STATE(215), 1,
      sym_comment,
    ACTIONS(139), 11,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
      aux_sym_object_property_token1,
  [9579] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(490), 1,
      sym_identifier,
    STATE(216), 1,
      sym_comment,
    STATE(234), 1,
      sym_comparator,
    ACTIONS(492), 4,
      sym_terminator,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
    ACTIONS(226), 6,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
  [9606] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(212), 1,
      sym_expression,
    STATE(217), 1,
      sym_comment,
    STATE(315), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9641] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(482), 1,
      sym_identifier,
    STATE(91), 1,
      sym_expression,
    STATE(218), 1,
      sym_comment,
    STATE(372), 1,
      sym_conditions,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9676] = 11,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(474), 1,
      anon_sym_WHERE,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(494), 1,
      anon_sym_COLON,
    STATE(219), 1,
      sym_comment,
    STATE(240), 1,
      aux_sym_for_statement_repeat1,
    STATE(242), 1,
      sym_where_clause,
    STATE(256), 1,
      sym_query_tuning,
    STATE(329), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [9713] = 10,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    ACTIONS(496), 1,
      anon_sym_RPAREN,
    STATE(220), 1,
      sym_comment,
    STATE(241), 1,
      sym_expression,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9748] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(157), 1,
      sym_identifier,
    STATE(221), 1,
      sym_comment,
    ACTIONS(159), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [9770] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(149), 1,
      sym_identifier,
    STATE(222), 1,
      sym_comment,
    ACTIONS(151), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [9792] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(145), 1,
      sym_identifier,
    STATE(223), 1,
      sym_comment,
    ACTIONS(147), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [9814] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(165), 1,
      sym_identifier,
    STATE(224), 1,
      sym_comment,
    ACTIONS(167), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [9836] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(225), 1,
      sym_comment,
    STATE(248), 1,
      sym_expression,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9868] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(482), 1,
      sym_identifier,
    STATE(105), 1,
      sym_expression,
    STATE(226), 1,
      sym_comment,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9900] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(275), 1,
      sym_identifier,
    ACTIONS(281), 1,
      sym_number_literal,
    ACTIONS(283), 1,
      anon_sym_DQUOTE,
    ACTIONS(285), 1,
      anon_sym_SQUOTE,
    STATE(227), 1,
      sym_comment,
    STATE(255), 1,
      sym_expression,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9932] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(482), 1,
      sym_identifier,
    STATE(117), 1,
      sym_expression,
    STATE(228), 1,
      sym_comment,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [9964] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(161), 1,
      sym_identifier,
    STATE(229), 1,
      sym_comment,
    ACTIONS(163), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [9986] = 7,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(498), 1,
      anon_sym_THEN,
    STATE(230), 1,
      sym_comment,
    STATE(232), 1,
      sym_comparator,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(269), 3,
      anon_sym_AND,
      anon_sym_OR,
      anon_sym_THENDO_COLON,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10014] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(231), 1,
      sym_comment,
    STATE(254), 1,
      sym_expression,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [10046] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(95), 1,
      sym_expression,
    STATE(232), 1,
      sym_comment,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [10078] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(369), 1,
      sym_number_literal,
    ACTIONS(371), 1,
      anon_sym_DQUOTE,
    ACTIONS(373), 1,
      anon_sym_SQUOTE,
    ACTIONS(468), 1,
      sym_identifier,
    STATE(230), 1,
      sym_expression,
    STATE(233), 1,
      sym_comment,
    STATE(68), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(72), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [10110] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(275), 1,
      sym_identifier,
    ACTIONS(281), 1,
      sym_number_literal,
    ACTIONS(283), 1,
      anon_sym_DQUOTE,
    ACTIONS(285), 1,
      anon_sym_SQUOTE,
    STATE(209), 1,
      sym_expression,
    STATE(234), 1,
      sym_comment,
    STATE(223), 2,
      sym_double_quoted_string,
      sym_single_quoted_string,
    STATE(229), 4,
      sym_comparison,
      sym_string_literal,
      sym_function_call,
      sym_object_property,
  [10142] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(153), 1,
      sym_identifier,
    STATE(235), 1,
      sym_comment,
    ACTIONS(155), 10,
      sym_terminator,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [10164] = 8,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(500), 1,
      anon_sym_COMMA,
    ACTIONS(502), 1,
      anon_sym_RPAREN,
    STATE(232), 1,
      sym_comparator,
    STATE(236), 1,
      sym_comment,
    STATE(300), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10193] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(504), 2,
      anon_sym_AND,
      anon_sym_OR,
    STATE(237), 2,
      sym_comment,
      aux_sym_conditions_repeat1,
    ACTIONS(269), 7,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10214] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(507), 1,
      anon_sym_COLON,
    STATE(238), 1,
      sym_comment,
    STATE(253), 1,
      aux_sym_for_statement_repeat1,
    STATE(256), 1,
      sym_query_tuning,
    STATE(349), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10245] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(509), 1,
      anon_sym_COLON,
    STATE(239), 1,
      sym_comment,
    STATE(253), 1,
      aux_sym_for_statement_repeat1,
    STATE(256), 1,
      sym_query_tuning,
    STATE(345), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10276] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(511), 1,
      anon_sym_COLON,
    STATE(240), 1,
      sym_comment,
    STATE(253), 1,
      aux_sym_for_statement_repeat1,
    STATE(256), 1,
      sym_query_tuning,
    STATE(377), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10307] = 8,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(500), 1,
      anon_sym_COMMA,
    ACTIONS(513), 1,
      anon_sym_RPAREN,
    STATE(232), 1,
      sym_comparator,
    STATE(241), 1,
      sym_comment,
    STATE(309), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10336] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(511), 1,
      anon_sym_COLON,
    STATE(242), 1,
      sym_comment,
    STATE(247), 1,
      aux_sym_for_statement_repeat1,
    STATE(256), 1,
      sym_query_tuning,
    STATE(377), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10367] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(509), 1,
      anon_sym_COLON,
    STATE(238), 1,
      aux_sym_for_statement_repeat1,
    STATE(243), 1,
      sym_comment,
    STATE(256), 1,
      sym_query_tuning,
    STATE(345), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10398] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(232), 1,
      sym_comparator,
    STATE(244), 1,
      sym_comment,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(515), 3,
      sym_terminator,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10423] = 8,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(500), 1,
      anon_sym_COMMA,
    ACTIONS(517), 1,
      anon_sym_RPAREN,
    STATE(232), 1,
      sym_comparator,
    STATE(245), 1,
      sym_comment,
    STATE(295), 1,
      aux_sym_function_call_repeat1,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10452] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(237), 1,
      aux_sym_conditions_repeat1,
    STATE(246), 1,
      sym_comment,
    ACTIONS(230), 2,
      anon_sym_AND,
      anon_sym_OR,
    ACTIONS(519), 7,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10475] = 9,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(476), 1,
      anon_sym_BREAK,
    ACTIONS(478), 1,
      anon_sym_BY,
    ACTIONS(521), 1,
      anon_sym_COLON,
    STATE(247), 1,
      sym_comment,
    STATE(253), 1,
      aux_sym_for_statement_repeat1,
    STATE(256), 1,
      sym_query_tuning,
    STATE(336), 1,
      sym_sort_clause,
    ACTIONS(480), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10506] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(232), 1,
      sym_comparator,
    STATE(248), 1,
      sym_comment,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(523), 2,
      sym_terminator,
      anon_sym_TO,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10530] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(525), 1,
      sym_identifier,
    STATE(150), 1,
      sym_terminated_statement,
    STATE(249), 1,
      sym_comment,
    STATE(366), 1,
      sym_assignment,
    STATE(369), 1,
      sym_function_call,
    ACTIONS(9), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(158), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [10558] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(525), 1,
      sym_identifier,
    STATE(103), 1,
      sym_terminated_statement,
    STATE(250), 1,
      sym_comment,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(116), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [10586] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(525), 1,
      sym_identifier,
    STATE(165), 1,
      sym_terminated_statement,
    STATE(251), 1,
      sym_comment,
    STATE(366), 1,
      sym_assignment,
    STATE(369), 1,
      sym_function_call,
    ACTIONS(9), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(158), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [10614] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(525), 1,
      sym_identifier,
    STATE(153), 1,
      sym_terminated_statement,
    STATE(252), 1,
      sym_comment,
    STATE(357), 1,
      sym_function_call,
    STATE(358), 1,
      sym_assignment,
    ACTIONS(33), 2,
      anon_sym_DEFINE,
      anon_sym_DEF,
    STATE(116), 3,
      sym_variable_definition,
      sym_variable_assignment,
      sym_function_call_statement,
  [10642] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(256), 1,
      sym_query_tuning,
    STATE(253), 2,
      sym_comment,
      aux_sym_for_statement_repeat1,
    ACTIONS(527), 3,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
    ACTIONS(529), 4,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10664] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(232), 1,
      sym_comparator,
    STATE(254), 1,
      sym_comment,
    ACTIONS(226), 2,
      anon_sym_LT,
      anon_sym_GT,
    ACTIONS(532), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
    ACTIONS(228), 4,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT_EQ,
  [10688] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(523), 1,
      sym_identifier,
    ACTIONS(534), 1,
      sym_terminator,
    STATE(234), 1,
      sym_comparator,
    STATE(255), 1,
      sym_comment,
    ACTIONS(226), 6,
      anon_sym_LT,
      anon_sym_LT_EQ,
      anon_sym_LT_GT,
      anon_sym_EQ,
      anon_sym_GT,
      anon_sym_GT_EQ,
  [10712] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(256), 1,
      sym_comment,
    ACTIONS(536), 7,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10728] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(257), 1,
      sym_comment,
    ACTIONS(538), 7,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10744] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(258), 1,
      sym_comment,
    ACTIONS(540), 7,
      anon_sym_COLON,
      anon_sym_BREAK,
      anon_sym_BY,
      anon_sym_NO_DASHLOCK,
      anon_sym_NO_DASHWAIT,
      anon_sym_SHARE_DASHLOCK,
      anon_sym_EXCLUSIVE_DASHLOCK,
  [10760] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(259), 1,
      sym_comment,
    ACTIONS(542), 6,
      sym_terminator,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
      anon_sym_LPAREN,
      anon_sym_COMMA,
      anon_sym_RPAREN,
  [10775] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(544), 1,
      sym_terminator,
    STATE(260), 1,
      sym_comment,
    STATE(266), 1,
      aux_sym_variable_definition_repeat1,
    STATE(304), 1,
      sym_variable_tuning,
    ACTIONS(546), 2,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
  [10795] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(548), 1,
      sym_terminator,
    STATE(261), 1,
      sym_comment,
    STATE(266), 1,
      aux_sym_variable_definition_repeat1,
    STATE(304), 1,
      sym_variable_tuning,
    ACTIONS(546), 2,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
  [10815] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(550), 1,
      anon_sym_RPAREN,
    STATE(262), 1,
      sym_comment,
    STATE(306), 1,
      sym_function_parameter,
    STATE(341), 1,
      sym_function_parameter_mode,
    ACTIONS(552), 2,
      anon_sym_INPUT,
      anon_sym_OUTPUT,
  [10835] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(554), 1,
      sym_terminator,
    STATE(260), 1,
      aux_sym_variable_definition_repeat1,
    STATE(263), 1,
      sym_comment,
    STATE(304), 1,
      sym_variable_tuning,
    ACTIONS(546), 2,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
  [10855] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(519), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(556), 1,
      anon_sym_THEN,
    STATE(264), 1,
      sym_comment,
    STATE(265), 1,
      aux_sym_conditions_repeat1,
    ACTIONS(484), 2,
      anon_sym_AND,
      anon_sym_OR,
  [10875] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(269), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(498), 1,
      anon_sym_THEN,
    ACTIONS(558), 2,
      anon_sym_AND,
      anon_sym_OR,
    STATE(265), 2,
      sym_comment,
      aux_sym_conditions_repeat1,
  [10893] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(561), 1,
      sym_terminator,
    STATE(304), 1,
      sym_variable_tuning,
    ACTIONS(563), 2,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
    STATE(266), 2,
      sym_comment,
      aux_sym_variable_definition_repeat1,
  [10911] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(566), 1,
      sym_terminator,
    STATE(261), 1,
      aux_sym_variable_definition_repeat1,
    STATE(267), 1,
      sym_comment,
    STATE(304), 1,
      sym_variable_tuning,
    ACTIONS(546), 2,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
  [10931] = 6,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(568), 1,
      anon_sym_RPAREN,
    STATE(268), 1,
      sym_comment,
    STATE(298), 1,
      sym_function_parameter,
    STATE(341), 1,
      sym_function_parameter_mode,
    ACTIONS(552), 2,
      anon_sym_INPUT,
      anon_sym_OUTPUT,
  [10951] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(570), 1,
      sym_identifier,
    ACTIONS(572), 1,
      sym_terminator,
    STATE(269), 1,
      sym_comment,
    STATE(273), 1,
      aux_sym_assign_statement_repeat1,
    STATE(327), 1,
      sym_assignment,
  [10970] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(574), 1,
      sym_identifier,
    STATE(270), 1,
      sym_comment,
    ACTIONS(576), 3,
      sym_number_literal,
      anon_sym_DQUOTE,
      anon_sym_SQUOTE,
  [10985] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(570), 1,
      sym_identifier,
    ACTIONS(578), 1,
      sym_terminator,
    STATE(271), 1,
      sym_comment,
    STATE(283), 1,
      aux_sym_assign_statement_repeat1,
    STATE(327), 1,
      sym_assignment,
  [11004] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(582), 1,
      anon_sym_SQUOTE,
    STATE(272), 1,
      sym_comment,
    STATE(287), 1,
      aux_sym_single_quoted_string_repeat1,
    ACTIONS(580), 2,
      aux_sym_comment_token2,
      aux_sym_single_quoted_string_token1,
  [11021] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(570), 1,
      sym_identifier,
    ACTIONS(584), 1,
      sym_terminator,
    STATE(273), 1,
      sym_comment,
    STATE(284), 1,
      aux_sym_assign_statement_repeat1,
    STATE(327), 1,
      sym_assignment,
  [11040] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(589), 1,
      anon_sym_STAR_SLASH,
    ACTIONS(586), 2,
      aux_sym_comment_token1,
      aux_sym_comment_token2,
    STATE(274), 2,
      sym_comment,
      aux_sym_comment_repeat1,
  [11055] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(591), 1,
      sym_identifier,
    ACTIONS(594), 1,
      anon_sym_COLON,
    STATE(320), 1,
      sym_sort_column,
    STATE(275), 2,
      sym_comment,
      aux_sym_sort_clause_repeat1,
  [11072] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(598), 1,
      anon_sym_STAR_SLASH,
    STATE(276), 1,
      sym_comment,
    STATE(281), 1,
      aux_sym_comment_repeat1,
    ACTIONS(596), 2,
      aux_sym_comment_token1,
      aux_sym_comment_token2,
  [11089] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(602), 1,
      anon_sym_DQUOTE,
    STATE(277), 1,
      sym_comment,
    STATE(285), 1,
      aux_sym_double_quoted_string_repeat1,
    ACTIONS(600), 2,
      aux_sym_comment_token2,
      aux_sym_double_quoted_string_token1,
  [11106] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(604), 1,
      anon_sym_DQUOTE,
    STATE(278), 1,
      sym_comment,
    STATE(285), 1,
      aux_sym_double_quoted_string_repeat1,
    ACTIONS(600), 2,
      aux_sym_comment_token2,
      aux_sym_double_quoted_string_token1,
  [11123] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(606), 1,
      anon_sym_SQUOTE,
    STATE(279), 1,
      sym_comment,
    STATE(287), 1,
      aux_sym_single_quoted_string_repeat1,
    ACTIONS(580), 2,
      aux_sym_comment_token2,
      aux_sym_single_quoted_string_token1,
  [11140] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(608), 1,
      anon_sym_DQUOTE,
    STATE(277), 1,
      aux_sym_double_quoted_string_repeat1,
    STATE(280), 1,
      sym_comment,
    ACTIONS(600), 2,
      aux_sym_comment_token2,
      aux_sym_double_quoted_string_token1,
  [11157] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(610), 1,
      anon_sym_STAR_SLASH,
    STATE(274), 1,
      aux_sym_comment_repeat1,
    STATE(281), 1,
      sym_comment,
    ACTIONS(596), 2,
      aux_sym_comment_token1,
      aux_sym_comment_token2,
  [11174] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(612), 1,
      anon_sym_SQUOTE,
    STATE(272), 1,
      aux_sym_single_quoted_string_repeat1,
    STATE(282), 1,
      sym_comment,
    ACTIONS(580), 2,
      aux_sym_comment_token2,
      aux_sym_single_quoted_string_token1,
  [11191] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(570), 1,
      sym_identifier,
    ACTIONS(614), 1,
      sym_terminator,
    STATE(283), 1,
      sym_comment,
    STATE(284), 1,
      aux_sym_assign_statement_repeat1,
    STATE(327), 1,
      sym_assignment,
  [11210] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(616), 1,
      sym_identifier,
    ACTIONS(619), 1,
      sym_terminator,
    STATE(327), 1,
      sym_assignment,
    STATE(284), 2,
      sym_comment,
      aux_sym_assign_statement_repeat1,
  [11227] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(624), 1,
      anon_sym_DQUOTE,
    ACTIONS(621), 2,
      aux_sym_comment_token2,
      aux_sym_double_quoted_string_token1,
    STATE(285), 2,
      sym_comment,
      aux_sym_double_quoted_string_repeat1,
  [11242] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(626), 1,
      sym_identifier,
    ACTIONS(628), 1,
      anon_sym_COLON,
    STATE(275), 1,
      aux_sym_sort_clause_repeat1,
    STATE(286), 1,
      sym_comment,
    STATE(320), 1,
      sym_sort_column,
  [11261] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(633), 1,
      anon_sym_SQUOTE,
    ACTIONS(630), 2,
      aux_sym_comment_token2,
      aux_sym_single_quoted_string_token1,
    STATE(287), 2,
      sym_comment,
      aux_sym_single_quoted_string_repeat1,
  [11276] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(288), 1,
      sym_comment,
    STATE(312), 1,
      sym_function_parameter,
    STATE(341), 1,
      sym_function_parameter_mode,
    ACTIONS(552), 2,
      anon_sym_INPUT,
      anon_sym_OUTPUT,
  [11293] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(635), 1,
      anon_sym_SQUOTE,
    STATE(279), 1,
      aux_sym_single_quoted_string_repeat1,
    STATE(289), 1,
      sym_comment,
    ACTIONS(580), 2,
      aux_sym_comment_token2,
      aux_sym_single_quoted_string_token1,
  [11310] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(637), 1,
      anon_sym_DQUOTE,
    STATE(278), 1,
      aux_sym_double_quoted_string_repeat1,
    STATE(290), 1,
      sym_comment,
    ACTIONS(600), 2,
      aux_sym_comment_token2,
      aux_sym_double_quoted_string_token1,
  [11327] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(626), 1,
      sym_identifier,
    ACTIONS(639), 1,
      anon_sym_COLON,
    STATE(275), 1,
      aux_sym_sort_clause_repeat1,
    STATE(291), 1,
      sym_comment,
    STATE(320), 1,
      sym_sort_column,
  [11346] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(643), 1,
      anon_sym_DESCENDING,
    STATE(292), 1,
      sym_comment,
    STATE(310), 1,
      sym_sort_order,
    ACTIONS(641), 2,
      sym_identifier,
      anon_sym_COLON,
  [11363] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(293), 1,
      sym_comment,
    ACTIONS(645), 3,
      aux_sym_comment_token2,
      anon_sym_DQUOTE,
      aux_sym_double_quoted_string_token1,
  [11375] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(647), 1,
      anon_sym_COMMA,
    ACTIONS(649), 1,
      anon_sym_RPAREN,
    STATE(294), 1,
      sym_comment,
    STATE(307), 1,
      aux_sym_function_statement_repeat1,
  [11391] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(500), 1,
      anon_sym_COMMA,
    ACTIONS(651), 1,
      anon_sym_RPAREN,
    STATE(295), 1,
      sym_comment,
    STATE(308), 1,
      aux_sym_function_call_repeat1,
  [11407] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(626), 1,
      sym_identifier,
    STATE(286), 1,
      aux_sym_sort_clause_repeat1,
    STATE(296), 1,
      sym_comment,
    STATE(320), 1,
      sym_sort_column,
  [11423] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(297), 1,
      sym_comment,
    ACTIONS(653), 3,
      aux_sym_comment_token2,
      anon_sym_SQUOTE,
      aux_sym_single_quoted_string_token1,
  [11435] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(647), 1,
      anon_sym_COMMA,
    ACTIONS(655), 1,
      anon_sym_RPAREN,
    STATE(294), 1,
      aux_sym_function_statement_repeat1,
    STATE(298), 1,
      sym_comment,
  [11451] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(299), 1,
      sym_comment,
    ACTIONS(657), 3,
      anon_sym_EACH,
      anon_sym_FIRST,
      anon_sym_LAST,
  [11463] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(500), 1,
      anon_sym_COMMA,
    ACTIONS(659), 1,
      anon_sym_RPAREN,
    STATE(300), 1,
      sym_comment,
    STATE(308), 1,
      aux_sym_function_call_repeat1,
  [11479] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(301), 1,
      sym_comment,
    ACTIONS(661), 3,
      anon_sym_EACH,
      anon_sym_FIRST,
      anon_sym_LAST,
  [11491] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    STATE(302), 1,
      sym_comment,
    ACTIONS(663), 3,
      aux_sym_comment_token1,
      aux_sym_comment_token2,
      anon_sym_STAR_SLASH,
  [11503] = 5,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(626), 1,
      sym_identifier,
    STATE(291), 1,
      aux_sym_sort_clause_repeat1,
    STATE(303), 1,
      sym_comment,
    STATE(320), 1,
      sym_sort_column,
  [11519] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(304), 1,
      sym_comment,
    ACTIONS(665), 3,
      sym_terminator,
      anon_sym_NO_DASHUNDO,
      anon_sym_INITIAL,
  [11531] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(647), 1,
      anon_sym_COMMA,
    ACTIONS(667), 1,
      anon_sym_RPAREN,
    STATE(305), 1,
      sym_comment,
    STATE(307), 1,
      aux_sym_function_statement_repeat1,
  [11547] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(647), 1,
      anon_sym_COMMA,
    ACTIONS(669), 1,
      anon_sym_RPAREN,
    STATE(305), 1,
      aux_sym_function_statement_repeat1,
    STATE(306), 1,
      sym_comment,
  [11563] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(671), 1,
      anon_sym_COMMA,
    ACTIONS(674), 1,
      anon_sym_RPAREN,
    STATE(307), 2,
      sym_comment,
      aux_sym_function_statement_repeat1,
  [11577] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(532), 1,
      anon_sym_RPAREN,
    ACTIONS(676), 1,
      anon_sym_COMMA,
    STATE(308), 2,
      sym_comment,
      aux_sym_function_call_repeat1,
  [11591] = 5,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(500), 1,
      anon_sym_COMMA,
    ACTIONS(679), 1,
      anon_sym_RPAREN,
    STATE(308), 1,
      aux_sym_function_call_repeat1,
    STATE(309), 1,
      sym_comment,
  [11607] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(681), 1,
      sym_identifier,
    ACTIONS(683), 1,
      anon_sym_COLON,
    STATE(310), 1,
      sym_comment,
  [11620] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(685), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(687), 1,
      anon_sym_THEN,
    STATE(311), 1,
      sym_comment,
  [11633] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(312), 1,
      sym_comment,
    ACTIONS(674), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
  [11644] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(689), 1,
      sym_identifier,
    STATE(109), 1,
      sym_function_call,
    STATE(313), 1,
      sym_comment,
  [11657] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(691), 1,
      anon_sym_VARIABLE,
    ACTIONS(693), 1,
      anon_sym_VAR,
    STATE(314), 1,
      sym_comment,
  [11670] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(695), 1,
      anon_sym_THENDO_COLON,
    ACTIONS(697), 1,
      anon_sym_THEN,
    STATE(315), 1,
      sym_comment,
  [11683] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(699), 1,
      anon_sym_COLON,
    ACTIONS(701), 1,
      anon_sym_PRIVATE,
    STATE(316), 1,
      sym_comment,
  [11696] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    STATE(317), 1,
      sym_comment,
    ACTIONS(703), 2,
      anon_sym_COMMA,
      anon_sym_RPAREN,
  [11707] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(705), 1,
      sym_identifier,
    STATE(318), 1,
      sym_comment,
    STATE(359), 1,
      sym_assignment,
  [11720] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(705), 1,
      sym_identifier,
    STATE(319), 1,
      sym_comment,
    STATE(373), 1,
      sym_assignment,
  [11733] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(707), 1,
      sym_identifier,
    ACTIONS(709), 1,
      anon_sym_COLON,
    STATE(320), 1,
      sym_comment,
  [11746] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(711), 1,
      anon_sym_COLON,
    ACTIONS(713), 1,
      anon_sym_PRIVATE,
    STATE(321), 1,
      sym_comment,
  [11759] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(187), 1,
      anon_sym_LPAREN,
    ACTIONS(715), 1,
      anon_sym_EQ,
    STATE(322), 1,
      sym_comment,
  [11772] = 4,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(717), 1,
      anon_sym_VARIABLE,
    ACTIONS(719), 1,
      anon_sym_VAR,
    STATE(323), 1,
      sym_comment,
  [11785] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(721), 1,
      sym_identifier,
    STATE(104), 1,
      sym_function_call,
    STATE(324), 1,
      sym_comment,
  [11798] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(723), 1,
      sym_identifier,
    STATE(203), 1,
      sym_function_call,
    STATE(325), 1,
      sym_comment,
  [11811] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(725), 1,
      sym_identifier,
    ACTIONS(727), 1,
      anon_sym_COLON,
    STATE(326), 1,
      sym_comment,
  [11824] = 4,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(729), 1,
      sym_identifier,
    ACTIONS(731), 1,
      sym_terminator,
    STATE(327), 1,
      sym_comment,
  [11837] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(733), 1,
      sym_identifier,
    STATE(328), 1,
      sym_comment,
  [11847] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(511), 1,
      anon_sym_COLON,
    STATE(329), 1,
      sym_comment,
  [11857] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(735), 1,
      anon_sym_THENDO_COLON,
    STATE(330), 1,
      sym_comment,
  [11867] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(737), 1,
      sym_terminator,
    STATE(331), 1,
      sym_comment,
  [11877] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(739), 1,
      sym_identifier,
    STATE(332), 1,
      sym_comment,
  [11887] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(741), 1,
      anon_sym_COLON,
    STATE(333), 1,
      sym_comment,
  [11897] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(743), 1,
      anon_sym_COLON,
    STATE(334), 1,
      sym_comment,
  [11907] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(745), 1,
      sym_identifier,
    STATE(335), 1,
      sym_comment,
  [11917] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(747), 1,
      anon_sym_COLON,
    STATE(336), 1,
      sym_comment,
  [11927] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(749), 1,
      sym_identifier,
    STATE(337), 1,
      sym_comment,
  [11937] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(751), 1,
      anon_sym_COLON,
    STATE(338), 1,
      sym_comment,
  [11947] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(753), 1,
      sym_identifier,
    STATE(339), 1,
      sym_comment,
  [11957] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(509), 1,
      anon_sym_COLON,
    STATE(340), 1,
      sym_comment,
  [11967] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(755), 1,
      sym_identifier,
    STATE(341), 1,
      sym_comment,
  [11977] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(757), 1,
      anon_sym_AS,
    STATE(342), 1,
      sym_comment,
  [11987] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(759), 1,
      sym_identifier,
    STATE(343), 1,
      sym_comment,
  [11997] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(761), 1,
      anon_sym_EQ,
    STATE(344), 1,
      sym_comment,
  [12007] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(507), 1,
      anon_sym_COLON,
    STATE(345), 1,
      sym_comment,
  [12017] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(763), 1,
      sym_number_literal,
    STATE(346), 1,
      sym_comment,
  [12027] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(765), 1,
      anon_sym_COLON,
    STATE(347), 1,
      sym_comment,
  [12037] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(767), 1,
      anon_sym_COLON,
    STATE(348), 1,
      sym_comment,
  [12047] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(769), 1,
      anon_sym_COLON,
    STATE(349), 1,
      sym_comment,
  [12057] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(771), 1,
      anon_sym_COLON,
    STATE(350), 1,
      sym_comment,
  [12067] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(773), 1,
      ts_builtin_sym_end,
    STATE(351), 1,
      sym_comment,
  [12077] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(775), 1,
      anon_sym_COLON,
    STATE(352), 1,
      sym_comment,
  [12087] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(777), 1,
      anon_sym_RETURNS,
    STATE(353), 1,
      sym_comment,
  [12097] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(779), 1,
      anon_sym_COLON,
    STATE(354), 1,
      sym_comment,
  [12107] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(781), 1,
      sym_terminator,
    STATE(355), 1,
      sym_comment,
  [12117] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(783), 1,
      anon_sym_COLON,
    STATE(356), 1,
      sym_comment,
  [12127] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(785), 1,
      sym_terminator,
    STATE(357), 1,
      sym_comment,
  [12137] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(787), 1,
      sym_terminator,
    STATE(358), 1,
      sym_comment,
  [12147] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(789), 1,
      anon_sym_TO,
    STATE(359), 1,
      sym_comment,
  [12157] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(791), 1,
      anon_sym_LPAREN,
    STATE(360), 1,
      sym_comment,
  [12167] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(793), 1,
      sym_identifier,
    STATE(361), 1,
      sym_comment,
  [12177] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(795), 1,
      sym_identifier,
    STATE(362), 1,
      sym_comment,
  [12187] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(715), 1,
      anon_sym_EQ,
    STATE(363), 1,
      sym_comment,
  [12197] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(797), 1,
      sym_identifier,
    STATE(364), 1,
      sym_comment,
  [12207] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(799), 1,
      sym_number_literal,
    STATE(365), 1,
      sym_comment,
  [12217] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(801), 1,
      sym_terminator,
    STATE(366), 1,
      sym_comment,
  [12227] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(803), 1,
      anon_sym_COLON,
    STATE(367), 1,
      sym_comment,
  [12237] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(805), 1,
      anon_sym_THENDO_COLON,
    STATE(368), 1,
      sym_comment,
  [12247] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(807), 1,
      sym_terminator,
    STATE(369), 1,
      sym_comment,
  [12257] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(809), 1,
      anon_sym_COLON,
    STATE(370), 1,
      sym_comment,
  [12267] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(811), 1,
      anon_sym_AS,
    STATE(371), 1,
      sym_comment,
  [12277] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(813), 1,
      anon_sym_COLON,
    STATE(372), 1,
      sym_comment,
  [12287] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(815), 1,
      anon_sym_TO,
    STATE(373), 1,
      sym_comment,
  [12297] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(817), 1,
      anon_sym_AS,
    STATE(374), 1,
      sym_comment,
  [12307] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(819), 1,
      anon_sym_LPAREN,
    STATE(375), 1,
      sym_comment,
  [12317] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(821), 1,
      anon_sym_RETURNS,
    STATE(376), 1,
      sym_comment,
  [12327] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(521), 1,
      anon_sym_COLON,
    STATE(377), 1,
      sym_comment,
  [12337] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(823), 1,
      sym_identifier,
    STATE(378), 1,
      sym_comment,
  [12347] = 3,
    ACTIONS(3), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(825), 1,
      sym_identifier,
    STATE(379), 1,
      sym_comment,
  [12357] = 3,
    ACTIONS(135), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(827), 1,
      anon_sym_BY,
    STATE(380), 1,
      sym_comment,
  [12367] = 1,
    ACTIONS(829), 1,
      ts_builtin_sym_end,
  [12371] = 1,
    ACTIONS(831), 1,
      ts_builtin_sym_end,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 85,
  [SMALL_STATE(4)] = 170,
  [SMALL_STATE(5)] = 255,
  [SMALL_STATE(6)] = 340,
  [SMALL_STATE(7)] = 425,
  [SMALL_STATE(8)] = 510,
  [SMALL_STATE(9)] = 595,
  [SMALL_STATE(10)] = 680,
  [SMALL_STATE(11)] = 765,
  [SMALL_STATE(12)] = 850,
  [SMALL_STATE(13)] = 935,
  [SMALL_STATE(14)] = 1020,
  [SMALL_STATE(15)] = 1105,
  [SMALL_STATE(16)] = 1190,
  [SMALL_STATE(17)] = 1275,
  [SMALL_STATE(18)] = 1360,
  [SMALL_STATE(19)] = 1445,
  [SMALL_STATE(20)] = 1530,
  [SMALL_STATE(21)] = 1615,
  [SMALL_STATE(22)] = 1700,
  [SMALL_STATE(23)] = 1785,
  [SMALL_STATE(24)] = 1870,
  [SMALL_STATE(25)] = 1955,
  [SMALL_STATE(26)] = 2040,
  [SMALL_STATE(27)] = 2125,
  [SMALL_STATE(28)] = 2210,
  [SMALL_STATE(29)] = 2295,
  [SMALL_STATE(30)] = 2380,
  [SMALL_STATE(31)] = 2465,
  [SMALL_STATE(32)] = 2550,
  [SMALL_STATE(33)] = 2635,
  [SMALL_STATE(34)] = 2720,
  [SMALL_STATE(35)] = 2805,
  [SMALL_STATE(36)] = 2890,
  [SMALL_STATE(37)] = 2975,
  [SMALL_STATE(38)] = 3060,
  [SMALL_STATE(39)] = 3145,
  [SMALL_STATE(40)] = 3230,
  [SMALL_STATE(41)] = 3315,
  [SMALL_STATE(42)] = 3400,
  [SMALL_STATE(43)] = 3485,
  [SMALL_STATE(44)] = 3570,
  [SMALL_STATE(45)] = 3655,
  [SMALL_STATE(46)] = 3740,
  [SMALL_STATE(47)] = 3825,
  [SMALL_STATE(48)] = 3910,
  [SMALL_STATE(49)] = 3995,
  [SMALL_STATE(50)] = 4080,
  [SMALL_STATE(51)] = 4165,
  [SMALL_STATE(52)] = 4250,
  [SMALL_STATE(53)] = 4335,
  [SMALL_STATE(54)] = 4420,
  [SMALL_STATE(55)] = 4505,
  [SMALL_STATE(56)] = 4590,
  [SMALL_STATE(57)] = 4675,
  [SMALL_STATE(58)] = 4760,
  [SMALL_STATE(59)] = 4845,
  [SMALL_STATE(60)] = 4930,
  [SMALL_STATE(61)] = 5015,
  [SMALL_STATE(62)] = 5100,
  [SMALL_STATE(63)] = 5180,
  [SMALL_STATE(64)] = 5258,
  [SMALL_STATE(65)] = 5338,
  [SMALL_STATE(66)] = 5373,
  [SMALL_STATE(67)] = 5408,
  [SMALL_STATE(68)] = 5443,
  [SMALL_STATE(69)] = 5477,
  [SMALL_STATE(70)] = 5511,
  [SMALL_STATE(71)] = 5545,
  [SMALL_STATE(72)] = 5579,
  [SMALL_STATE(73)] = 5613,
  [SMALL_STATE(74)] = 5647,
  [SMALL_STATE(75)] = 5684,
  [SMALL_STATE(76)] = 5721,
  [SMALL_STATE(77)] = 5756,
  [SMALL_STATE(78)] = 5793,
  [SMALL_STATE(79)] = 5830,
  [SMALL_STATE(80)] = 5866,
  [SMALL_STATE(81)] = 5897,
  [SMALL_STATE(82)] = 5934,
  [SMALL_STATE(83)] = 5969,
  [SMALL_STATE(84)] = 6006,
  [SMALL_STATE(85)] = 6037,
  [SMALL_STATE(86)] = 6074,
  [SMALL_STATE(87)] = 6107,
  [SMALL_STATE(88)] = 6142,
  [SMALL_STATE(89)] = 6179,
  [SMALL_STATE(90)] = 6205,
  [SMALL_STATE(91)] = 6233,
  [SMALL_STATE(92)] = 6269,
  [SMALL_STATE(93)] = 6295,
  [SMALL_STATE(94)] = 6323,
  [SMALL_STATE(95)] = 6349,
  [SMALL_STATE(96)] = 6383,
  [SMALL_STATE(97)] = 6413,
  [SMALL_STATE(98)] = 6443,
  [SMALL_STATE(99)] = 6471,
  [SMALL_STATE(100)] = 6497,
  [SMALL_STATE(101)] = 6523,
  [SMALL_STATE(102)] = 6555,
  [SMALL_STATE(103)] = 6581,
  [SMALL_STATE(104)] = 6611,
  [SMALL_STATE(105)] = 6639,
  [SMALL_STATE(106)] = 6670,
  [SMALL_STATE(107)] = 6695,
  [SMALL_STATE(108)] = 6724,
  [SMALL_STATE(109)] = 6749,
  [SMALL_STATE(110)] = 6776,
  [SMALL_STATE(111)] = 6805,
  [SMALL_STATE(112)] = 6834,
  [SMALL_STATE(113)] = 6863,
  [SMALL_STATE(114)] = 6888,
  [SMALL_STATE(115)] = 6913,
  [SMALL_STATE(116)] = 6942,
  [SMALL_STATE(117)] = 6967,
  [SMALL_STATE(118)] = 6998,
  [SMALL_STATE(119)] = 7024,
  [SMALL_STATE(120)] = 7048,
  [SMALL_STATE(121)] = 7092,
  [SMALL_STATE(122)] = 7118,
  [SMALL_STATE(123)] = 7144,
  [SMALL_STATE(124)] = 7168,
  [SMALL_STATE(125)] = 7194,
  [SMALL_STATE(126)] = 7218,
  [SMALL_STATE(127)] = 7242,
  [SMALL_STATE(128)] = 7266,
  [SMALL_STATE(129)] = 7290,
  [SMALL_STATE(130)] = 7314,
  [SMALL_STATE(131)] = 7338,
  [SMALL_STATE(132)] = 7362,
  [SMALL_STATE(133)] = 7386,
  [SMALL_STATE(134)] = 7410,
  [SMALL_STATE(135)] = 7434,
  [SMALL_STATE(136)] = 7458,
  [SMALL_STATE(137)] = 7482,
  [SMALL_STATE(138)] = 7506,
  [SMALL_STATE(139)] = 7530,
  [SMALL_STATE(140)] = 7554,
  [SMALL_STATE(141)] = 7578,
  [SMALL_STATE(142)] = 7602,
  [SMALL_STATE(143)] = 7626,
  [SMALL_STATE(144)] = 7650,
  [SMALL_STATE(145)] = 7674,
  [SMALL_STATE(146)] = 7698,
  [SMALL_STATE(147)] = 7724,
  [SMALL_STATE(148)] = 7748,
  [SMALL_STATE(149)] = 7772,
  [SMALL_STATE(150)] = 7796,
  [SMALL_STATE(151)] = 7826,
  [SMALL_STATE(152)] = 7870,
  [SMALL_STATE(153)] = 7894,
  [SMALL_STATE(154)] = 7918,
  [SMALL_STATE(155)] = 7944,
  [SMALL_STATE(156)] = 7968,
  [SMALL_STATE(157)] = 7992,
  [SMALL_STATE(158)] = 8016,
  [SMALL_STATE(159)] = 8041,
  [SMALL_STATE(160)] = 8078,
  [SMALL_STATE(161)] = 8103,
  [SMALL_STATE(162)] = 8128,
  [SMALL_STATE(163)] = 8153,
  [SMALL_STATE(164)] = 8178,
  [SMALL_STATE(165)] = 8209,
  [SMALL_STATE(166)] = 8233,
  [SMALL_STATE(167)] = 8257,
  [SMALL_STATE(168)] = 8281,
  [SMALL_STATE(169)] = 8305,
  [SMALL_STATE(170)] = 8333,
  [SMALL_STATE(171)] = 8357,
  [SMALL_STATE(172)] = 8381,
  [SMALL_STATE(173)] = 8405,
  [SMALL_STATE(174)] = 8431,
  [SMALL_STATE(175)] = 8455,
  [SMALL_STATE(176)] = 8479,
  [SMALL_STATE(177)] = 8503,
  [SMALL_STATE(178)] = 8527,
  [SMALL_STATE(179)] = 8551,
  [SMALL_STATE(180)] = 8575,
  [SMALL_STATE(181)] = 8599,
  [SMALL_STATE(182)] = 8623,
  [SMALL_STATE(183)] = 8647,
  [SMALL_STATE(184)] = 8685,
  [SMALL_STATE(185)] = 8709,
  [SMALL_STATE(186)] = 8733,
  [SMALL_STATE(187)] = 8757,
  [SMALL_STATE(188)] = 8781,
  [SMALL_STATE(189)] = 8805,
  [SMALL_STATE(190)] = 8829,
  [SMALL_STATE(191)] = 8853,
  [SMALL_STATE(192)] = 8877,
  [SMALL_STATE(193)] = 8901,
  [SMALL_STATE(194)] = 8925,
  [SMALL_STATE(195)] = 8949,
  [SMALL_STATE(196)] = 8975,
  [SMALL_STATE(197)] = 8999,
  [SMALL_STATE(198)] = 9023,
  [SMALL_STATE(199)] = 9059,
  [SMALL_STATE(200)] = 9083,
  [SMALL_STATE(201)] = 9121,
  [SMALL_STATE(202)] = 9145,
  [SMALL_STATE(203)] = 9180,
  [SMALL_STATE(204)] = 9203,
  [SMALL_STATE(205)] = 9238,
  [SMALL_STATE(206)] = 9273,
  [SMALL_STATE(207)] = 9296,
  [SMALL_STATE(208)] = 9333,
  [SMALL_STATE(209)] = 9368,
  [SMALL_STATE(210)] = 9395,
  [SMALL_STATE(211)] = 9430,
  [SMALL_STATE(212)] = 9453,
  [SMALL_STATE(213)] = 9486,
  [SMALL_STATE(214)] = 9521,
  [SMALL_STATE(215)] = 9556,
  [SMALL_STATE(216)] = 9579,
  [SMALL_STATE(217)] = 9606,
  [SMALL_STATE(218)] = 9641,
  [SMALL_STATE(219)] = 9676,
  [SMALL_STATE(220)] = 9713,
  [SMALL_STATE(221)] = 9748,
  [SMALL_STATE(222)] = 9770,
  [SMALL_STATE(223)] = 9792,
  [SMALL_STATE(224)] = 9814,
  [SMALL_STATE(225)] = 9836,
  [SMALL_STATE(226)] = 9868,
  [SMALL_STATE(227)] = 9900,
  [SMALL_STATE(228)] = 9932,
  [SMALL_STATE(229)] = 9964,
  [SMALL_STATE(230)] = 9986,
  [SMALL_STATE(231)] = 10014,
  [SMALL_STATE(232)] = 10046,
  [SMALL_STATE(233)] = 10078,
  [SMALL_STATE(234)] = 10110,
  [SMALL_STATE(235)] = 10142,
  [SMALL_STATE(236)] = 10164,
  [SMALL_STATE(237)] = 10193,
  [SMALL_STATE(238)] = 10214,
  [SMALL_STATE(239)] = 10245,
  [SMALL_STATE(240)] = 10276,
  [SMALL_STATE(241)] = 10307,
  [SMALL_STATE(242)] = 10336,
  [SMALL_STATE(243)] = 10367,
  [SMALL_STATE(244)] = 10398,
  [SMALL_STATE(245)] = 10423,
  [SMALL_STATE(246)] = 10452,
  [SMALL_STATE(247)] = 10475,
  [SMALL_STATE(248)] = 10506,
  [SMALL_STATE(249)] = 10530,
  [SMALL_STATE(250)] = 10558,
  [SMALL_STATE(251)] = 10586,
  [SMALL_STATE(252)] = 10614,
  [SMALL_STATE(253)] = 10642,
  [SMALL_STATE(254)] = 10664,
  [SMALL_STATE(255)] = 10688,
  [SMALL_STATE(256)] = 10712,
  [SMALL_STATE(257)] = 10728,
  [SMALL_STATE(258)] = 10744,
  [SMALL_STATE(259)] = 10760,
  [SMALL_STATE(260)] = 10775,
  [SMALL_STATE(261)] = 10795,
  [SMALL_STATE(262)] = 10815,
  [SMALL_STATE(263)] = 10835,
  [SMALL_STATE(264)] = 10855,
  [SMALL_STATE(265)] = 10875,
  [SMALL_STATE(266)] = 10893,
  [SMALL_STATE(267)] = 10911,
  [SMALL_STATE(268)] = 10931,
  [SMALL_STATE(269)] = 10951,
  [SMALL_STATE(270)] = 10970,
  [SMALL_STATE(271)] = 10985,
  [SMALL_STATE(272)] = 11004,
  [SMALL_STATE(273)] = 11021,
  [SMALL_STATE(274)] = 11040,
  [SMALL_STATE(275)] = 11055,
  [SMALL_STATE(276)] = 11072,
  [SMALL_STATE(277)] = 11089,
  [SMALL_STATE(278)] = 11106,
  [SMALL_STATE(279)] = 11123,
  [SMALL_STATE(280)] = 11140,
  [SMALL_STATE(281)] = 11157,
  [SMALL_STATE(282)] = 11174,
  [SMALL_STATE(283)] = 11191,
  [SMALL_STATE(284)] = 11210,
  [SMALL_STATE(285)] = 11227,
  [SMALL_STATE(286)] = 11242,
  [SMALL_STATE(287)] = 11261,
  [SMALL_STATE(288)] = 11276,
  [SMALL_STATE(289)] = 11293,
  [SMALL_STATE(290)] = 11310,
  [SMALL_STATE(291)] = 11327,
  [SMALL_STATE(292)] = 11346,
  [SMALL_STATE(293)] = 11363,
  [SMALL_STATE(294)] = 11375,
  [SMALL_STATE(295)] = 11391,
  [SMALL_STATE(296)] = 11407,
  [SMALL_STATE(297)] = 11423,
  [SMALL_STATE(298)] = 11435,
  [SMALL_STATE(299)] = 11451,
  [SMALL_STATE(300)] = 11463,
  [SMALL_STATE(301)] = 11479,
  [SMALL_STATE(302)] = 11491,
  [SMALL_STATE(303)] = 11503,
  [SMALL_STATE(304)] = 11519,
  [SMALL_STATE(305)] = 11531,
  [SMALL_STATE(306)] = 11547,
  [SMALL_STATE(307)] = 11563,
  [SMALL_STATE(308)] = 11577,
  [SMALL_STATE(309)] = 11591,
  [SMALL_STATE(310)] = 11607,
  [SMALL_STATE(311)] = 11620,
  [SMALL_STATE(312)] = 11633,
  [SMALL_STATE(313)] = 11644,
  [SMALL_STATE(314)] = 11657,
  [SMALL_STATE(315)] = 11670,
  [SMALL_STATE(316)] = 11683,
  [SMALL_STATE(317)] = 11696,
  [SMALL_STATE(318)] = 11707,
  [SMALL_STATE(319)] = 11720,
  [SMALL_STATE(320)] = 11733,
  [SMALL_STATE(321)] = 11746,
  [SMALL_STATE(322)] = 11759,
  [SMALL_STATE(323)] = 11772,
  [SMALL_STATE(324)] = 11785,
  [SMALL_STATE(325)] = 11798,
  [SMALL_STATE(326)] = 11811,
  [SMALL_STATE(327)] = 11824,
  [SMALL_STATE(328)] = 11837,
  [SMALL_STATE(329)] = 11847,
  [SMALL_STATE(330)] = 11857,
  [SMALL_STATE(331)] = 11867,
  [SMALL_STATE(332)] = 11877,
  [SMALL_STATE(333)] = 11887,
  [SMALL_STATE(334)] = 11897,
  [SMALL_STATE(335)] = 11907,
  [SMALL_STATE(336)] = 11917,
  [SMALL_STATE(337)] = 11927,
  [SMALL_STATE(338)] = 11937,
  [SMALL_STATE(339)] = 11947,
  [SMALL_STATE(340)] = 11957,
  [SMALL_STATE(341)] = 11967,
  [SMALL_STATE(342)] = 11977,
  [SMALL_STATE(343)] = 11987,
  [SMALL_STATE(344)] = 11997,
  [SMALL_STATE(345)] = 12007,
  [SMALL_STATE(346)] = 12017,
  [SMALL_STATE(347)] = 12027,
  [SMALL_STATE(348)] = 12037,
  [SMALL_STATE(349)] = 12047,
  [SMALL_STATE(350)] = 12057,
  [SMALL_STATE(351)] = 12067,
  [SMALL_STATE(352)] = 12077,
  [SMALL_STATE(353)] = 12087,
  [SMALL_STATE(354)] = 12097,
  [SMALL_STATE(355)] = 12107,
  [SMALL_STATE(356)] = 12117,
  [SMALL_STATE(357)] = 12127,
  [SMALL_STATE(358)] = 12137,
  [SMALL_STATE(359)] = 12147,
  [SMALL_STATE(360)] = 12157,
  [SMALL_STATE(361)] = 12167,
  [SMALL_STATE(362)] = 12177,
  [SMALL_STATE(363)] = 12187,
  [SMALL_STATE(364)] = 12197,
  [SMALL_STATE(365)] = 12207,
  [SMALL_STATE(366)] = 12217,
  [SMALL_STATE(367)] = 12227,
  [SMALL_STATE(368)] = 12237,
  [SMALL_STATE(369)] = 12247,
  [SMALL_STATE(370)] = 12257,
  [SMALL_STATE(371)] = 12267,
  [SMALL_STATE(372)] = 12277,
  [SMALL_STATE(373)] = 12287,
  [SMALL_STATE(374)] = 12297,
  [SMALL_STATE(375)] = 12307,
  [SMALL_STATE(376)] = 12317,
  [SMALL_STATE(377)] = 12327,
  [SMALL_STATE(378)] = 12337,
  [SMALL_STATE(379)] = 12347,
  [SMALL_STATE(380)] = 12357,
  [SMALL_STATE(381)] = 12367,
  [SMALL_STATE(382)] = 12371,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = false}}, SHIFT(276),
  [5] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 0),
  [7] = {.entry = {.count = 1, .reusable = false}}, SHIFT(151),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(314),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(217),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(6),
  [15] = {.entry = {.count = 1, .reusable = false}}, SHIFT(218),
  [17] = {.entry = {.count = 1, .reusable = false}}, SHIFT(318),
  [19] = {.entry = {.count = 1, .reusable = false}}, SHIFT(299),
  [21] = {.entry = {.count = 1, .reusable = false}}, SHIFT(343),
  [23] = {.entry = {.count = 1, .reusable = false}}, SHIFT(337),
  [25] = {.entry = {.count = 1, .reusable = false}}, SHIFT(335),
  [27] = {.entry = {.count = 1, .reusable = false}}, SHIFT(269),
  [29] = {.entry = {.count = 1, .reusable = false}}, SHIFT(120),
  [31] = {.entry = {.count = 1, .reusable = false}}, SHIFT(182),
  [33] = {.entry = {.count = 1, .reusable = false}}, SHIFT(323),
  [35] = {.entry = {.count = 1, .reusable = false}}, SHIFT(210),
  [37] = {.entry = {.count = 1, .reusable = false}}, SHIFT(14),
  [39] = {.entry = {.count = 1, .reusable = false}}, SHIFT(214),
  [41] = {.entry = {.count = 1, .reusable = false}}, SHIFT(319),
  [43] = {.entry = {.count = 1, .reusable = false}}, SHIFT(301),
  [45] = {.entry = {.count = 1, .reusable = false}}, SHIFT(361),
  [47] = {.entry = {.count = 1, .reusable = false}}, SHIFT(332),
  [49] = {.entry = {.count = 1, .reusable = false}}, SHIFT(362),
  [51] = {.entry = {.count = 1, .reusable = false}}, SHIFT(271),
  [53] = {.entry = {.count = 1, .reusable = false}}, SHIFT(127),
  [55] = {.entry = {.count = 1, .reusable = false}}, SHIFT(122),
  [57] = {.entry = {.count = 1, .reusable = false}}, SHIFT(92),
  [59] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(120),
  [62] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2),
  [64] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(323),
  [67] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(210),
  [70] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(14),
  [73] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(214),
  [76] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(319),
  [79] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(301),
  [82] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(361),
  [85] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(332),
  [88] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(362),
  [91] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(271),
  [94] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 2),
  [96] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(151),
  [99] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(314),
  [102] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(217),
  [105] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(6),
  [108] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(218),
  [111] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(318),
  [114] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(299),
  [117] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(343),
  [120] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(337),
  [123] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(335),
  [126] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 2), SHIFT_REPEAT(269),
  [129] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source_code, 1),
  [131] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 5, .production_id = 2),
  [133] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 5, .production_id = 2),
  [135] = {.entry = {.count = 1, .reusable = true}}, SHIFT(276),
  [137] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 3, .production_id = 2),
  [139] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 3, .production_id = 2),
  [141] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call, 4, .production_id = 2),
  [143] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call, 4, .production_id = 2),
  [145] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_string_literal, 1),
  [147] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_string_literal, 1),
  [149] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 3),
  [151] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 3),
  [153] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_single_quoted_string, 2),
  [155] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_single_quoted_string, 2),
  [157] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 2),
  [159] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 2),
  [161] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression, 1),
  [163] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression, 1),
  [165] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_double_quoted_string, 3),
  [167] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_double_quoted_string, 3),
  [169] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 6, .production_id = 3),
  [171] = {.entry = {.count = 1, .reusable = false}}, SHIFT(9),
  [173] = {.entry = {.count = 1, .reusable = false}}, SHIFT(205),
  [175] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 5, .production_id = 3),
  [177] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2),
  [179] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(9),
  [182] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(205),
  [185] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_do_statement, 4, .production_id = 3),
  [187] = {.entry = {.count = 1, .reusable = true}}, SHIFT(213),
  [189] = {.entry = {.count = 1, .reusable = true}}, SHIFT(324),
  [191] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_object_property_repeat1, 2),
  [193] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_object_property_repeat1, 2),
  [195] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_object_property_repeat1, 2), SHIFT_REPEAT(324),
  [198] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 6, .production_id = 3),
  [200] = {.entry = {.count = 1, .reusable = false}}, SHIFT(4),
  [202] = {.entry = {.count = 1, .reusable = false}}, SHIFT(204),
  [204] = {.entry = {.count = 1, .reusable = false}}, SHIFT(313),
  [206] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 4, .production_id = 3),
  [208] = {.entry = {.count = 1, .reusable = true}}, SHIFT(220),
  [210] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_do_statement, 5, .production_id = 3),
  [212] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_object_property, 2),
  [214] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_object_property, 2),
  [216] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 2),
  [218] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(4),
  [221] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 2), SHIFT_REPEAT(204),
  [224] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_statement, 2),
  [226] = {.entry = {.count = 1, .reusable = false}}, SHIFT(270),
  [228] = {.entry = {.count = 1, .reusable = true}}, SHIFT(270),
  [230] = {.entry = {.count = 1, .reusable = true}}, SHIFT(228),
  [232] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_conditions, 1),
  [234] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_block_terminator, 1),
  [236] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_if_do_statement_repeat1, 1),
  [238] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comparison, 3),
  [240] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comparison, 3),
  [242] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_object_property_repeat1, 2), SHIFT_REPEAT(313),
  [245] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_statement, 3),
  [247] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 4, .production_id = 3),
  [249] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 3),
  [251] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 4, .production_id = 3),
  [253] = {.entry = {.count = 1, .reusable = false}}, SHIFT(252),
  [255] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_definition, 6, .production_id = 6),
  [257] = {.entry = {.count = 1, .reusable = true}}, SHIFT(259),
  [259] = {.entry = {.count = 1, .reusable = false}}, SHIFT(259),
  [261] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_definition, 7, .production_id = 6),
  [263] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_assignment, 2),
  [265] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_call_statement, 2),
  [267] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_terminated_statement, 1),
  [269] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_conditions_repeat1, 2),
  [271] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 4, .production_id = 3),
  [273] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 8, .production_id = 4),
  [275] = {.entry = {.count = 1, .reusable = true}}, SHIFT(164),
  [277] = {.entry = {.count = 1, .reusable = false}}, SHIFT(132),
  [279] = {.entry = {.count = 1, .reusable = false}}, SHIFT(225),
  [281] = {.entry = {.count = 1, .reusable = false}}, SHIFT(229),
  [283] = {.entry = {.count = 1, .reusable = false}}, SHIFT(290),
  [285] = {.entry = {.count = 1, .reusable = false}}, SHIFT(289),
  [287] = {.entry = {.count = 1, .reusable = false}}, SHIFT(213),
  [289] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_if_do_statement_repeat1, 1),
  [291] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_block_terminator, 1),
  [293] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_statement, 11, .production_id = 7),
  [295] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_if_statement, 5, .production_id = 3),
  [297] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 2),
  [299] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_repeat_statement, 2),
  [301] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_repeat_statement, 3),
  [303] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_then_statement, 5, .production_id = 3),
  [305] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_abl_statement, 3, .production_id = 1),
  [307] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_return_statement, 3),
  [309] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_abl_statement, 2, .production_id = 1),
  [311] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_abl_statement, 1),
  [313] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_loop_statement, 1),
  [315] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_statement, 10, .production_id = 7),
  [317] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_if_statement, 1),
  [319] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_statement, 1),
  [321] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_statement, 9, .production_id = 7),
  [323] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 9, .production_id = 4),
  [325] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_function_statement, 8, .production_id = 7),
  [327] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_do_while_statement, 5),
  [329] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_source_code_repeat1, 1),
  [331] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [333] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_do_statement, 7),
  [335] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_procedure_statement, 6),
  [337] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_statement, 3),
  [339] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [341] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assign_statement, 3),
  [343] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [345] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 4, .production_id = 3),
  [347] = {.entry = {.count = 1, .reusable = false}}, SHIFT(251),
  [349] = {.entry = {.count = 1, .reusable = false}}, SHIFT(184),
  [351] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_do_statement, 6),
  [353] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_else_then_statement, 2),
  [355] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_do_statement, 2),
  [357] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_procedure_statement, 5),
  [359] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_do_while_statement, 4),
  [361] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_procedure_statement, 4),
  [363] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_terminated_statement, 1),
  [365] = {.entry = {.count = 1, .reusable = false}}, SHIFT(79),
  [367] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_variable_tuning, 1),
  [369] = {.entry = {.count = 1, .reusable = false}}, SHIFT(72),
  [371] = {.entry = {.count = 1, .reusable = false}}, SHIFT(280),
  [373] = {.entry = {.count = 1, .reusable = false}}, SHIFT(282),
  [375] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_call_statement, 2),
  [377] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_definition, 6, .production_id = 6),
  [379] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_definition, 7, .production_id = 6),
  [381] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_assignment, 2),
  [383] = {.entry = {.count = 1, .reusable = false}}, SHIFT(202),
  [385] = {.entry = {.count = 1, .reusable = false}}, SHIFT(325),
  [387] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_else_then_statement, 2),
  [389] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 6, .production_id = 4),
  [391] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_statement, 9, .production_id = 7),
  [393] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_do_statement, 6),
  [395] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_procedure_statement, 6),
  [397] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_do_while_statement, 4),
  [399] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_repeat_statement, 3),
  [401] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 2),
  [403] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_statement, 10, .production_id = 7),
  [405] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_repeat_statement, 2),
  [407] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assign_statement, 3),
  [409] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_procedure_statement, 5),
  [411] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_statement, 11, .production_id = 7),
  [413] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_do_statement, 7),
  [415] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 7, .production_id = 4),
  [417] = {.entry = {.count = 1, .reusable = false}}, SHIFT(197),
  [419] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_abl_statement, 2, .production_id = 1),
  [421] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 5, .production_id = 4),
  [423] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_do_while_statement, 5),
  [425] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_return_statement, 3),
  [427] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_then_statement, 5, .production_id = 3),
  [429] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_abl_statement, 1),
  [431] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_loop_statement, 1),
  [433] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 8, .production_id = 4),
  [435] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_if_statement, 1),
  [437] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_statement, 8, .production_id = 7),
  [439] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_statement, 1),
  [441] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_object_property_repeat1, 2), SHIFT_REPEAT(325),
  [444] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_code_repeat1, 1),
  [446] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_abl_statement, 3, .production_id = 1),
  [448] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(164),
  [451] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_abl_statement_repeat1, 2),
  [453] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(229),
  [456] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(290),
  [459] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_abl_statement_repeat1, 2), SHIFT_REPEAT(289),
  [462] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_procedure_statement, 4),
  [464] = {.entry = {.count = 1, .reusable = false}}, SHIFT(130),
  [466] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_for_statement, 9, .production_id = 4),
  [468] = {.entry = {.count = 1, .reusable = true}}, SHIFT(79),
  [470] = {.entry = {.count = 1, .reusable = false}}, SHIFT(215),
  [472] = {.entry = {.count = 1, .reusable = true}}, SHIFT(56),
  [474] = {.entry = {.count = 1, .reusable = true}}, SHIFT(208),
  [476] = {.entry = {.count = 1, .reusable = true}}, SHIFT(380),
  [478] = {.entry = {.count = 1, .reusable = true}}, SHIFT(296),
  [480] = {.entry = {.count = 1, .reusable = true}}, SHIFT(257),
  [482] = {.entry = {.count = 1, .reusable = true}}, SHIFT(82),
  [484] = {.entry = {.count = 1, .reusable = true}}, SHIFT(233),
  [486] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_conditions, 1),
  [488] = {.entry = {.count = 1, .reusable = false}}, SHIFT(66),
  [490] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_abl_statement_repeat1, 1),
  [492] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_abl_statement_repeat1, 1),
  [494] = {.entry = {.count = 1, .reusable = true}}, SHIFT(18),
  [496] = {.entry = {.count = 1, .reusable = false}}, SHIFT(98),
  [498] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_conditions_repeat1, 2),
  [500] = {.entry = {.count = 1, .reusable = true}}, SHIFT(231),
  [502] = {.entry = {.count = 1, .reusable = true}}, SHIFT(67),
  [504] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_conditions_repeat1, 2), SHIFT_REPEAT(228),
  [507] = {.entry = {.count = 1, .reusable = true}}, SHIFT(38),
  [509] = {.entry = {.count = 1, .reusable = true}}, SHIFT(47),
  [511] = {.entry = {.count = 1, .reusable = true}}, SHIFT(17),
  [513] = {.entry = {.count = 1, .reusable = true}}, SHIFT(90),
  [515] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_variable_tuning, 2),
  [517] = {.entry = {.count = 1, .reusable = true}}, SHIFT(211),
  [519] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_conditions, 2),
  [521] = {.entry = {.count = 1, .reusable = true}}, SHIFT(32),
  [523] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_assignment, 3),
  [525] = {.entry = {.count = 1, .reusable = false}}, SHIFT(322),
  [527] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_for_statement_repeat1, 2),
  [529] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_for_statement_repeat1, 2), SHIFT_REPEAT(257),
  [532] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2),
  [534] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_assignment, 3),
  [536] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_for_statement_repeat1, 1),
  [538] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_query_tuning, 1),
  [540] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_where_clause, 2, .production_id = 3),
  [542] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_primitive_type, 1),
  [544] = {.entry = {.count = 1, .reusable = true}}, SHIFT(108),
  [546] = {.entry = {.count = 1, .reusable = true}}, SHIFT(159),
  [548] = {.entry = {.count = 1, .reusable = true}}, SHIFT(162),
  [550] = {.entry = {.count = 1, .reusable = true}}, SHIFT(350),
  [552] = {.entry = {.count = 1, .reusable = true}}, SHIFT(339),
  [554] = {.entry = {.count = 1, .reusable = true}}, SHIFT(106),
  [556] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_conditions, 2),
  [558] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_conditions_repeat1, 2), SHIFT_REPEAT(233),
  [561] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_variable_definition_repeat1, 2),
  [563] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_variable_definition_repeat1, 2), SHIFT_REPEAT(159),
  [566] = {.entry = {.count = 1, .reusable = true}}, SHIFT(161),
  [568] = {.entry = {.count = 1, .reusable = true}}, SHIFT(333),
  [570] = {.entry = {.count = 1, .reusable = true}}, SHIFT(344),
  [572] = {.entry = {.count = 1, .reusable = false}}, SHIFT(174),
  [574] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comparator, 1),
  [576] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_comparator, 1),
  [578] = {.entry = {.count = 1, .reusable = false}}, SHIFT(125),
  [580] = {.entry = {.count = 1, .reusable = false}}, SHIFT(297),
  [582] = {.entry = {.count = 1, .reusable = false}}, SHIFT(69),
  [584] = {.entry = {.count = 1, .reusable = false}}, SHIFT(177),
  [586] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2), SHIFT_REPEAT(302),
  [589] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2),
  [591] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_sort_clause_repeat1, 2), SHIFT_REPEAT(292),
  [594] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_sort_clause_repeat1, 2),
  [596] = {.entry = {.count = 1, .reusable = false}}, SHIFT(302),
  [598] = {.entry = {.count = 1, .reusable = false}}, SHIFT(381),
  [600] = {.entry = {.count = 1, .reusable = false}}, SHIFT(293),
  [602] = {.entry = {.count = 1, .reusable = false}}, SHIFT(73),
  [604] = {.entry = {.count = 1, .reusable = false}}, SHIFT(224),
  [606] = {.entry = {.count = 1, .reusable = false}}, SHIFT(222),
  [608] = {.entry = {.count = 1, .reusable = false}}, SHIFT(71),
  [610] = {.entry = {.count = 1, .reusable = false}}, SHIFT(382),
  [612] = {.entry = {.count = 1, .reusable = false}}, SHIFT(70),
  [614] = {.entry = {.count = 1, .reusable = false}}, SHIFT(148),
  [616] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 2), SHIFT_REPEAT(344),
  [619] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_assign_statement_repeat1, 2),
  [621] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2), SHIFT_REPEAT(293),
  [624] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 2),
  [626] = {.entry = {.count = 1, .reusable = true}}, SHIFT(292),
  [628] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_sort_clause, 2),
  [630] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2), SHIFT_REPEAT(297),
  [633] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 2),
  [635] = {.entry = {.count = 1, .reusable = false}}, SHIFT(235),
  [637] = {.entry = {.count = 1, .reusable = false}}, SHIFT(221),
  [639] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_sort_clause, 3),
  [641] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_sort_column, 1, .production_id = 5),
  [643] = {.entry = {.count = 1, .reusable = false}}, SHIFT(326),
  [645] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_double_quoted_string_repeat1, 1),
  [647] = {.entry = {.count = 1, .reusable = true}}, SHIFT(288),
  [649] = {.entry = {.count = 1, .reusable = true}}, SHIFT(356),
  [651] = {.entry = {.count = 1, .reusable = true}}, SHIFT(206),
  [653] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_single_quoted_string_repeat1, 1),
  [655] = {.entry = {.count = 1, .reusable = true}}, SHIFT(367),
  [657] = {.entry = {.count = 1, .reusable = true}}, SHIFT(328),
  [659] = {.entry = {.count = 1, .reusable = true}}, SHIFT(65),
  [661] = {.entry = {.count = 1, .reusable = true}}, SHIFT(364),
  [663] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 1),
  [665] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_variable_definition_repeat1, 1),
  [667] = {.entry = {.count = 1, .reusable = true}}, SHIFT(354),
  [669] = {.entry = {.count = 1, .reusable = true}}, SHIFT(352),
  [671] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_function_statement_repeat1, 2), SHIFT_REPEAT(288),
  [674] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_function_statement_repeat1, 2),
  [676] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_function_call_repeat1, 2), SHIFT_REPEAT(231),
  [679] = {.entry = {.count = 1, .reusable = true}}, SHIFT(93),
  [681] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_sort_column, 2, .production_id = 5),
  [683] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_sort_column, 2, .production_id = 5),
  [685] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [687] = {.entry = {.count = 1, .reusable = false}}, SHIFT(250),
  [689] = {.entry = {.count = 1, .reusable = true}}, SHIFT(97),
  [691] = {.entry = {.count = 1, .reusable = true}}, SHIFT(379),
  [693] = {.entry = {.count = 1, .reusable = false}}, SHIFT(379),
  [695] = {.entry = {.count = 1, .reusable = true}}, SHIFT(22),
  [697] = {.entry = {.count = 1, .reusable = false}}, SHIFT(249),
  [699] = {.entry = {.count = 1, .reusable = true}}, SHIFT(59),
  [701] = {.entry = {.count = 1, .reusable = true}}, SHIFT(347),
  [703] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_parameter, 4),
  [705] = {.entry = {.count = 1, .reusable = true}}, SHIFT(363),
  [707] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_sort_clause_repeat1, 1),
  [709] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_sort_clause_repeat1, 1),
  [711] = {.entry = {.count = 1, .reusable = true}}, SHIFT(61),
  [713] = {.entry = {.count = 1, .reusable = true}}, SHIFT(334),
  [715] = {.entry = {.count = 1, .reusable = true}}, SHIFT(225),
  [717] = {.entry = {.count = 1, .reusable = true}}, SHIFT(378),
  [719] = {.entry = {.count = 1, .reusable = false}}, SHIFT(378),
  [721] = {.entry = {.count = 1, .reusable = true}}, SHIFT(84),
  [723] = {.entry = {.count = 1, .reusable = true}}, SHIFT(173),
  [725] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_sort_order, 1),
  [727] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_sort_order, 1),
  [729] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_assign_statement_repeat1, 1),
  [731] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_assign_statement_repeat1, 1),
  [733] = {.entry = {.count = 1, .reusable = true}}, SHIFT(219),
  [735] = {.entry = {.count = 1, .reusable = true}}, SHIFT(36),
  [737] = {.entry = {.count = 1, .reusable = true}}, SHIFT(187),
  [739] = {.entry = {.count = 1, .reusable = true}}, SHIFT(376),
  [741] = {.entry = {.count = 1, .reusable = true}}, SHIFT(43),
  [743] = {.entry = {.count = 1, .reusable = true}}, SHIFT(53),
  [745] = {.entry = {.count = 1, .reusable = true}}, SHIFT(331),
  [747] = {.entry = {.count = 1, .reusable = true}}, SHIFT(42),
  [749] = {.entry = {.count = 1, .reusable = true}}, SHIFT(353),
  [751] = {.entry = {.count = 1, .reusable = true}}, SHIFT(49),
  [753] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_function_parameter_mode, 1),
  [755] = {.entry = {.count = 1, .reusable = true}}, SHIFT(371),
  [757] = {.entry = {.count = 1, .reusable = true}}, SHIFT(107),
  [759] = {.entry = {.count = 1, .reusable = true}}, SHIFT(316),
  [761] = {.entry = {.count = 1, .reusable = true}}, SHIFT(227),
  [763] = {.entry = {.count = 1, .reusable = true}}, SHIFT(370),
  [765] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [767] = {.entry = {.count = 1, .reusable = true}}, SHIFT(54),
  [769] = {.entry = {.count = 1, .reusable = true}}, SHIFT(34),
  [771] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [773] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [775] = {.entry = {.count = 1, .reusable = true}}, SHIFT(29),
  [777] = {.entry = {.count = 1, .reusable = true}}, SHIFT(110),
  [779] = {.entry = {.count = 1, .reusable = true}}, SHIFT(26),
  [781] = {.entry = {.count = 1, .reusable = true}}, SHIFT(131),
  [783] = {.entry = {.count = 1, .reusable = true}}, SHIFT(52),
  [785] = {.entry = {.count = 1, .reusable = true}}, SHIFT(114),
  [787] = {.entry = {.count = 1, .reusable = true}}, SHIFT(113),
  [789] = {.entry = {.count = 1, .reusable = true}}, SHIFT(346),
  [791] = {.entry = {.count = 1, .reusable = true}}, SHIFT(268),
  [793] = {.entry = {.count = 1, .reusable = true}}, SHIFT(321),
  [795] = {.entry = {.count = 1, .reusable = true}}, SHIFT(355),
  [797] = {.entry = {.count = 1, .reusable = true}}, SHIFT(207),
  [799] = {.entry = {.count = 1, .reusable = true}}, SHIFT(338),
  [801] = {.entry = {.count = 1, .reusable = true}}, SHIFT(163),
  [803] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [805] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [807] = {.entry = {.count = 1, .reusable = true}}, SHIFT(160),
  [809] = {.entry = {.count = 1, .reusable = true}}, SHIFT(15),
  [811] = {.entry = {.count = 1, .reusable = true}}, SHIFT(111),
  [813] = {.entry = {.count = 1, .reusable = true}}, SHIFT(60),
  [815] = {.entry = {.count = 1, .reusable = true}}, SHIFT(365),
  [817] = {.entry = {.count = 1, .reusable = true}}, SHIFT(112),
  [819] = {.entry = {.count = 1, .reusable = true}}, SHIFT(262),
  [821] = {.entry = {.count = 1, .reusable = true}}, SHIFT(115),
  [823] = {.entry = {.count = 1, .reusable = true}}, SHIFT(374),
  [825] = {.entry = {.count = 1, .reusable = true}}, SHIFT(342),
  [827] = {.entry = {.count = 1, .reusable = true}}, SHIFT(303),
  [829] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 2),
  [831] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 3),
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
