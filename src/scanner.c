#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  NAMEDOT,
  NAMECOLON,
  OR_OPERATOR,
  AND_OPERATOR, 
};

void *tree_sitter_abl_external_scanner_create() {
  return NULL;
}

void tree_sitter_abl_external_scanner_destroy(void *payload) {
}

unsigned int tree_sitter_abl_external_scanner_serialize(
  void *payload, char *buffer
) {
  return 0u;
}

void tree_sitter_abl_external_scanner_deserialize(
  void *payload, const char *buffer, unsigned int length
) {
}

bool insensitive_equals(int32_t codepoint, char character) {
  const int32_t uppercase_codepoint = (int32_t)character;
  return uppercase_codepoint == codepoint || (uppercase_codepoint  + 0x0020) == codepoint;
}

bool tree_sitter_abl_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  if (valid_symbols[NAMEDOT] || valid_symbols[NAMECOLON] || valid_symbols[AND_OPERATOR] || valid_symbols[OR_OPERATOR]) {
    while (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
      lexer->advance(lexer, true);
    }

    if (!lexer->eof(lexer) && lexer->lookahead == '.') {
      lexer->advance(lexer, false);
      if (!lexer->eof(lexer) && !iswspace(lexer->lookahead)) {
        lexer->result_symbol = NAMEDOT;
        return true;
      }
    }

    if (!lexer->eof(lexer) && lexer->lookahead == ':') {
      lexer->advance(lexer, false);
      if (!lexer->eof(lexer) && !iswspace(lexer->lookahead)) {
        lexer->result_symbol = NAMECOLON;
        return true;
      }
    }

    if (!lexer->eof(lexer) && insensitive_equals(lexer->lookahead, 'O')) {
      lexer->advance(lexer, false);
      if (!lexer->eof(lexer) && insensitive_equals(lexer->lookahead, 'R')) {
        lexer->advance(lexer, false);
        if (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
          lexer->result_symbol = OR_OPERATOR;
          return true;
        }
      }
    }
  }

  if (!lexer->eof(lexer) && insensitive_equals(lexer->lookahead, 'A')) {
    lexer->advance(lexer, false);
    if (!lexer->eof(lexer) && insensitive_equals(lexer->lookahead, 'N')) {
      lexer->advance(lexer, false);
      if (!lexer->eof(lexer) && insensitive_equals(lexer->lookahead,'D')) {
        lexer->advance(lexer, false);
        if (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
          lexer->result_symbol = AND_OPERATOR;
          return true;
        }
      }
    }
  }

  return false;
}

