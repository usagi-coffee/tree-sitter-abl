import { RuleTester } from "oxlint/plugins-dev";

import {
  resetSharingCandidates,
  sharedSequence,
  sharedRecursion,
  sharedRepetition,
} from "./oxlint-plugin-tree-sitter-optimize.js";

RuleTester.describe = (_name, run) => run();
RuleTester.it = (_name, run) => run();

const repeatedTableItems = `
export default () => ({
  RULE_NAME: ($) =>
    repeat(
      choice(
        alias($._table_field, $.temp_table_field),
        alias($._table_index, $.temp_table_index),
      ),
    ),
});
`;

resetSharingCandidates();
new RuleTester().run("shared-repetition", sharedRepetition, {
  valid: [
    {
      name: "first occurrence seeds the sharing candidate",
      filename: "grammar/statements/temp-table.js",
      code: repeatedTableItems.replace("RULE_NAME", "temp_table_definition"),
    },
  ],
  invalid: [
    {
      name: "matching repetition in another file is reported",
      filename: "grammar/statements/interface.js",
      code: repeatedTableItems.replace("RULE_NAME", "interface_temp_table"),
      errors: [
        {
          message:
            "This non-trivial repetition duplicates temp_table_definition in temp-table.js; try extracting a shared hidden helper.",
        },
      ],
    },
  ],
});

const recursiveFieldTail = (name) => `
export default () => ({
  ${name}: ($) =>
    seq(optional(","), $._identifier_or_qualified_name, optional($.${name})),
});
`;

resetSharingCandidates();
new RuleTester().run("shared-recursion across files", sharedRecursion, {
  valid: [
    {
      name: "original BUFFER-COPY tail seeds the candidate",
      filename: "grammar/statements/buffer-copy.js",
      code: recursiveFieldTail("__buffer_copy_field_tail"),
    },
  ],
  invalid: [
    {
      name: "original QUERY tail duplicates BUFFER-COPY",
      filename: "grammar/statements/query.js",
      code: recursiveFieldTail("__query_field_name_tail"),
      errors: [{ message: /duplicates __buffer_copy_field_tail in buffer-copy\.js/ }],
    },
  ],
});

RuleTester.it = (_name, run) => {
  resetSharingCandidates();
  run();
};

new RuleTester().run("shared-recursion", sharedRecursion, {
  valid: [
    {
      name: "one shared helper serves both field lists after optimization",
      code: `export default () => ({
        _field_names: ($) => seq($._name, optional($._field_names_tail)),
        _field_names_tail: ($) => seq(optional(","), $._name, optional($._field_names_tail)),
        __copy_fields: ($) => seq("EXCEPT", $._field_names),
        __query_fields: ($) => seq("(", optional($._field_names), ")"),
      });`,
    },
    {
      name: "public recursive nodes keep their identities",
      code: `export default () => ({
        first: ($) => seq($.item, optional($.first)),
        second: ($) => seq($.item, optional($.second)),
      });`,
    },
    {
      name: "non-grammar object properties are ignored",
      code: `const object = {
        _first: ($) => seq($.item, optional($._first)),
        _second: ($) => seq($.item, optional($._second)),
      };`,
    },
    {
      name: "different fields cannot be shared",
      code: `export default () => ({
        _first: ($) => seq(field("left", $.item), optional($._first)),
        _second: ($) => seq(field("right", $.item), optional($._second)),
      });`,
    },
    {
      name: "different aliases cannot be shared",
      code: `export default () => ({
        _first: ($) => seq(alias($.item, $.left), optional($._first)),
        _second: ($) => seq(alias($.item, $.right), optional($._second)),
      });`,
    },
    {
      name: "different associativity cannot be shared",
      code: `export default () => ({
        _first: ($) => prec.left(seq($.item, optional($._first))),
        _second: ($) => prec.right(seq($.item, optional($._second))),
      });`,
    },
    {
      name: "different named precedence cannot be shared",
      code: `export default () => ({
        _first: ($) => prec("first", seq($.item, optional($._first))),
        _second: ($) => prec("second", seq($.item, optional($._second))),
      });`,
    },
    {
      name: "keyword abbreviation options remain distinct",
      code: `export default () => ({
        _first: ($) => seq(kw("COLUMN", { offset: 3 }), optional($._first)),
        _second: ($) => seq(kw("COLUMN", { offset: 6 }), optional($._second)),
      });`,
    },
    {
      name: "different regular expressions remain distinct",
      code: `export default () => ({
        _first: ($) => seq(token(/a/i), optional($._first)),
        _second: ($) => seq(token(/b/i), optional($._second)),
      });`,
    },
    {
      name: "different item rules remain distinct",
      code: `export default () => ({
        _first: ($) => seq($.left, optional($._first)),
        _second: ($) => seq($.right, optional($._second)),
      });`,
    },
    {
      name: "a reference to another rule is not a recursive edge",
      code: `export default () => ({
        _first: ($) => seq($.item, optional($._tail)),
        _second: ($) => seq($.item, optional($._tail)),
      });`,
    },
  ],
  invalid: [
    {
      name: "USING lists with a separator inside the optional tail",
      code: `export default () => ({
        __using_type_refs: ($) =>
          prec.right(seq($.__using_type_ref, optional(seq(",", $.__using_type_refs)))),
        __using_type_arguments: ($) =>
          prec.right(seq($.__using_type_ref, optional(seq(",", $.__using_type_arguments)))),
      });`,
      errors: [{ message: /duplicates __using_type_refs/ }],
    },
    {
      name: "core grammar rules with identical fields and aliases",
      code: `export default grammar({ rules: {
        _first: ($) => prec.right(seq(field("item", alias($.value, $.item)), optional($._first))),
        _second: ($) => prec.right(seq(field("item", alias($.value, $.item)), optional($._second))),
      }});`,
      errors: [{ message: /duplicates _first/ }],
    },
    {
      name: "formatting and comments do not hide a duplicate",
      code: `export default () => ({
        _first: ($) => seq($.item, optional($._first)),
        _second: ($) => seq(
          $.item, /* continue the list */ optional($._second)
        ),
      });`,
      errors: [{ message: /duplicates _first/ }],
    },
  ],
});

const delimiterRule = (prefix) => `
export default ({ kw }) => ({
  ${prefix}_statement: ($) => seq("${prefix.toUpperCase()}", optional(alias($.__${prefix}_delimiter_phrase, $.delimiter_phrase)), $.item),
  __${prefix}_delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
});
`;

resetSharingCandidates();
RuleTester.it = (_name, run) => run();
new RuleTester().run("shared-sequence across files", sharedSequence, {
  valid: [
    {
      name: "original IMPORT phrase seeds the candidate",
      filename: "grammar/statements/import.js",
      code: delimiterRule("import"),
    },
  ],
  invalid: [
    {
      name: "original EXPORT phrase duplicates the same public DELIMITER node",
      filename: "grammar/statements/export.js",
      code: delimiterRule("export"),
      errors: [{ message: /__import_delimiter_phrase in import\.js.*alias to delimiter_phrase/ }],
    },
  ],
});

RuleTester.it = (_name, run) => {
  resetSharingCandidates();
  run();
};

const aliasedPair = (first, second, extra = "", target = "phrase") => `
export default ({ kw }) => ({
  first: ($) => alias($.__first, $.phrase),
  second: ($) => alias($.__second, $.${target}),
  __first: ($) => ${first},
  __second: ($) => ${second},
  ${extra}
});
`;
const delimiterBody = 'seq(kw("DELIMITER"), field("delimiter", $.string_literal))';

new RuleTester().run("shared-sequence", sharedSequence, {
  valid: [
    {
      name: "optimized statements share the public phrase directly",
      code: `export default ({ kw }) => ({
        import_statement: ($) => seq("IMPORT", optional($.delimiter_phrase), $.item),
        export_statement: ($) => seq("EXPORT", optional($.delimiter_phrase), $.item),
        delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
      });`,
    },
    {
      name: "different field captures are preserved",
      code: aliasedPair(delimiterBody, delimiterBody.replace('"delimiter"', '"separator"')),
    },
    {
      name: "different value rules are preserved",
      code: aliasedPair(delimiterBody, delimiterBody.replace("$.string_literal", "$.identifier")),
    },
    {
      name: "different keyword abbreviation options are preserved",
      code: aliasedPair(
        'seq(kw("COLUMN", { offset: 3 }), field("value", $.number))',
        'seq(kw("COLUMN", { offset: 6 }), field("value", $.number))',
      ),
    },
    {
      name: "different lexical aliases are preserved",
      code: aliasedPair(
        'seq(kw("COLUMN", { alias: "COL" }), field("value", $.number))',
        'seq(kw("COLUMN", { alias: "COLUMN" }), field("value", $.number))',
      ),
    },
    {
      name: "different regex patterns are preserved",
      code: aliasedPair(
        'seq("X", field("value", token(/a/i)))',
        'seq("X", field("value", token(/b/i)))',
      ),
    },
    {
      name: "different associativity is preserved",
      code: aliasedPair(`prec.left(${delimiterBody})`, `prec.right(${delimiterBody})`),
    },
    {
      name: "different named precedence is preserved",
      code: aliasedPair(`prec("a", ${delimiterBody})`, `prec("b", ${delimiterBody})`),
    },
    {
      name: "nested aliases preserve their node identities",
      code: aliasedPair(
        'seq("X", field("value", alias($.item, $.a)))',
        'seq("X", field("value", alias($.item, $.b)))',
      ),
    },
    {
      name: "ordinary JavaScript object methods are not grammar rules",
      code: `const helpers = {
        first: ($) => alias($.__first, $.phrase), second: ($) => alias($.__second, $.phrase),
        __first: ($) => ${delimiterBody}, __second: ($) => ${delimiterBody},
      };`,
    },
    {
      name: "shared token definitions remain lexical rules",
      code: aliasedPair('token(seq("A", "B"))', 'token(seq("A", "B"))'),
    },
    {
      name: "the full precedence chain is compared",
      code: aliasedPair(
        `prec("a", prec.right(${delimiterBody}))`,
        `prec("b", prec.right(${delimiterBody}))`,
      ),
    },
    {
      name: "keyword/value-looking token internals are excluded",
      code: aliasedPair(`token(${delimiterBody})`, `token.immediate(${delimiterBody})`),
    },
    {
      name: "nullable sequences cannot become hidden helpers",
      code: aliasedPair(
        'seq(optional("X"), optional(field("x", $.item)))',
        'seq(optional("X"), optional(field("x", $.item)))',
      ),
    },
    {
      name: "keyword-only sequences are outside the valued-clause rule",
      code: aliasedPair('seq("FOR", "READ", "ONLY")', 'seq("FOR", "READ", "ONLY")'),
    },
    {
      name: "reusing a WHEN helper removes the duplicate sequence",
      code: `export default ({kw}) => ({
        _when_phrase: ($) => seq(kw("WHEN"), field("when", $._expression)),
        __buffer_copy_assign_pair: ($) => seq(field("left", $._assignable), "=", field("right", $._expression), optional($._when_phrase)),
      });`,
    },
    {
      name: "the optimized INITIAL clauses share one sequence",
      code: `export default ({kw}) => ({
        _initial_phrase: ($) => seq(kw("INITIAL", {offset: 4}), field("initial", $._initial_value)),
        __variable_option: ($) => choice($.view_as_phrase, $._initial_phrase),
        __parameter_option: ($) => choice($._format_string, $._initial_phrase),
        __temp_table_field_option: ($) => choice($._color_font_option, $._initial_phrase),
        __class_property_option: ($) => choice($._initial_phrase, $._no_undo_keyword),
      });`,
    },
  ],
  invalid: [
    {
      name: "BUFFER-COPY's nested WHEN clause duplicates an existing helper",
      code: `export default ({kw}) => ({
        _when_phrase: ($) => seq(kw("WHEN"), field("when", $._expression)),
        __buffer_copy_assign_pair: ($) => seq(field("left", $._assignable), "=", field("right", $._expression), optional(seq(kw("WHEN"), field("when", $._expression)))),
      });`,
      errors: [{ message: /duplicates _when_phrase.*hidden helper/ }],
    },
    {
      name: "INITIAL clauses match across four definition families",
      code: `export default ({kw}) => ({
        __variable_option: ($) => choice($.view_as_phrase, seq(kw("INITIAL", {offset: 4}), field("initial", $._initial_value))),
        __parameter_option: ($) => choice($._format_string, seq(kw("INITIAL", {offset: 4}), field("initial", $._initial_value))),
        __temp_table_field_option: ($) => choice($._color_font_option, seq(kw("INITIAL", {offset: 4}), field("initial", $._initial_value))),
        __class_property_option: ($) => choice(seq(kw("INITIAL", {offset: 4}), field("initial", $._initial_value)), $._no_undo_keyword),
      });`,
      errors: [
        { message: /duplicates __variable_option/ },
        { message: /duplicates __variable_option/ },
        { message: /duplicates __variable_option/ },
      ],
    },
    {
      name: "widget LIKE clauses match even when embedded in different surrounding constructs",
      code: `export default ({kw}) => ({
        __button_body: ($) => seq(field("name", $.identifier), repeat(choice(kw("AUTO-GO"), seq($._like_keyword, field("like", $.identifier))))),
        __image_option: ($) => choice($.image_phrase, seq($._like_keyword, field("like", $.identifier)), $.size_phrase),
        __menu_option: ($) => choice($._color_font_option, seq($._like_keyword, field("like", $.identifier))),
      });`,
      errors: [{ message: /duplicates __button_body/ }, { message: /duplicates __button_body/ }],
    },
    {
      name: "the inner-size pair matches in editor, format, and selection-list alternatives",
      code: `export default ({kw}) => ({
        __editor_size: ($) => choice($.size_phrase, seq(kw("INNER-CHARS"), field("inner_chars", $.number_literal), kw("INNER-LINES"), field("inner_lines", $.number_literal))),
        __format_editor_size: ($) => choice($.__format_size_phrase, seq(kw("INNER-CHARS"), field("inner_chars", $.number_literal), kw("INNER-LINES"), field("inner_lines", $.number_literal))),
        __selection_list_option: ($) => choice(kw("SINGLE"), seq(kw("INNER-CHARS"), field("inner_chars", $.number_literal), kw("INNER-LINES"), field("inner_lines", $.number_literal))),
      });`,
      errors: [{ message: /duplicates __editor_size/ }, { message: /duplicates __editor_size/ }],
    },
    {
      name: "repeated clauses inside one rule are candidates",
      code: `export default ({kw}) => ({
        __put_screen_output: ($) => choice(
          seq(optional(seq($._row_keyword, field("row", $._expression))), field("value", $._expression)),
          seq(field("value", $._expression), seq($._row_keyword, field("row", $._expression)))
        ),
      });`,
      errors: [{ message: /duplicates __put_screen_output/ }],
    },
    {
      name: "different aliases suggest a hidden helper to preserve node identities",
      code: aliasedPair(delimiterBody, delimiterBody, "", "other_phrase"),
      errors: [{ message: /duplicates __first.*hidden helper/ }],
    },
    {
      name: "bare references require a hidden helper",
      code: aliasedPair(delimiterBody, delimiterBody, "bare: ($) => $.__first,"),
      errors: [{ message: /duplicates __first.*hidden helper/ }],
    },
    {
      name: "multiple aliases require a hidden helper",
      code: aliasedPair(delimiterBody, delimiterBody, "other: ($) => alias($.__first, $.other),"),
      errors: [{ message: /duplicates __first.*hidden helper/ }],
    },
    {
      name: "public source rules retain their wrappers around the hidden helper",
      code: aliasedPair(delimiterBody, delimiterBody).replaceAll("__first", "public_first"),
      errors: [{ message: /duplicates public_first.*hidden helper/ }],
    },
    {
      name: "identical aliases within a module",
      code: aliasedPair(delimiterBody, delimiterBody),
      errors: [{ message: /__first.*alias to phrase/ }],
    },
    {
      name: "comments and whitespace do not hide a duplicate",
      code: aliasedPair(
        delimiterBody,
        'seq(kw("DELIMITER"), /* value */\n field("delimiter", $.string_literal))',
      ),
      errors: [{ message: /__first.*alias to phrase/ }],
    },
    {
      name: "core grammar declarations are recognized",
      code: `export default grammar({ rules: {
        first: ($) => alias($.__first, $.phrase), second: ($) => alias($.__second, $.phrase),
        __first: ($) => prec.right(${delimiterBody}), __second: ($) => prec.right(${delimiterBody}),
      }});`,
      errors: [{ message: /__first.*alias to phrase/ }],
    },
  ],
});

console.log("✓ Optimizer lint plugin tests passed successfully");
