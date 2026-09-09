#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  NAMEDOT,
  NAMECOLON,
  NAMEDOUBLECOLON,
  NAMEPLUS,
  COLON,
  TERMINATOR_DOT,
  STRING_LITERAL,
  BLOCK_COMMENT,
  MACRO_STATEMENT
};

void *tree_sitter_abl_external_scanner_create() {
  return NULL;
}

void tree_sitter_abl_external_scanner_destroy(void *payload) {
  (void)payload;
}

unsigned int tree_sitter_abl_external_scanner_serialize(
  void *payload,
  char *buffer
) {
  (void)payload;
  (void)buffer;
  return 0u;
}

void tree_sitter_abl_external_scanner_deserialize(
  void *payload,
  const char *buffer,
  unsigned int length
) {
  (void)payload;
  (void)buffer;
  (void)length;
}

bool tree_sitter_abl_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  (void)payload;
  if (valid_symbols[MACRO_STATEMENT]) {
    // Extras (whitespace) are not yet skipped when the external scanner runs;
    // skip them before looking for an indented macro statement.
    while (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
      lexer->advance(lexer, true);
    }
  }

  if (valid_symbols[MACRO_STATEMENT] && lexer->lookahead == '{') {
    lexer->advance(lexer, false);
    // A {&NAME} macro alone on its line (a "pragma", e.g. prolint-nowarn
    // annotations) is its own statement/class member, distinct from the same
    // {&NAME} spelling used inline as a preprocessor_name (an accessor
    // modifier, an EXTENT size, ...). Only what follows the closing '}'
    // tells them apart, and a regex token cannot look ahead without
    // consuming a trailing "// comment" into itself (losing it as its own
    // comment node), so it is decided here instead: peek past '}', and
    // commit only if nothing but optional whitespace and an optional
    // "// comment" precede the newline.
    if (valid_symbols[MACRO_STATEMENT] && lexer->lookahead == '&') {
      lexer->advance(lexer, false); // consume '&'
      bool saw_body = false;

      while (!lexer->eof(lexer) && lexer->lookahead != '}' && lexer->lookahead != '\r' &&
             lexer->lookahead != '\n') {
        saw_body = true;
        lexer->advance(lexer, false);
      }

      if (saw_body && lexer->lookahead == '}') {
        lexer->advance(lexer, false); // consume '}'
        lexer->mark_end(lexer); // the token itself is just "{&NAME}"

        while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
          lexer->advance(lexer, false);
        }

        if (lexer->lookahead == '/') {
          lexer->advance(lexer, false);
          if (lexer->lookahead == '/') {
            while (!lexer->eof(lexer) && lexer->lookahead != '\r' && lexer->lookahead != '\n') {
              lexer->advance(lexer, false);
            }
          } else {
            return false; // a single '/' is not a comment, not this pattern
          }
        }

        if (lexer->lookahead == '\r') lexer->advance(lexer, false);
        if (lexer->lookahead == '\n') {
          lexer->result_symbol = MACRO_STATEMENT;
          return true;
        }
      }
    }

    // No match: the peeking above must not leak into the checks below, which
    // assume they are looking at the original, unadvanced lexer position.
    return false;
  }

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

    if (valid_symbols[NAMECOLON] || valid_symbols[NAMEDOUBLECOLON] || valid_symbols[COLON]) {
      while (!lexer->eof(lexer) && iswspace(lexer->lookahead)) {
        lexer->advance(lexer, true);
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

        if ((iswalpha(lexer->lookahead) || lexer->lookahead == '_') &&
            valid_symbols[NAMECOLON]) {
          lexer->result_symbol = NAMECOLON;
          return true;
        }

        if (valid_symbols[COLON]) {
          lexer->result_symbol = COLON;
          return true;
        }
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

  if (valid_symbols[STRING_LITERAL] &&
      (lexer->lookahead == '"' || lexer->lookahead == '\'')) {
    char start = lexer->lookahead;
    lexer->advance(lexer, false);

    while (!lexer->eof(lexer)) {
      if (lexer->lookahead == start) {
        lexer->advance(lexer, false);
        if (lexer->lookahead == start) {
          lexer->advance(lexer, false);
          continue;
        }
        // The closing quote ends the string, but ABL allows a case-marker
        // suffix right after it. Consume it here so the ':' cannot be taken
        // for a block-opening colon, as in
        //   FOR EACH cust WHERE cust.id = "X":U NO-LOCK:
        // Accepted shapes: :[RLCT]U?[0-9]* | :U[0-9]* | :[0-9]+
        lexer->mark_end(lexer);
        if (lexer->lookahead == ':') {
          lexer->advance(lexer, false);
          int marker = lexer->lookahead;
          bool extended = false;
          if (marker == 'R' || marker == 'L' || marker == 'C' || marker == 'T' ||
              marker == 'r' || marker == 'l' || marker == 'c' || marker == 't') {
            lexer->advance(lexer, false);
            if (lexer->lookahead == 'U' || lexer->lookahead == 'u') {
              lexer->advance(lexer, false);
            }
            while (iswdigit(lexer->lookahead)) lexer->advance(lexer, false);
            extended = true;
          } else if (marker == 'U' || marker == 'u') {
            lexer->advance(lexer, false);
            while (iswdigit(lexer->lookahead)) lexer->advance(lexer, false);
            extended = true;
          } else if (iswdigit(lexer->lookahead)) {
            while (iswdigit(lexer->lookahead)) lexer->advance(lexer, false);
            extended = true;
          }
          if (extended) lexer->mark_end(lexer);
        }
        lexer->result_symbol = STRING_LITERAL;
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
            lexer->mark_end(lexer);
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
