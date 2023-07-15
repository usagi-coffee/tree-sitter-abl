#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  NAMEDOT,
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

bool tree_sitter_abl_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  if (valid_symbols[NAMEDOT]) {
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
  }
  return false;
}
