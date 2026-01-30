#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  NAMEDOT,
  NAMECOLON,
  NAMEDOUBLECOLON,
  NAMEPLUS,
  COLON,
  TERMINATOR_DOT,
  ESCAPED_STRING,
  BLOCK_COMMENT
};

void *tree_sitter_abl_external_scanner_create() {
  return NULL;
}

void tree_sitter_abl_external_scanner_destroy(void *payload) {
}

unsigned int tree_sitter_abl_external_scanner_serialize(
  void *payload,
  char *buffer
) {
  return 0u;
}

void tree_sitter_abl_external_scanner_deserialize(
  void *payload,
  const char *buffer,
  unsigned int length
) {
}

bool tree_sitter_abl_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  if (valid_symbols[NAMEDOT] || valid_symbols[NAMECOLON] || valid_symbols[NAMEDOUBLECOLON] ||
      valid_symbols[NAMEPLUS] || valid_symbols[COLON] || valid_symbols[TERMINATOR_DOT]) {
    if (lexer->lookahead == '.') {
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);

      if ((iswalpha(lexer->lookahead) || lexer->lookahead == '_') && valid_symbols[NAMEDOT]) {
        lexer->result_symbol = NAMEDOT;
        return true;
      }

      if (valid_symbols[TERMINATOR_DOT]) {
        lexer->result_symbol = TERMINATOR_DOT;
        return true;
      }
    }

    if (lexer->lookahead == '+' && valid_symbols[NAMEPLUS]) {
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);

      if (iswalpha(lexer->lookahead) || lexer->lookahead == '_') {
        lexer->result_symbol = NAMEPLUS;
        return true;
      }
    }

    if (lexer->lookahead == ':') {
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);

      if (lexer->lookahead == ':' && valid_symbols[NAMEDOUBLECOLON]) {
        lexer->advance(lexer, false);
        if (iswalpha(lexer->lookahead) || lexer->lookahead == '_') {
          lexer->mark_end(lexer);
          lexer->result_symbol = NAMEDOUBLECOLON;
          return true;
        }
      }

      if ((iswalpha(lexer->lookahead) || lexer->lookahead == '_') && valid_symbols[NAMECOLON]) {
        lexer->result_symbol = NAMECOLON;
        return true;
      }

      if (valid_symbols[COLON]) {
        lexer->result_symbol = COLON;
        return true;
      }
    }

    if (valid_symbols[COLON]) {
      while (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
        lexer->advance(lexer, true);
      }

      if (lexer->lookahead == ':') {
        lexer->advance(lexer, false);
        lexer->mark_end(lexer);
        lexer->result_symbol = COLON;
        return true;
      }
    }

    if (valid_symbols[TERMINATOR_DOT] || valid_symbols[NAMEDOT]) {
      while (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
        lexer->advance(lexer, true);
      }

      if (lexer->lookahead == '.') {
        lexer->advance(lexer, false);
        lexer->mark_end(lexer);
        if ((iswalpha(lexer->lookahead) || lexer->lookahead == '_') &&
            valid_symbols[NAMEDOT]) {
          lexer->result_symbol = NAMEDOT;
          return true;
        }
        if (valid_symbols[TERMINATOR_DOT]) {
          lexer->result_symbol = TERMINATOR_DOT;
          return true;
        }
      }
    }
  }

  if (valid_symbols[ESCAPED_STRING] &&
      (lexer->lookahead == '"' || lexer->lookahead == '\'')) {
    char start = lexer->lookahead;
    lexer->advance(lexer, false);

    while (!lexer->eof(lexer)) {
      if (lexer->lookahead == '\\') {
        lexer->advance(lexer, false);
        if (!lexer->eof(lexer)) {
          lexer->advance(lexer, false);
        }
        continue;
      }

      if (lexer->lookahead == start) {
        lexer->advance(lexer, false);
        if (lexer->lookahead == start) {
          lexer->advance(lexer, false);
          continue;
        }
        lexer->result_symbol = ESCAPED_STRING;
        return true;
      }

      if (lexer->lookahead == '~') {
        lexer->advance(lexer, false);
        if (!lexer->eof(lexer)) {
          lexer->advance(lexer, false);
        }
      } else {
        lexer->advance(lexer, false);
      }
    }
  }

  if (valid_symbols[BLOCK_COMMENT]) {
    while (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
      lexer->advance(lexer, true);
    }

    if (lexer->lookahead != '/') {
      return false;
    }
    lexer->advance(lexer, false);
    if (lexer->lookahead != '*') {
      return false;
    }
    lexer->advance(lexer, false);

    unsigned int depth = 1;
    while (!lexer->eof(lexer)) {
      if (lexer->lookahead == '/') {
        lexer->advance(lexer, false);
        if (lexer->lookahead == '*') {
          lexer->advance(lexer, false);
          depth++;
          continue;
        }
        continue;
      }

      if (lexer->lookahead == '*') {
        lexer->advance(lexer, false);
        if (lexer->lookahead == '/') {
          lexer->advance(lexer, false);
          depth--;
          if (depth == 0) {
            lexer->result_symbol = BLOCK_COMMENT;
            return true;
          }
        }
        continue;
      }

      lexer->advance(lexer, false);
    }
  }

  return false;
}
