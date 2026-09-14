import { RuleTester } from "oxlint/plugins-dev";

import {
  forwardingRule,
  choiceSubset,
  singleUseSequence,
  sequenceSubset,
  recursiveTailReuse,
  keywordReuse,
  sharedChoice,
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

resetSharingCandidates();
new RuleTester().run("shared-repetition", sharedRepetition, {
  valid: [
    {
      name: "disabled repetition does not seed the cross-file candidate map",
      filename: "grammar/statements/temp-table.js",
      code: repeatedTableItems
        .replace("RULE_NAME", "temp_table_definition")
        .replace(
          "repeat(",
          "// oxlint-disable-next-line rule-to-test/shared-repetition\n    repeat(",
        ),
    },
    {
      name: "matching repetition remains clean when its only peer is disabled",
      filename: "grammar/statements/interface.js",
      code: repeatedTableItems.replace("RULE_NAME", "interface_temp_table"),
    },
  ],
  invalid: [],
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

resetSharingCandidates();
new RuleTester().run("shared-recursion", sharedRecursion, {
  valid: [
    {
      name: "disabled recursion does not seed the cross-file candidate map",
      filename: "grammar/statements/buffer-copy.js",
      code: `export default () => ({
        // oxlint-disable-next-line rule-to-test/shared-recursion
        __buffer_copy_field_tail: ($) =>
          seq(optional(","), $._identifier_or_qualified_name, optional($.__buffer_copy_field_tail)),
      });`,
    },
    {
      name: "matching recursion remains clean when its only peer is disabled",
      filename: "grammar/statements/query.js",
      code: recursiveFieldTail("__query_field_name_tail"),
    },
  ],
  invalid: [],
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

resetSharingCandidates();
new RuleTester().run("shared-sequence", sharedSequence, {
  valid: [
    {
      name: "disabled IMPORT phrase does not seed the cross-file candidate map",
      filename: "grammar/statements/import.js",
      code: `export default ({ kw }) => ({
        // oxlint-disable-next-line rule-to-test/shared-sequence
        __import_delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
      });`,
    },
    {
      name: "matching EXPORT phrase remains clean when its only peer is disabled",
      filename: "grammar/statements/export.js",
      code: `export default ({ kw }) => ({
        __export_delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
      });`,
    },
  ],
  invalid: [],
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

resetSharingCandidates();
RuleTester.it = (_name, run) => run();
new RuleTester().run("choice-subset across files", choiceSubset, {
  valid: [
    {
      filename: "grammar/core/common.js",
      code: `export default ({kw}) => ({
      _serialization_modifier: ($) => choice(alias(kw("SERIALIZABLE"), $.serialization_modifier), alias(kw("NON-SERIALIZABLE"), $.serialization_modifier)),
    });`,
    },
  ],
  invalid: [
    {
      filename: "grammar/statements/var.js",
      code: `export default ({kw}) => ({
      __var_storage_modifier: ($) => choice(alias(kw("STATIC"), $.static_modifier), alias(kw("SERIALIZABLE"), $.serialization_modifier), alias(kw("NON-SERIALIZABLE"), $.serialization_modifier)),
    });`,
      errors: [
        {
          message:
            /_serialization_modifier matches 2 consecutive alternatives in __var_storage_modifier/,
        },
      ],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("choice-subset DYNAMIC-FUNCTION regression", choiceSubset, {
  valid: [
    {
      filename: "grammar/core/common.js",
      code: `export default () => ({
      _string_or_identifier_access_or_call: ($) => choice($.string_literal, $._identifier_or_access_or_call),
    });`,
    },
  ],
  invalid: [
    {
      filename: "grammar/expressions/dynamic-function.js",
      code: `export default () => ({
      __dynamic_function_atom: ($) => choice($.string_literal, $._identifier_or_access_or_call, $.parenthesized_expression),
    });`,
      errors: [
        {
          message:
            /_string_or_identifier_access_or_call matches 2 consecutive alternatives in __dynamic_function_atom/,
        },
      ],
    },
  ],
});

RuleTester.it = (_name, run) => {
  resetSharingCandidates();
  run();
};
new RuleTester().run("choice-subset", choiceSubset, {
  valid: [
    `export default () => ({
      _string_or_identifier_access_or_call: ($) => choice($.string_literal, $._identifier_or_access_or_call),
      __dynamic_function_atom: ($) => choice($._string_or_identifier_access_or_call, $.parenthesized_expression),
    });`,
    `export default () => ({ _small: ($) => choice($.a, $.b), _large: ($) => choice($.x, $._small) });`,
    `export default () => ({ _small: ($) => choice($.a, $.b), _large: ($) => choice($.b, $.a, $.c) });`,
    `export default () => ({ _small: ($) => choice($.a, $.b), _large: ($) => choice($.a, $.c, $.b) });`,
    `export default () => ({ small: ($) => choice($.a, $.b), _large: ($) => choice($.a, $.b, $.c) });`,
    `export default () => ({ _small: ($) => prec.right(choice($.a, $.b)), _large: ($) => choice($.a, $.b, $.c) });`,
    `export default () => ({ _small: ($) => choice($.a, $.b), _same: ($) => choice($.a, $.b) });`,
    `export default () => ({ _small: ($) => choice($.a, $._large), _large: ($) => choice($.a, $._large, $.c) });`,
    `export default () => ({ _small: ($) => choice($.a, $.b), _large: ($) => token(choice($.a, $.b, $.c)) });`,
    `const helpers = { _small: ($) => choice($.a, $.b), _large: ($) => choice($.a, $.b, $.c) };`,
    `export default ({kw}) => ({ _small: ($) => choice(kw("COLUMN", {offset:3}), $.b), _large: ($) => choice(kw("COLUMN", {offset:6}), $.b, $.c) });`,
    `export default () => ({ _small: ($) => choice(field("x", $.a), $.b), _large: ($) => choice(field("y", $.a), $.b, $.c) });`,
    `export default () => ({ _small: ($) => choice(alias($.a, $.x), $.b), _large: ($) => choice(alias($.a, $.y), $.b, $.c) });`,
    `export default () => ({ _small: ($) => choice(token(/a/i), $.b), _large: ($) => choice(token(/b/i), $.b, $.c) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/choice-subset
      _small: ($) => choice($.a, $.b),
      _large: ($) => choice($.a, $.b, $.c),
    });`,
  ],
  invalid: [
    {
      name: "provider appears first",
      code: `export default () => ({ _small: ($) => choice($.a, $.b), _large: ($) => choice($.x, $.a, $.b, $.y) });`,
      errors: [{ message: /_small matches 2 consecutive alternatives in _large/ }],
    },
    {
      name: "provider appears after the larger choice",
      code: `export default () => ({ _large: ($) => choice($.x, $.a, $.b, $.y), _small: ($) => choice($.a, $.b) });`,
      errors: [{ message: /_small matches 2 consecutive alternatives in _large/ }],
    },
    {
      name: "class parameter flags",
      code: `export default ({kw}) => ({
        __class_handle_option: ($) => choice(alias(kw("BIND"), $.bind), alias(kw("BY-VALUE"), $.by_value), alias(kw("BY-REFERENCE"), $.by_reference)),
        __class_table_option: ($) => choice(alias(kw("APPEND"), $.append), alias(kw("BIND"), $.bind), alias(kw("BY-VALUE"), $.by_value), alias(kw("BY-REFERENCE"), $.by_reference)),
      });`,
      errors: [
        {
          message:
            /__class_handle_option matches 3 consecutive alternatives in __class_table_option/,
        },
      ],
    },
    {
      name: "nested larger choice under a field",
      code: `export default grammar({rules: {
        _small: ($) => choice($.a, $.b),
        value: ($) => seq("X", field("value", choice($.a, $.b, $.c))),
      }});`,
      errors: [{ message: /_small matches 2 consecutive alternatives in value/ }],
    },
  ],
});

new RuleTester().run("single-use-sequence", singleUseSequence, {
  valid: [
    `export default () => ({ __var_variable_suffix: ($) => seq(alias($.__var_variable, $.variable), optional(seq(",", $.__var_variable_suffix))) });`,
    `export default () => ({ value: ($) => seq("(", $.name), root: ($) => seq($.value, ")") });`,
    `export default () => ({ _shared: ($) => seq("(", $.name), root: ($) => seq($._shared, ")") });`,
    `export default () => ({ __x_body: ($) => seq("(", $.name), root: ($) => seq($.__x_body, ")") });`,
    `export default () => ({ __x: ($) => seq("(", $.name), root: ($) => choice($.__x, seq($.__x, ")")) });`,
    `export default () => ({ __x: ($) => seq("(", $.name), root: ($) => alias($.__x, $.visible) });`,
    `export default () => ({ __x: ($) => seq("(", $.name), root: ($) => field("value", $.__x) });`,
    `export default () => ({ __x: ($) => prec.right(seq("(", $.name)), root: ($) => seq($.__x, ")") });`,
    `export default () => ({ __x: ($) => choice("(", $.name), root: ($) => seq($.__x, ")") });`,
    `export default () => ({ __x: ($) => seq("(", choice($.a, $.b)), root: ($) => seq($.__x, ")") });`,
    `export default () => ({ __x: ($) => seq("(", $.name, ")", "."), root: ($) => seq($.__x, ")") });`,
    `export default () => ({ __x: ($) => seq("(", $.__x) });`,
    `export default () => ({ __x: ($) => seq("(", $.name), root: ($) => token(seq($.__x, ")")) });`,
    `export default grammar({inline: ($) => [$.__x], rules: { __x: ($) => seq("(", $.name), root: ($) => seq($.__x, ")") }});`,
    `export default grammar({precedences: ($) => [[$.__x, $.root]], rules: { __x: ($) => seq("(", $.name), root: ($) => seq($.__x, ")") }});`,
    `const unrelated = { __x: ($) => seq("(", $.name), root: ($) => seq($.__x, ")") };`,
  ],
  invalid: [
    {
      name: "VAR recursive comma tail",
      code: `export default () => ({
        __var_variable_suffix: ($) => seq(alias($.__var_variable, $.variable), optional($.__var_variable_tail)),
        __var_variable_tail: ($) => seq(",", $.__var_variable_suffix),
      });`,
      errors: [
        { message: /__var_variable_tail has one unaliased local use in __var_variable_suffix/ },
      ],
    },
    {
      name: "parenthesized field sequence",
      code: `export default () => ({
        root: ($) => seq("ROWID", $.__rowid),
        __rowid: ($) => seq("(", field("rowid", $.expression), ")"),
      });`,
      errors: [{ message: /__rowid has one unaliased local use in root/ }],
    },
    {
      name: "sequence with optional suffix",
      code: `export default grammar({rules: {
        root: ($) => seq("VALUE", $.__value),
        __value: ($) => seq($.expression, optional($.no_error)),
      }});`,
      errors: [{ message: /__value has one unaliased local use in root/ }],
    },
  ],
});

new RuleTester().run("sequence-subset", sequenceSubset, {
  valid: [
    `export default () => ({ _value: ($) => seq("=", field("value", $.expression)), root: ($) => seq($.name, $._value) });`,
    `export default () => ({ value: ($) => seq("=", $.expression), root: ($) => seq($.name, "=", $.expression) });`,
    `export default () => ({ _value: ($) => prec.right(seq("=", $.expression)), root: ($) => seq($.name, "=", $.expression) });`,
    `export default () => ({ _value: ($) => seq("=", field("value", $.expression)), root: ($) => seq($.name, "=", field("other", $.expression)) });`,
    `export default () => ({ _value: ($) => seq("=", alias($.expression, $.value)), root: ($) => seq($.name, "=", alias($.expression, $.other)) });`,
    `export default () => ({ _value: ($) => seq("=", $.expression), root: ($) => seq($.name, $.expression, "=") });`,
    `export default () => ({ _value: ($) => seq("=", $.expression), root: ($) => seq($.name, "=", ":", $.expression) });`,
    `export default () => ({ _value: ($) => seq("=", $.expression), root: ($) => seq("=", $.expression) });`,
    `export default () => ({ _value: ($) => seq("=", $.expression), root: ($) => token(seq($.name, "=", $.expression)) });`,
    `export default () => ({ _value: ($) => seq("=", $.expression), root: ($) => token.immediate(seq($.name, "=", $.expression)) });`,
    `export default () => ({ _value: ($) => seq("=", field("value", $.root)), root: ($) => seq($.name, "=", field("value", $.root)) });`,
    `export default () => ({ _value: ($) => seq("=", token(/a/i)), root: ($) => seq($.name, "=", token(/b/i)) });`,
    `export default ({kw}) => ({ _value: ($) => seq(kw("COLUMN", {offset:3}), $.expression), root: ($) => seq($.name, kw("COLUMN", {offset:6}), $.expression) });`,
    `const unrelated = { _value: ($) => seq("=", $.expression), root: ($) => seq($.name, "=", $.expression) };`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/sequence-subset
      _value: ($) => seq("=", $.expression),
      root: ($) => seq($.name, "=", $.expression),
    });`,
  ],
  invalid: [
    {
      name: "punctuation-led suffix",
      code: `export default () => ({ _value: ($) => seq("=", field("value", $.expression)), root: ($) => seq($.name, "=", field("value", $.expression)) });`,
      errors: [{ message: /_value matches 2 consecutive elements in root/ }],
    },
    {
      name: "provider follows usage",
      code: `export default () => ({ root: ($) => seq($.name, "=", $.expression), _value: ($) => seq("=", $.expression) });`,
      errors: [{ message: /_value matches 2 consecutive elements in root/ }],
    },
    {
      name: "prefix inside nested sequence",
      code: `export default grammar({rules: { _opener: ($) => seq("(", $.expression), root: ($) => choice($.name, seq("(", $.expression, ")")) }});`,
      errors: [{ message: /_opener matches 2 consecutive elements in root/ }],
    },
    {
      name: "middle sequence",
      code: `export default () => ({ _value: ($) => seq("=", $.expression), root: ($) => seq($.name, "=", $.expression, ".") });`,
      errors: [{ message: /_value matches 2 consecutive elements in root/ }],
    },
    {
      name: "provider last retains all matching targets",
      code: `export default () => ({ first: ($) => seq($.a, "=", $.expression), second: ($) => seq($.b, "=", $.expression), _value: ($) => seq("=", $.expression) });`,
      errors: [
        { message: /_value matches 2 consecutive elements in first/ },
        { message: /_value matches 2 consecutive elements in second/ },
      ],
    },
  ],
});

resetSharingCandidates();
RuleTester.it = (_name, run) => run();
new RuleTester().run("sequence-subset PUT assignment regression", sequenceSubset, {
  valid: [
    {
      filename: "grammar/core/common.js",
      code: `export default () => ({ _equals_value: ($) => seq("=", field("value", $._expression)) });`,
    },
  ],
  invalid: [
    {
      filename: "grammar/statements/put-assign.js",
      code: `export default () => ({ __put_assign_prefix: ($) => seq(field("type", $.__put_assign_type), $.__put_assign_args, "=", field("value", $._expression)) });`,
      errors: [{ message: /_equals_value matches 2 consecutive elements in __put_assign_prefix/ }],
    },
  ],
});

RuleTester.it = (_name, run) => {
  resetSharingCandidates();
  run();
};
new RuleTester().run("recursive-tail-reuse", recursiveTailReuse, {
  valid: [
    `export default () => ({ _expressions: ($) => seq($._expression, optional($.__expressions_tail)), __expressions_tail: ($) => seq(",", $._expressions) });`,
    `export default () => ({ expressions: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", $.item, optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq($.item, optional($.tail)), tail: ($) => seq(",", $.item, optional($.tail)) });`,
    `export default () => ({ _head: ($) => prec.right(seq($.item, optional($.__tail))), __tail: ($) => seq(",", $.item, optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq($.item, optional($.__tail)), __tail: ($) => prec.right(seq(",", $.item, optional($.__tail))) });`,
    `export default () => ({ _head: ($) => seq($.first, optional($.__tail)), __tail: ($) => seq(",", $.rest, optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq(field("first", $.item), optional($.__tail)), __tail: ($) => seq(",", field("rest", $.item), optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq(alias($.item, $.first), optional($.__tail)), __tail: ($) => seq(",", alias($.item, $.rest), optional($.__tail)) });`,
    `export default ({kw}) => ({ _head: ($) => seq(kw("FIELD", {offset:3}), optional($.__tail)), __tail: ($) => seq(",", kw("FIELD", {offset:5}), optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq(token(/a/i), optional($.__tail)), __tail: ($) => seq(",", token(/b/i), optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", $.item, optional($.__other)) });`,
    `export default () => ({ _head: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", optional($.__tail), $.item) });`,
    `export default () => ({ _head: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq($.item, optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq(optional($.item), optional($.__tail)), __tail: ($) => seq(",", optional($.item), optional($.__tail)) });`,
    `export default () => ({ _head: ($) => seq($.item, optional($._head)) });`,
    `const unrelated = { _head: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", $.item, optional($.__tail)) };`,
    `export default () => ({ _head: ($) => seq($.item, optional($.__tail)),
      // oxlint-disable-next-line rule-to-test/recursive-tail-reuse
      __tail: ($) => seq(",", $.item, optional($.__tail)),
    });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/recursive-tail-reuse
      _head: ($) => seq($.item, optional($.__tail)),
      __tail: ($) => seq(",", $.item, optional($.__tail)),
    });`,
  ],
  invalid: [
    {
      name: "expression list regression",
      code: `export default grammar({rules: {
        _expressions: ($) => seq($._expression, optional($.__expressions_tail)),
        __expressions_tail: ($) => seq(",", $._expression, optional($.__expressions_tail)),
      }});`,
      errors: [{ message: /__expressions_tail repeats the body of _expressions/ }],
    },
    {
      name: "event parameter list",
      code: `export default () => ({
        __event_parameter_list: ($) => seq($.__event_parameter, optional($.__event_parameter_tail)),
        __event_parameter_tail: ($) => seq(",", $.__event_parameter, optional($.__event_parameter_tail)),
      });`,
      errors: [{ message: /__event_parameter_tail repeats the body of __event_parameter_list/ }],
    },
    {
      name: "optional comma with preserved fields, tail declared first",
      code: `export default () => ({
        __tail: ($) => seq(optional(","), field("item", $.identifier), optional($.__tail)),
        _head: ($) => seq(field("item", $.identifier), optional($.__tail)),
      });`,
      errors: [{ message: /__tail repeats the body of _head/ }],
    },
    {
      name: "compound list item with alias",
      code: `export default () => ({
        _head: ($) => seq(field("name", $.name), "=", alias($.value, $.item), optional($.__tail)),
        __tail: ($) => seq(",", field("name", $.name), "=", alias($.value, $.item), optional($.__tail)),
      });`,
      errors: [{ message: /__tail repeats the body of _head/ }],
    },
  ],
});

new RuleTester().run("keyword-reuse", keywordReuse, {
  valid: [
    `export default ({kw}) => ({ _in_keyword: ($) => kw("IN"), root: ($) => seq($._in_keyword, $.value) });`,
    `export default ({kw}) => ({ keyword: ($) => kw("IN"), root: ($) => seq(kw("IN"), $.value) });`,
    `export default ({kw}) => ({ _in_keyword: ($) => kw("IN"), public_keyword: ($) => kw("IN") });`,
    `export default ({kw}) => ({ _first: ($) => kw("IN"), _second: ($) => kw("IN") });`,
    `export default ({kw}) => ({ _keyword: ($) => prec(1, kw("IN")), root: ($) => seq(kw("IN"), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("FRAME", {offset:4}), root: ($) => seq(kw("FRAME", {offset:5}), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("FIELDS", {alias:"FIELD"}), root: ($) => seq(kw("FIELDS", {alias:"FIELDS"}), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("IN"), root: ($) => token(seq(kw("IN"), $.value)) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("IN"), root: ($) => token.immediate(seq(kw("IN"), $.value)) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw(word), root: ($) => seq(kw(word), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("IN", options), root: ($) => seq(kw("IN", options), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("IN", {...options}), root: ($) => seq(kw("IN", {...options}), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("IN", {offset}), root: ($) => seq(kw("IN", {offset}), $.value) });`,
    `export default ({kw}) => ({ _keyword: ($) => kw("IN", {[key]:3}), root: ($) => seq(kw("IN", {[key]:3}), $.value) });`,
    `export default ({kw}) => ({ _not_keyword: ($) => kw("NOT"), root: ($) => alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive) });`,
    `const unrelated = { _keyword: ($) => kw("IN"), root: ($) => seq(kw("IN"), $.value) };`,
    `export default ({kw}) => ({
      // oxlint-disable-next-line rule-to-test/keyword-reuse
      _keyword: ($) => kw("IN"),
      root: ($) => seq(kw("IN"), $.value),
    });`,
  ],
  invalid: [
    {
      name: "VIEW/HIDE keyword reuse",
      code: `export default ({kw}) => ({ _in_keyword: ($) => kw("IN"), root: ($) => seq(kw("IN"), kw("FRAME", {offset:4}), field("frame", $.name)) });`,
      errors: [{ message: /root repeats the exact "IN" keyword call from _in_keyword/ }],
    },
    {
      name: "provider last retains all occurrences",
      code: `export default ({kw}) => ({ root: ($) => choice(seq(kw("IN"), $.a), seq(kw("IN"), $.b)), _in_keyword: ($) => kw("IN") });`,
      errors: [
        { message: /root repeats the exact "IN" keyword call from _in_keyword/ },
        { message: /root repeats the exact "IN" keyword call from _in_keyword/ },
      ],
    },
    {
      name: "matching keyword options",
      code: `export default ({kw}) => ({ _keyword: ($) => kw("FIELDS", {alias:"FIELD", offset:5}), root: ($) => seq(kw("FIELDS", {alias:"FIELD", offset:5}), $.value) });`,
      errors: [{ message: /root repeats the exact "FIELDS" keyword call from _keyword/ }],
    },
    {
      name: "direct token alias retained at callsite",
      code: `export default ({kw}) => ({ _keyword: ($) => kw("NO-LOCK"), root: ($) => seq($.name, alias(kw("NO-LOCK"), $.no_lock)) });`,
      errors: [{ message: /root repeats the exact "NO-LOCK" keyword call from _keyword/ }],
    },
  ],
});

resetSharingCandidates();
RuleTester.it = (_name, run) => run();
new RuleTester().run("keyword-reuse cross-file VIEW/HIDE regression", keywordReuse, {
  valid: [
    {
      filename: "grammar.js",
      code: `export default grammar({rules: { _in_keyword: ($) => kw("IN") }});`,
    },
  ],
  invalid: [
    {
      filename: "grammar/phrases/widget.js",
      code: `export default ({kw}) => ({ __view_hide_widget_ref: ($) => seq(field("field", $._identifier_or_array_access), kw("IN"), kw("FRAME", {offset:4}), field("frame", $.__widget_name)) });`,
      errors: [
        { message: /__view_hide_widget_ref repeats the exact "IN" keyword call from _in_keyword/ },
      ],
    },
  ],
});

RuleTester.it = (_name, run) => {
  resetSharingCandidates();
  run();
};
new RuleTester().run("shared-choice", sharedChoice, {
  valid: [
    `export default () => ({ _assignment_value: ($) => choice($.array_initializer, $._expression), first: ($) => field("right", $._assignment_value), second: ($) => seq("=", $._assignment_value) });`,
    `export default () => ({ first: ($) => choice($.a, $.b), second: ($) => choice($.b, $.a) });`,
    `export default () => ({ first: ($) => choice(field("x", $.a), $.b), second: ($) => choice(field("y", $.a), $.b) });`,
    `export default () => ({ first: ($) => choice(alias($.a, $.x), $.b), second: ($) => choice(alias($.a, $.y), $.b) });`,
    `export default ({kw}) => ({ first: ($) => choice(kw("FRAME", {offset:4}), $.b), second: ($) => choice(kw("FRAME", {offset:5}), $.b) });`,
    `export default ({kw}) => ({ first: ($) => choice(kw("FRAME", options), $.b), second: ($) => choice(kw("FRAME", options), $.b) });`,
    `export default () => ({ first: ($) => choice(token(/a/i), $.b), second: ($) => choice(token(/b/i), $.b) });`,
    `export default () => ({ first: ($) => prec.left(choice($.a, $.b)), second: ($) => prec.right(choice($.a, $.b)) });`,
    `export default () => ({ first: ($) => prec("one", choice($.a, $.b)), second: ($) => prec("two", choice($.a, $.b)) });`,
    `export default () => ({ first: ($) => choice($.a, $.b), second: ($) => token(choice($.a, $.b)) });`,
    `export default () => ({ first: ($) => choice($.a, $.b), second: ($) => token.immediate(choice($.a, $.b)) });`,
    `export default () => ({ first: ($) => choice($.a, optional($.b)), second: ($) => choice($.a, optional($.b)) });`,
    `export default () => ({ first: ($) => choice(...values), second: ($) => choice(...values) });`,
    `export default () => ({ first: ($) => choice(value, $.b), second: ($) => choice(value, $.b) });`,
    `export default () => ({ first: ($) => choice(seq("X", $.first), $.b), second: ($) => choice(seq("X", $.first), $.b) });`,
    `const unrelated = { first: ($) => choice($.a, $.b), second: ($) => choice($.a, $.b) };`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/shared-choice
      first: ($) => choice($.a, $.b),
      second: ($) => choice($.a, $.b),
    });`,
  ],
  invalid: [
    {
      name: "two-branch choices with fields outside the choice",
      code: `export default () => ({ first: ($) => field("right", choice($.array_initializer, $._expression)), second: ($) => seq("=", choice($.array_initializer, $._expression)) });`,
      errors: [{ message: /repeats 2 alternatives.*extract a shared hidden choice helper/ }],
    },
    {
      name: "reuse hidden provider",
      code: `export default () => ({ _value: ($) => choice($.a, $.b), second: ($) => field("value", choice($.a, $.b)) });`,
      errors: [{ message: /reuse hidden choice _value/ }],
    },
    {
      name: "public providers must retain their visible wrapper",
      code: `export default () => ({ visible: ($) => choice($.a, $.b), second: ($) => field("value", choice($.a, $.b)) });`,
      errors: [{ message: /extract a shared hidden choice helper/ }],
    },
    {
      name: "equal precedence wrappers remain part of the match",
      code: `export default () => ({ first: ($) => prec.right(choice($.a, $.b)), second: ($) => prec.right(choice($.a, $.b)) });`,
      errors: [{ message: /repeats 2 alternatives/ }],
    },
  ],
});

resetSharingCandidates();
RuleTester.it = (_name, run) => run();
new RuleTester().run("shared-choice assignment value regression", sharedChoice, {
  valid: [
    {
      filename: "grammar.js",
      code: `export default grammar({rules: { __assignment_statement_body: ($) => seq(field("left", $._assignable), field("operator", $.assignment_operator), field("right", choice($.array_initializer, $._expression)), optional($.widget_phrase)) }});`,
    },
  ],
  invalid: [
    {
      filename: "grammar/phrases/assign.js",
      code: `export default () => ({ __assign_pair_tail: ($) => seq("=", field("right", choice($.array_initializer, $._expression)), optional($._when_phrase)) });`,
      errors: [{ message: /repeats 2 alternatives from __assignment_statement_body/ }],
    },
    {
      filename: "grammar/statements/var.js",
      code: `export default () => ({ __var_initializer: ($) => seq("=", choice($.array_initializer, $._expression)) });`,
      errors: [{ message: /repeats 2 alternatives from __assignment_statement_body/ }],
    },
  ],
});

new RuleTester().run("forwarding-rule", forwardingRule, {
  valid: [
    `export default () => ({ __value: ($) => $.identifier, root: ($) => alias($.__value, $.value) });`,
    `export default () => ({ __value: ($) => $._expression, root: ($) => alias($.other, $.__value) });`,
    `export default () => ({ __value: ($) => $["expression"], root: ($) => $.__value });`,
    `export default () => ({ __value: ($) => other.expression, root: ($) => $.__value });`,
    `export default grammar({ externals: ($) => [$._macro_statement_token], rules: { root: ($) => alias($._macro_statement_token, $.constant) } });`,
    `export default () => ({ visible: ($) => $._expression, root: ($) => $.visible });`,
    `export default () => ({ _shared: ($) => $._expression, root: ($) => $._shared });`,
    `export default () => ({ __self: ($) => $.__self });`,
    `export default () => ({ __value: ($) => prec(1, $._expression), root: ($) => $.__value });`,
    `export default () => ({ __value: ($) => field("value", $._expression), root: ($) => $.__value });`,
    `export default () => ({ __value: ($) => alias($._expression, $.value), root: ($) => $.__value });`,
    `export default () => ({ __value: ($) => choice($.a, $.b), root: ($) => $.__value });`,
    `export default () => ({ __value: ($) => $._expression, root: ($) => token($.__value) });`,
    `export default () => ({ __value: ($) => $._expression, root: ($) => token.immediate($.__value) });`,
    `export default grammar({ inline: ($) => [$.__value], rules: { __value: ($) => $._expression, root: ($) => $.__value } });`,
    `export default grammar({ conflicts: ($) => [[$.__value, $.other]], rules: { __value: ($) => $._expression, root: ($) => $.__value } });`,
    `export default grammar({ precedences: ($) => [[$.__value, $.other]], rules: { __value: ($) => $._expression, root: ($) => $.__value } });`,
    `export default grammar({ supertypes: ($) => [$.__value], rules: { __value: ($) => $._expression, root: ($) => $.__value } });`,
    `const unrelated = { __value: ($) => $._expression, root: ($) => $.__value };`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/forwarding-rule
      __value: ($) => $._expression,
      root: ($) => $.__value,
    });`,
  ],
  invalid: [
    {
      name: "macro statement forwarding rule used by other grammar modules",
      code: `export default grammar({ externals: ($) => [$._macro_statement_token], rules: { __macro_statement: ($) => $._macro_statement_token } });`,
      errors: [{ message: /__macro_statement only forwards to _macro_statement_token/ }],
    },
    {
      name: "alias stays at the callsite",
      code: `export default () => ({ __macro_statement: ($) => $._macro_statement_token, root: ($) => alias($.__macro_statement, $.constant) });`,
      errors: [{ message: /__macro_statement only forwards to _macro_statement_token/ }],
    },
    {
      name: "forwarding expression helper preserves each field at its callsite",
      code: `export default () => ({ __value: ($) => $._expression, root: ($) => seq(field("topic", $.__value), optional(seq("KEY", field("key", $.__value)))) });`,
      errors: [{ message: /__value only forwards to _expression/ }],
    },
    {
      name: "a hidden wrapper around a visible target can also be removed",
      code: `export default grammar({ rules: { root: ($) => seq("X", $.__name), __name: ($) => $.identifier } });`,
      errors: [{ message: /__name only forwards to identifier/ }],
    },
  ],
});

console.log("✓ Optimizer lint plugin tests passed successfully");
