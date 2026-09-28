#include <tree_sitter/parser.h>
#include <string.h>
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
  MACRO_STATEMENT,
  LABEL_START,
  ESCAPE,
  END_OF_FILE
};

// The opening /* has already been consumed.
static bool scan_block_comment(TSLexer *lexer) {
  unsigned int depth = 1;
  while (!lexer->eof(lexer)) {
    int32_t c = lexer->lookahead;
    lexer->advance(lexer, false);
    if (c == '/' && lexer->lookahead == '*') {
      lexer->advance(lexer, false);
      depth++;
    } else if (c == '*' && lexer->lookahead == '/') {
      lexer->advance(lexer, false);
      if (--depth == 0) return true;
    }
  }
  return false;
}

static bool label_space(int32_t c) {
  return iswspace(c) || c == 0xFEFF || c == 0x2060 || c == 0x200B;
}

static bool skip_space(TSLexer *lexer, bool skip) {
  for (;;) {
    if (label_space(lexer->lookahead) || lexer->lookahead == '~') {
      lexer->advance(lexer, skip);
    } else if (lexer->lookahead == '\\') {
      lexer->advance(lexer, skip);
      if (lexer->lookahead == '\r') lexer->advance(lexer, skip);
      if (lexer->lookahead != '\n') return false;
      lexer->advance(lexer, skip);
    } else {
      return true;
    }
  }
}

static bool label_name_char(int32_t c) {
  return iswalnum(c) || c == '_' || c == '-' || c == '&' || c == '#' ||
         c == '%' || c == '$' || c == '!' || c == '@' || c == '+' || c == '*' ||
         c == '/' || (c >= 0x80 && !label_space(c));
}

// Peek across extras, leaving their nodes and ranges to the normal lexer.
static bool skip_label_trivia(TSLexer *lexer) {
  for (;;) {
    if (!skip_space(lexer, false)) return false;
    if (lexer->lookahead == '/') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '/') {
        while (!lexer->eof(lexer) && lexer->lookahead != '\n') {
          lexer->advance(lexer, false);
        }
      } else if (lexer->lookahead == '*') {
        lexer->advance(lexer, false);
        if (!scan_block_comment(lexer)) return false;
      } else {
        return false;
      }
    } else if (lexer->lookahead == '{') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '*') {
        lexer->advance(lexer, false);
      } else {
        if (lexer->lookahead < '0' || lexer->lookahead > '9') return false;
        do {
          lexer->advance(lexer, false);
        } while (lexer->lookahead >= '0' && lexer->lookahead <= '9');
      }
      if (lexer->lookahead != '}') return false;
      lexer->advance(lexer, false);
    } else {
      return true;
    }
  }
}

static bool scan_label_start(TSLexer *lexer, bool leading_dot) {
  // The marker consumes nothing: the grammar still owns the identifier and
  // colon, and applies the keyword restrictions for the surrounding block.
  if (!leading_dot) lexer->mark_end(lexer);
  char name[8] = {0};
  unsigned int length = 0;
  if (leading_dot) name[length++] = '.';
  if (lexer->lookahead == '/' && !leading_dot) {
    lexer->advance(lexer, false);
    // Comment delimiters start comments only at the beginning of a token.
    if (lexer->lookahead == '*') {
      lexer->advance(lexer, false);
      if (!scan_block_comment(lexer)) return false;
      lexer->mark_end(lexer);
      lexer->result_symbol = BLOCK_COMMENT;
      return true;
    }
    if (lexer->lookahead == '/') return false;
    name[length++] = '/';
  }
  while (label_name_char(lexer->lookahead) || lexer->lookahead == '.') {
    int32_t c = lexer->lookahead;
    if (length < sizeof(name) - 1) {
      name[length] = c < 0x80 ? towupper(c) : 0x7F;
    }
    length++;
    lexer->advance(lexer, false);
    if (c == '.' && !iswdigit(lexer->lookahead)) return false;
  }

  // These words followed by ':' open blocks themselves, even when the next
  // statement is another block (DO: REPEAT: ... END. END.).
  if (length < sizeof(name) &&
      (!strcmp(name, "DO") || !strcmp(name, "REPEAT") ||
       !strcmp(name, "FINALLY") || !strcmp(name, "EDITING"))) return false;

  if (!skip_label_trivia(lexer) || lexer->lookahead != ':') return false;
  lexer->advance(lexer, false);
  // A label colon must be followed by whitespace; adjacent text belongs to
  // object access or another token, even when that text starts a comment.
  if (!label_space(lexer->lookahead) && !lexer->eof(lexer)) return false;
  lexer->result_symbol = LABEL_START;
  return true;
}

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
  if (valid_symbols[ESCAPE]) {
    while (label_space(lexer->lookahead)) lexer->advance(lexer, true);
    if (lexer->lookahead == '~' || lexer->lookahead == '\\') {
      bool tilde = lexer->lookahead == '~';
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);
      // Tilde trivia and UNIX escapes leave punctuation to its grammar rule.
      // Quotes and braces have different escaped meanings; backslashes in
      // complete filename tokens are consumed by the filename lexer instead.
      int32_t c = lexer->lookahead;
      if (c == '\r') {
        lexer->advance(lexer, false);
        c = lexer->lookahead == '\n' ? '\n' : 0;
      }
      if (tilde || c == '\n' || (c > 0 && c < 0x80 && strchr("()[],:.;+-*/=<>", c))) {
        lexer->result_symbol = ESCAPE;
        return true;
      }
      return false;
    }
  }
  if (valid_symbols[END_OF_FILE] && lexer->eof(lexer)) {
    lexer->mark_end(lexer);
    lexer->result_symbol = END_OF_FILE;
    return true;
  }
  if (valid_symbols[MACRO_STATEMENT] || valid_symbols[LABEL_START]) {
    // Extras (whitespace) are not yet skipped when the external scanner runs;
    // skip them before looking for an indented macro statement.
    if (!skip_space(lexer, true)) return false;
  }

  if (valid_symbols[LABEL_START] && !valid_symbols[COLON] &&
      label_name_char(lexer->lookahead)) {
    // A failed peek has advanced the lexer. Return immediately so it cannot
    // affect string, comment, or punctuation scans in this call.
    return scan_label_start(lexer, false);
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
      valid_symbols[NAMEPLUS] || valid_symbols[COLON] || valid_symbols[TERMINATOR_DOT] ||
      valid_symbols[LABEL_START]) {
    if (lexer->lookahead == '.') {
      lexer->mark_end(lexer);
      lexer->advance(lexer, false);
      if (valid_symbols[LABEL_START] && !valid_symbols[COLON] && iswdigit(lexer->lookahead)) {
        return scan_label_start(lexer, true);
      }
      lexer->mark_end(lexer);

      if ((iswalpha(lexer->lookahead) || lexer->lookahead == '_') && valid_symbols[NAMEDOT]) {
        lexer->result_symbol = NAMEDOT;
        return true;
      }

      // An adjacent name character keeps the period inside a name or number,
      // including a leading decimal component in a label reference (.1a).
      if (valid_symbols[TERMINATOR_DOT] && !label_name_char(lexer->lookahead)) {
        lexer->result_symbol = TERMINATOR_DOT;
        return true;
      }
      return false;
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
      if (!skip_space(lexer, true)) return false;

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
        if (valid_symbols[TERMINATOR_DOT] && !label_name_char(lexer->lookahead)) {
          lexer->result_symbol = TERMINATOR_DOT;
          return true;
        }
        return false;
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

    if (scan_block_comment(lexer)) {
      lexer->mark_end(lexer);
      lexer->result_symbol = BLOCK_COMMENT;
      return true;
    }
  }

  return false;
}
