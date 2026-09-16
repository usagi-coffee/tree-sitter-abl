import { RuleTester } from "oxlint/plugins-dev";

import {
  choiceListHeadExtraction,
  sharedFieldChunk,
  singleUseChoiceAliasSequence,
  singleUsePrecedenceValue,
  optionalModifierField,
  sharedFieldBody,
  sharedItemAlias,
  sharedExpressionAlias,
  singleUseFieldChoiceSequence,
  optionalListHeadExtraction,
  singleUsePrecedenceClause,
  fieldChoiceForwardingRule,
  fieldForwardingRule,
  singleUseAliasSequence,
  singleUseChoiceSequence,
  singleUseOptionalSequence,
  sharedStatementAlias,
  aliasPromotion,
  phraseAliasExtraction,
  singleUseKeywordSequence,
  listHeadExtraction,
  recursiveBodyReuse,
  singleUsePrecedence,
  singleUseChoice,
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

new RuleTester().run("single-use-choice", singleUseChoice, {
  valid: [
    `export default () => ({ visible: ($) => choice($.a, $.b), root: ($) => $.visible });`,
    `export default () => ({ _shared: ($) => choice($.a, $.b), root: ($) => $._shared });`,
    `export default () => ({ __item_body: ($) => choice($.a, $.b), root: ($) => $.__item_body });`,
    `export default () => ({ __item: ($) => choice($.a, $.b), root: ($) => seq($.__item, $.__item) });`,
    `export default () => ({ __item: ($) => choice($.a, $.b) });`,
    `export default () => ({ __item: ($) => choice($.a, $.__item) });`,
    `export default () => ({ __item: ($) => prec.right(choice($.a, $.b)), root: ($) => $.__item });`,
    `export default () => ({ __item: ($) => choice($.a), root: ($) => $.__item });`,
    `export default () => ({ __item: ($) => choice($.a, $.b, $.c, $.d, $.e, $.f), root: ($) => $.__item });`,
    `export default () => ({ __item: ($) => choice(...items), root: ($) => $.__item });`,
    `export default ({kw}) => ({ __item: ($) => choice(kw("A", options), $.b), root: ($) => $.__item });`,
    `export default () => ({ __item: ($) => choice($.a, $.b), root: ($) => alias($.__item, $.item) });`,
    `export default () => ({ __item: ($) => choice($.a, $.b), root: ($) => alias($.other, $.__item) });`,
    `export default () => ({ __item: ($) => choice($.a, $.b), root: ($) => token($.__item) });`,
    `export default () => ({ __item: ($) => choice($.a, $.b), root: ($) => token.immediate($.__item) });`,
    `const unrelated = { __item: ($) => choice($.a, $.b), root: ($) => $.__item };`,
    ...["inline", "conflicts", "precedences", "supertypes"].map(
      (metadata) =>
        `export default grammar({ ${metadata}: ($) => [$.__item], rules: { __item: ($) => choice($.a, $.b), root: ($) => $.__item } });`,
    ),
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/single-use-choice
      __item: ($) => choice($.a, $.b),
      root: ($) => $.__item,
    });`,
    `export default () => ({
      __enum_member: ($) => seq(field("name", $.identifier), optional(seq("=", choice($.number_literal, seq($.identifier, optional($.__enum_member_value_tail)), $.null_literal)))),
      __enum_member_value_tail: ($) => seq(",", $.identifier, optional($.__enum_member_value_tail)),
    });`,
  ],
  invalid: [
    {
      name: "ENUM member value regression",
      code: `export default () => ({
        __enum_member: ($) => seq(field("name", $.identifier), optional(seq("=", $.__enum_member_value))),
        __enum_member_value: ($) => choice($.number_literal, seq($.identifier, optional($.__enum_member_value_tail)), $.null_literal),
      });`,
      errors: [{ message: /__enum_member_value has one unaliased local use in __enum_member/ }],
    },
    {
      name: "fields outside and inside the choice are preserved",
      code: `export default grammar({rules: { __item: ($) => choice(field("a", $.a), alias($.b, $.item)), root: ($) => field("value", $.__item) }});`,
      errors: [{ message: /__item has one unaliased local use in root/ }],
    },
    {
      name: "alternative precedence remains inside the inlined choice",
      code: `export default () => ({ __item: ($) => choice(prec.left(1, $.a), $.b), root: ($) => optional($.__item) });`,
      errors: [{ message: /__item has one unaliased local use in root/ }],
    },
  ],
});

const precedenceHelper = (
  body = "prec.right(seq($.item, optional($.tail)))",
  use = "$.__items",
  name = "__items",
) => `export default () => ({
  ${name}: ($) => ${body}, root: ($) => ${use},
});`;

new RuleTester().run("single-use-precedence", singleUsePrecedence, {
  valid: [
    precedenceHelper("seq($.item, optional($.tail))"),
    precedenceHelper("prec.dynamic(1, seq($.item, $.tail))"),
    precedenceHelper("prec.right(prec.dynamic(1, seq($.item, $.tail)))"),
    precedenceHelper("prec.right(choice($.item, $.tail))"),
    precedenceHelper("prec.right(seq($.item))"),
    precedenceHelper("prec.right(seq($.a, $.b, $.c, $.d))"),
    precedenceHelper("prec.right(seq($.item, repeat($.tail)))"),
    precedenceHelper("prec.right(priority, seq($.item, $.tail))"),
    precedenceHelper("prec.right(seq($.item, optional($.tail)))", "$._items", "_items"),
    precedenceHelper("prec.right(seq($.item, optional($.tail)))", "$.items", "items"),
    precedenceHelper("prec.right(seq($.item, optional($.tail)))", "$.__items_body", "__items_body"),
    precedenceHelper(undefined, "seq($.__items, $.__items)"),
    precedenceHelper(undefined, "alias($.__items, $.items)"),
    precedenceHelper(undefined, "alias($.other, $.__items)"),
    precedenceHelper(undefined, "token($.__items)"),
    precedenceHelper(undefined, "token.immediate($.__items)"),
    `export default () => ({ __items: ($) => prec.right(seq($.item, optional($.__items))) });`,
    `export default () => ({ __items: ($) => prec.right(seq($.item, $.tail)) });`,
    `const unrelated = { __items: ($) => prec.right(seq($.item, $.tail)), root: ($) => $.__items };`,
    ...["inline", "conflicts", "precedences", "supertypes"].map(
      (metadata) =>
        `export default grammar({ ${metadata}: ($) => [$.__items], rules: { __items: ($) => prec.right(seq($.item, $.tail)), root: ($) => $.__items } });`,
    ),
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/single-use-precedence
      __items: ($) => prec.right(seq($.item, optional($.tail))),
      root: ($) => $.__items,
    });`,
    `export default () => ({ __wait_for_of_phrase: ($) => seq(field("events", $.__wait_for_event_list), $._of_keyword, field("widgets", prec.right(seq($.widget_phrase, optional($.__wait_for_widget_list_tail))))) });`,
  ],
  invalid: [
    {
      name: "WAIT-FOR widget list regression",
      code: `export default () => ({
        __wait_for_of_phrase: ($) => seq(field("events", $.__wait_for_event_list), $._of_keyword, field("widgets", $.__wait_for_widget_list)),
        __wait_for_widget_list: ($) => prec.right(seq($.widget_phrase, optional($.__wait_for_widget_list_tail))),
      });`,
      errors: [
        { message: /__wait_for_widget_list has one unaliased local use in __wait_for_of_phrase/ },
      ],
    },
    {
      name: "named static precedence and fields are retained",
      code: precedenceHelper(
        'prec("items", seq(field("item", $.item), optional($.tail)))',
        'field("items", $.__items)',
      ),
      errors: [{ message: /retaining every precedence and associativity wrapper/ }],
    },
    {
      name: "left associativity",
      code: precedenceHelper("prec.left(seq($.item, $.tail))"),
      errors: [{ message: /__items has one unaliased local use in root/ }],
    },
    {
      name: "the full static precedence chain is retained",
      code: precedenceHelper('prec("items", prec.right(seq($.item, $.tail)))'),
      errors: [{ message: /retaining every precedence and associativity wrapper/ }],
    },
  ],
});

const recursiveExpansion = (
  helper,
  expanded = helper,
  name = "__items",
) => `export default ({kw}) => ({
  ${name}: ($) => ${helper},
  root: ($) => choice($.record, ${expanded}),
});`;
const recursiveItems = "prec.right(seq($.item, optional($.__items)))";

new RuleTester().run("recursive-body-reuse", recursiveBodyReuse, {
  valid: [
    recursiveExpansion(recursiveItems, "$.__items"),
    recursiveExpansion("prec.right(seq($.item, optional($.items)))", undefined, "items"),
    recursiveExpansion(recursiveItems, "prec.left(seq($.item, optional($.__items)))"),
    recursiveExpansion(recursiveItems, "seq($.item, optional($.__items))"),
    recursiveExpansion("seq($.item, optional($.__items))", recursiveItems),
    recursiveExpansion(recursiveItems, "prec.right(seq($.other, optional($.__items)))"),
    recursiveExpansion(recursiveItems, "prec.right(seq($.item, optional($.__other)))"),
    recursiveExpansion("seq($.item, optional($.__tail))"),
    recursiveExpansion("seq(optional($.item), optional($.__items))"),
    recursiveExpansion("seq($.__items, optional($.__items))"),
    recursiveExpansion(
      'seq(field("a", $.item), optional($.__items))',
      'seq(field("b", $.item), optional($.__items))',
    ),
    recursiveExpansion(
      "seq(alias($.item, $.a), optional($.__items))",
      "seq(alias($.item, $.b), optional($.__items))",
    ),
    recursiveExpansion(
      'seq(kw("FIELD", {offset:3}), optional($.__items))',
      'seq(kw("FIELD", {offset:5}), optional($.__items))',
    ),
    recursiveExpansion(
      "seq(token(/a/i), optional($.__items))",
      "seq(token(/b/i), optional($.__items))",
    ),
    recursiveExpansion('seq(kw("FIELD", options), optional($.__items))'),
    recursiveExpansion("prec.dynamic(1, seq($.item, optional($.__items)))"),
    recursiveExpansion(recursiveItems, `token(${recursiveItems})`),
    recursiveExpansion(recursiveItems, `token.immediate(${recursiveItems})`),
    recursiveExpansion(recursiveItems, `alias(${recursiveItems}, $.items)`),
    `const unrelated = { __items: ($) => ${recursiveItems}, root: ($) => choice($.record, ${recursiveItems}) };`,
    `export default () => ({ __items: ($) => ${recursiveItems}, duplicate: ($) => ${recursiveItems} });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/recursive-body-reuse
      __items: ($) => ${recursiveItems},
      root: ($) => choice($.record, ${recursiveItems}),
    });`,
    `export default () => ({ __items: ($) => ${recursiveItems}, root: ($) => choice($.record,
      // oxlint-disable-next-line rule-to-test/recursive-body-reuse
      ${recursiveItems}),
    });`,
  ],
  invalid: [
    {
      name: "DISPLAY recursive item body regression, helper declared last",
      code: `export default () => ({
        __display_items: ($) => choice($.record, prec.right(seq($.__display_item, optional($.__display_items_tail)))),
        __display_items_tail: ($) => prec.right(seq($.__display_item, optional($.__display_items_tail))),
      });`,
      errors: [{ message: /complete recursive body of __display_items_tail/ }],
    },
    {
      name: "plain recursive sequence",
      code: recursiveExpansion("seq($.item, optional($.__items))"),
      errors: [{ message: /complete recursive body of __items/ }],
    },
    {
      name: "preserve compound fields and aliases",
      code: recursiveExpansion(
        'seq(field("key", $.name), "=", alias($.value, $.item), optional($.__items))',
      ),
      errors: [{ message: /complete recursive body of __items/ }],
    },
    {
      name: "complete named precedence chain",
      code: recursiveExpansion('prec("items", prec.right(seq($.item, optional($.__items))))'),
      errors: [{ message: /complete recursive body of __items/ }],
    },
    {
      name: "surrounding field stays at the use",
      code: `export default grammar({rules: { __items: ($) => ${recursiveItems}, root: ($) => field("items", ${recursiveItems}) }});`,
      errors: [{ message: /complete recursive body of __items/ }],
    },
  ],
});

const embeddedList = (
  item = "$.item",
  target = item,
  separator = 'optional(",")',
  continuation = "$.__tail",
) => `export default ({kw}) => ({
  root: ($) => seq("(", ${target}, optional(${continuation}), ")"),
  __tail: ($) => seq(${separator}, ${item}, optional($.__tail)),
});`;

new RuleTester().run("list-head-extraction", listHeadExtraction, {
  valid: [
    embeddedList("$.item", "$.other"),
    embeddedList('field("a", $.item)', 'field("b", $.item)'),
    embeddedList("alias($.item, $.a)", "alias($.item, $.b)"),
    embeddedList('kw("FIELD", {offset:3})', 'kw("FIELD", {offset:5})'),
    embeddedList("token(/a/i)", "token(/b/i)"),
    embeddedList('kw("FIELD", options)'),
    embeddedList("optional($.item)"),
    embeddedList("$.__tail"),
    embeddedList("$.item", "$.item", '";"'),
    embeddedList("$.item", "$.item", 'optional(",")', "$.__other"),
    `export default () => ({ root: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", $.item, optional($.__tail)) });`,
    `export default () => ({ root: ($) => seq("(", $.item, optional($.tail), ")"), tail: ($) => seq(",", $.item, optional($.tail)) });`,
    `export default () => ({ root: ($) => seq("(", $.item, optional($.__tail), ")"), __tail: ($) => prec.right(seq(",", $.item, optional($.__tail))) });`,
    ...["token", "token.immediate", "prec.right"].map(
      (wrapper) =>
        `export default () => ({ root: ($) => ${wrapper}(seq("(", $.item, optional($.__tail), ")")), __tail: ($) => seq(",", $.item, optional($.__tail)) });`,
    ),
    `export default () => ({ root: ($) => alias(seq("(", $.item, optional($.__tail), ")"), $.list), __tail: ($) => seq(",", $.item, optional($.__tail)) });`,
    `const unrelated = { root: ($) => seq("(", $.item, optional($.__tail), ")"), __tail: ($) => seq(",", $.item, optional($.__tail)) };`,
    `export default () => ({ root: ($) => seq("(", $.item, optional($.__tail), ")"),
      // oxlint-disable-next-line rule-to-test/list-head-extraction
      __tail: ($) => seq(",", $.item, optional($.__tail)),
    });`,
    `export default () => ({ root: ($) =>
      // oxlint-disable-next-line rule-to-test/list-head-extraction
      seq("(", $.item, optional($.__tail), ")"),
      __tail: ($) => seq(",", $.item, optional($.__tail)),
    });`,
    `export default ({kw}) => ({
      _go_on_phrase: ($) => seq(kw("GO-ON"), "(", $.__go_on_keys, ")"),
      _go_on_key_tail: ($) => seq(optional(","), $.__go_on_keys),
      __go_on_keys: ($) => seq(choice($.identifier, $.string_literal), optional($._go_on_key_tail)),
    });`,
  ],
  invalid: [
    {
      name: "GO-ON optional comma tail regression",
      code: `export default ({kw}) => ({
        _go_on_phrase: ($) => seq(kw("GO-ON"), "(", choice($.identifier, $.string_literal), optional($._go_on_key_tail), ")"),
        _go_on_key_tail: ($) => seq(optional(","), choice($.identifier, $.string_literal), optional($._go_on_key_tail)),
      });`,
      errors: [{ message: /item and optional continuation repeated by _go_on_key_tail/ }],
    },
    {
      name: "required comma is retained",
      code: embeddedList("$.item", "$.item", '","'),
      errors: [{ message: /item and optional continuation repeated by __tail/ }],
    },
    {
      name: "compound item and tail declared first",
      code: `export default grammar({rules: {
        __tail: ($) => seq(",", field("name", $.name), "=", alias($.value, $.item), optional($.__tail)),
        root: ($) => seq("(", field("name", $.name), "=", alias($.value, $.item), optional($.__tail), ")"),
      }});`,
      errors: [{ message: /item and optional continuation repeated by __tail/ }],
    },
  ],
});

const keywordSequence = (
  body = 'seq(kw("IN"), $.name)',
  use = "$.__clause",
  name = "__clause",
) => `export default ({kw}) => ({
  ${name}: ($) => ${body}, root: ($) => ${use},
});`;

new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
  valid: [
    keywordSequence("seq($.keyword, $.name)"),
    keywordSequence('seq("IN", $.name)'),
    keywordSequence('seq(kw("IN"))'),
    keywordSequence('seq(kw("IN"), $.a, $.b, $.c)'),
    keywordSequence('seq(kw("IN", options), $.name)'),
    keywordSequence("seq(kw(word), $.name)"),
    keywordSequence('seq(optional(kw("IN", options)), $.name)'),
    keywordSequence('prec.right(seq(kw("IN"), $.name))'),
    keywordSequence('seq(kw("IN"), choice($.a, $.b))'),
    keywordSequence('seq(kw("IN"), repeat($.name))'),
    keywordSequence('seq(kw("IN"), alias($.name, $.item))'),
    keywordSequence('seq(kw("IN"), $.name)', "$.clause", "clause"),
    keywordSequence('seq(kw("IN"), $.name)', "$._clause", "_clause"),
    keywordSequence('seq(kw("IN"), $.name)', "$.__clause_body", "__clause_body"),
    keywordSequence(undefined, "seq($.__clause, $.__clause)"),
    keywordSequence(undefined, "alias($.__clause, $.clause)"),
    keywordSequence(undefined, "alias($.item, $.__clause)"),
    keywordSequence(undefined, "token($.__clause)"),
    keywordSequence(undefined, "token.immediate($.__clause)"),
    `export default ({kw}) => ({ __clause: ($) => seq(kw("IN"), optional($.__clause)) });`,
    `export default ({kw}) => ({ __clause: ($) => seq(kw("IN"), $.name) });`,
    `const unrelated = { __clause: ($) => seq(kw("IN"), $.name), root: ($) => $.__clause };`,
    ...["inline", "conflicts", "precedences", "supertypes"].map(
      (metadata) =>
        `export default grammar({ ${metadata}: ($) => [$.__clause], rules: { __clause: ($) => seq(kw("IN"), $.name), root: ($) => $.__clause } });`,
    ),
    `export default ({kw}) => ({
      // oxlint-disable-next-line rule-to-test/single-use-keyword-sequence
      __clause: ($) => seq(kw("IN"), $.name),
      root: ($) => $.__clause,
    });`,
    `export default ({kw}) => ({ __trigger_procedure_prefix: ($) => seq(kw("WRITE"), $._of_keyword, field("object", $.identifier), optional(seq($._new_keyword, optional(kw("BUFFER")), field("new_buffer", $.identifier))), optional($.__trigger_procedure_old_buffer)) });`,
  ],
  invalid: [
    {
      name: "TRIGGER PROCEDURE optional BUFFER regression",
      code: `export default ({kw}) => ({
        __trigger_procedure_prefix: ($) => seq(kw("WRITE"), $._of_keyword, field("object", $.identifier), optional($.__trigger_procedure_new_buffer), optional($.__trigger_procedure_old_buffer)),
        __trigger_procedure_new_buffer: ($) => seq($._new_keyword, optional(kw("BUFFER")), field("new_buffer", $.identifier)),
      });`,
      errors: [
        {
          message:
            /__trigger_procedure_new_buffer has one unaliased local use in __trigger_procedure_prefix/,
        },
      ],
    },
    {
      name: "keyword abbreviation and outer field stay intact",
      code: keywordSequence(
        'seq(kw("COLUMN", {offset:3}), field("column", $.number))',
        'field("position", $.__clause)',
      ),
      errors: [{ message: /Preserve keyword options, fields and ordering/ }],
    },
    {
      name: "field-wrapped keyword with lexical alias options",
      code: keywordSequence('seq(field("kind", kw("FIELDS", {alias:"FIELD", offset:5})), $.name)'),
      errors: [{ message: /__clause has one unaliased local use in root/ }],
    },
  ],
});

const phraseAlias = "alias($._extent_phrase, $.extent_phrase)";
const phraseAliasRules = (body, extra = "") => `export default () => ({
  root: ($) => ${body},
  ${extra}
});`;
const phraseAliasError = {
  message: /The alias of _extent_phrase as extent_phrase is repeated in this rule map/,
};
new RuleTester().run("phrase-alias-extraction", phraseAliasExtraction, {
  valid: [
    phraseAliasRules(phraseAlias),
    phraseAliasRules(`seq(${phraseAlias}, alias($._other_phrase, $.extent_phrase))`),
    phraseAliasRules(`seq(${phraseAlias}, alias($._extent_phrase, $.other_phrase))`),
    phraseAliasRules('seq(alias(kw("NO-ERROR"), $.no_error), alias(kw("NO-ERROR"), $.no_error))'),
    phraseAliasRules(
      "seq(alias($._no_error_keyword, $.no_error), alias($._no_error_keyword, $.no_error))",
    ),
    phraseAliasRules('seq(alias($._extent_phrase, "EXTENT"), alias($._extent_phrase, "EXTENT"))'),
    phraseAliasRules(
      "seq(alias($._extent_phrase, $.__extent_phrase), alias($._extent_phrase, $.__extent_phrase))",
    ),
    phraseAliasRules(`seq(token(${phraseAlias}), token.immediate(${phraseAlias}))`),
    phraseAliasRules(`seq(alias(${phraseAlias}, $.outer), alias(${phraseAlias}, $.outer))`),
    phraseAliasRules(`seq(${phraseAlias}, alias($["_extent_phrase"], $.extent_phrase))`),
    phraseAliasRules(
      `seq(${phraseAlias}, ${phraseAlias})`,
      "_extent_phrase: ($) => token(/extent/i),",
    ),
    phraseAliasRules(`seq(${phraseAlias}, ${phraseAlias})`, '_extent_phrase: ($) => kw("EXTENT"),'),
    phraseAliasRules(
      "seq($.__local_phrase, $.__local_phrase)",
      `__local_phrase: ($) => ${phraseAlias},`,
    ),
    `const unrelated = { root: ($) => seq(${phraseAlias}, ${phraseAlias}) };`,
    `export default grammar({ rules: {
      one: ($) => ${phraseAlias},
    }, other: { rules: { two: ($) => ${phraseAlias} } } });`,
    phraseAliasRules(`seq(
      // oxlint-disable-next-line rule-to-test/phrase-alias-extraction
      ${phraseAlias},
      ${phraseAlias}
    )`),
  ],
  invalid: [
    {
      name: "FUNCTION extent aliases inside optional forward tails",
      code: phraseAliasRules(`choice(
        seq(optional(${phraseAlias}), $.parameters),
        seq(optional(${phraseAlias}), $.access),
        ${phraseAlias}
      )`),
      errors: [phraseAliasError],
    },
    {
      name: "aliases in separate rules of the same map",
      code: phraseAliasRules(phraseAlias, `other: ($) => optional(${phraseAlias}),`),
      errors: [phraseAliasError],
    },
    {
      name: "fields and precedence stay at the callsites",
      code: phraseAliasRules(`seq(field("first", ${phraseAlias}), prec.right(${phraseAlias}))`),
      errors: [phraseAliasError],
    },
    {
      name: "local nonterminal phrase definition",
      code: phraseAliasRules(
        `seq(${phraseAlias}, ${phraseAlias})`,
        '_extent_phrase: ($) => seq("EXTENT", $.number),',
      ),
      errors: [phraseAliasError],
    },
    {
      name: "existing alias helper can be reused",
      code: phraseAliasRules(`optional(${phraseAlias})`, `__local_phrase: ($) => ${phraseAlias},`),
      errors: [phraseAliasError],
    },
    {
      name: "core grammar rules are recognized",
      code: `export default grammar({ rules: { root: ($) => seq(${phraseAlias}, ${phraseAlias}) } });`,
      errors: [phraseAliasError],
    },
  ],
});

const aliasPromotionRules = (
  body = 'seq("(", optional($.items), ")")',
  use = "alias($.__parameters, $.parameters)",
  extra = "",
) => `export default () => ({
  root: ($) => ${use},
  __parameters: ($) => ${body},
  ${extra}
});`;
const aliasPromotionError = {
  message: /__parameters is used locally only as the named alias parameters/,
};
new RuleTester().run("alias-promotion", aliasPromotion, {
  valid: [
    {
      name: "unaliased use must retain the private node visibility",
      code: aliasPromotionRules(
        undefined,
        "seq(alias($.__parameters, $.parameters), $.__parameters)",
      ),
    },
    {
      name: "distinct aliases cannot become one public rule",
      code: aliasPromotionRules(
        undefined,
        "seq(alias($.__parameters, $.parameters), alias($.__parameters, $.arguments))",
      ),
    },
    aliasPromotionRules(undefined, 'alias($.__parameters, "parameters")'),
    aliasPromotionRules(undefined, "alias($.__parameters, $.__parameters_node)"),
    aliasPromotionRules(undefined, "token(alias($.__parameters, $.parameters))"),
    aliasPromotionRules(undefined, "token.immediate(alias($.__parameters, $.parameters))"),
    aliasPromotionRules(undefined, "alias(alias($.__parameters, $.parameters), $.outer)"),
    aliasPromotionRules('kw("NO-ERROR")'),
    aliasPromotionRules("token(/[a-z]+/)"),
    aliasPromotionRules("prec(1, token(/[a-z]+/))"),
    aliasPromotionRules("buildParameters($)"),
    aliasPromotionRules(undefined, undefined, "parameters: ($) => $.other,"),
    aliasPromotionRules(undefined, "seq(alias($.__parameters, $.parameters), $.parameters)"),
    aliasPromotionRules(undefined, 'seq(alias($.__parameters, $.parameters), $["__parameters"])'),
    aliasPromotionRules(undefined, "$.other"),
    aliasPromotionRules('seq("(", optional(alias($.__parameters, $.parameters)), ")")'),
    {
      name: "conflict metadata prevents a local promotion suggestion",
      code: `export default grammar({
        conflicts: ($) => [[$.__parameters]],
        rules: {
          root: ($) => alias($.__parameters, $.parameters),
          __parameters: ($) => seq("(", $.items, ")"),
        },
      });`,
    },
    {
      name: "references from another rule map are unsafe",
      code: `export default grammar({
        rules: {
          root: ($) => alias($.__parameters, $.parameters),
          __parameters: ($) => seq("(", $.items, ")"),
        },
        other: { rules: { root: ($) => alias($.__parameters, $.parameters) } },
      });`,
    },
    {
      name: "a private name used as an alias destination is not promotable",
      code: aliasPromotionRules(
        undefined,
        "seq(alias($.__parameters, $.parameters), alias($.other, $.__parameters))",
      ),
    },
    {
      name: "existing public and shared rules are excluded",
      code: aliasPromotionRules().replaceAll("__parameters", "_parameters"),
    },
    {
      name: "non-grammar objects are ignored",
      code: 'const data = {root: ($) => alias($.__parameters, $.parameters), __parameters: ($) => seq("(", $.items, ")")};',
    },
    {
      name: "rule-specific suppression applies to the private definition",
      code: aliasPromotionRules().replace(
        "  __parameters:",
        "  // oxlint-disable-next-line rule-to-test/alias-promotion\n  __parameters:",
      ),
    },
  ],
  invalid: [
    {
      name: "FUNCTION parameter wrapper can become its existing public alias",
      code: aliasPromotionRules(),
      errors: [aliasPromotionError],
    },
    {
      name: "multiple references with one public alias",
      code: aliasPromotionRules(
        undefined,
        "seq(alias($.__parameters, $.parameters), optional(alias($.__parameters, $.parameters)))",
      ),
      errors: [aliasPromotionError],
    },
    {
      name: "retain body fields and static precedence",
      code: aliasPromotionRules(
        'prec.right(seq("(", field("item", $.item), ")"))',
        'field("arguments", alias($.__parameters, $.parameters))',
      ),
      errors: [aliasPromotionError],
    },
    {
      name: "a nonterminal choice can be promoted",
      code: aliasPromotionRules("choice($.named_parameters, $.positional_parameters)"),
      errors: [aliasPromotionError],
    },
    {
      name: "other rules may alias to the same public node",
      code: aliasPromotionRules(
        undefined,
        undefined,
        "other: ($) => alias($._different_parameters, $.parameters),",
      ),
      errors: [aliasPromotionError],
    },
    {
      name: "core grammar rule maps are supported",
      code: `export default grammar({ rules: {
        root: ($) => alias($.__parameters, $.parameters),
        __parameters: ($) => seq("(", $.items, ")"),
      } });`,
      errors: [aliasPromotionError],
    },
  ],
});

const statementAlias = "alias($.if_preprocessor_directive_statement, $.if_preprocessor_directive)";
const statementAliasRules = (body, extra = "") => `export default () => ({
  items: ($) => ${body},
  ${extra}
});`;
const statementAliasError = {
  message:
    /This alias of if_preprocessor_directive_statement as if_preprocessor_directive duplicates items/,
};

resetSharingCandidates();
new RuleTester().run("shared-statement-alias across files", sharedStatementAlias, {
  valid: [
    {
      filename: "grammar/statements/class.js",
      code: statementAliasRules(`choice(${statementAlias}, $.other)`),
    },
  ],
  invalid: [
    {
      filename: "grammar/statements/interface.js",
      code: statementAliasRules(`choice(${statementAlias}, $.other)`),
      errors: [statementAliasError],
    },
    {
      filename: "grammar/core/statements.js",
      code: statementAliasRules(`choice(${statementAlias}, $.other)`),
      errors: [statementAliasError],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-statement-alias exclusions", sharedStatementAlias, {
  valid: [
    statementAliasRules(`seq(token(${statementAlias}), token.immediate(${statementAlias}))`),
    statementAliasRules(
      `seq(alias(${statementAlias}, $.outer), alias(${statementAlias}, $.outer))`,
    ),
    statementAliasRules('seq(alias(kw("FLAG"), $.flag), alias(kw("FLAG"), $.flag))'),
    statementAliasRules("seq(alias($._flag_keyword, $.flag), alias($._flag_keyword, $.flag))"),
    statementAliasRules("seq(alias($.identifier, $.name), alias($.identifier, $.name))"),
    statementAliasRules(
      "seq(alias($.__private_statement, $.node), alias($.__private_statement, $.node))",
    ),
    statementAliasRules('seq(alias($.a_statement, "node"), alias($.a_statement, "node"))'),
    statementAliasRules("seq(alias($.a_statement, $._node), alias($.a_statement, $._node))"),
    statementAliasRules(
      "seq(alias($.a_statement, $.a_statement), alias($.a_statement, $.a_statement))",
    ),
    statementAliasRules('seq(alias($["a_statement"], $.node), alias($["a_statement"], $.node))'),
    statementAliasRules(
      `seq(${statementAlias}, ${statementAlias})`,
      "if_preprocessor_directive_statement: ($) => token(/x/),",
    ),
    statementAliasRules(
      `seq(${statementAlias}, ${statementAlias})`,
      'if_preprocessor_directive_statement: ($) => kw("X"),',
    ),
    `const unrelated = {items: ($) => seq(${statementAlias}, ${statementAlias})};`,
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-statement-alias", sharedStatementAlias, {
  valid: [
    {
      name: "disabled occurrence does not seed the shared map",
      filename: "grammar/statements/class.js",
      code: statementAliasRules(`choice(
      // oxlint-disable-next-line rule-to-test/shared-statement-alias
      ${statementAlias}, $.other)`),
    },
    {
      name: "only unsuppressed occurrence is not reported",
      filename: "grammar/statements/interface.js",
      code: statementAliasRules(statementAlias),
    },
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-statement-alias exact names", sharedStatementAlias, {
  valid: [
    statementAliasRules(
      `choice(${statementAlias}, alias($.other_statement, $.if_preprocessor_directive), alias($.if_preprocessor_directive_statement, $.different))`,
    ),
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-statement-alias local fields and precedence", sharedStatementAlias, {
  valid: [],
  invalid: [
    {
      code: statementAliasRules(
        `seq(field("first", ${statementAlias}), prec.right(${statementAlias}))`,
        'if_preprocessor_directive_statement: ($) => seq("IF", $.body),',
      ),
      errors: [statementAliasError],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-statement-alias after extraction", sharedStatementAlias, {
  valid: [
    {
      filename: "grammar.js",
      code: `export default grammar({rules: {
      _if_preprocessor_statement: ($) => ${statementAlias},
      items: ($) => choice($._if_preprocessor_statement, $.other),
    }});`,
    },
    {
      filename: "grammar/statements/interface.js",
      code: statementAliasRules("choice($._if_preprocessor_statement, $.other)"),
    },
  ],
  invalid: [],
});

const indexedName =
  'seq($._identifier_or_qualified_name, optional(seq("[", field("index", $._expression), "]")))';
const optionalSequenceRules = (
  body = indexedName,
  use = "$.__item",
  extra = "",
) => `export default () => ({
  fields: ($) => ${use},
  __item: ($) => ${body},
  ${extra}
});`;
const optionalSequenceError = {
  message:
    /__item has one unaliased local use in fields; try inlining this small sequence with its optional compound suffix intact/,
};
new RuleTester().run("single-use-optional-sequence", singleUseOptionalSequence, {
  valid: [
    optionalSequenceRules(undefined, "seq($.__item, $.__item)"),
    optionalSequenceRules(undefined, "alias($.__item, $.item)"),
    optionalSequenceRules(undefined, 'field("item", $.__item)'),
    optionalSequenceRules(undefined, "token($.__item)"),
    optionalSequenceRules(undefined, "token.immediate($.__item)"),
    optionalSequenceRules(undefined, "prec.dynamic(1, $.__item)"),
    optionalSequenceRules(undefined, 'seq($.__item, $["__item"])'),
    optionalSequenceRules(undefined, '$["__item"]'),
    optionalSequenceRules(undefined, "$.other"),
    optionalSequenceRules('seq($.__item, optional(seq("[", $.index, "]")))'),
    optionalSequenceRules("seq($.name, optional($.index))"),
    optionalSequenceRules("seq($.name, optional(seq($.index)))"),
    optionalSequenceRules('seq($.name, optional(seq("[", $.one, $.two, $.three, "]")))'),
    optionalSequenceRules('seq($.one, $.two, $.three, optional(seq("[", $.index, "]")))'),
    optionalSequenceRules('seq(optional($.name), optional(seq("[", $.index, "]")))'),
    optionalSequenceRules('seq($.name, optional(seq("[", choice($.x, $.y), "]")))'),
    optionalSequenceRules('seq($.name, optional(seq("[", unknown(), "]")))'),
    optionalSequenceRules(`prec.right(${indexedName})`),
    optionalSequenceRules().replaceAll("__item", "__item_body"),
    optionalSequenceRules().replaceAll("__item", "_item"),
    {
      name: "grammar metadata references prevent an inlining suggestion",
      code: `export default grammar({inline: ($) => [$.__item], rules: {
        fields: ($) => $.__item,
        __item: ($) => ${indexedName},
      }});`,
    },
    {
      name: "another rule map is not a local callsite",
      code: `export default grammar({rules: {__item: ($) => ${indexedName}}, other: {rules: {fields: ($) => $.__item}}});`,
    },
    {
      name: "non-grammar objects are ignored",
      code: `const data = {fields: ($) => $.__item, __item: ($) => ${indexedName}};`,
    },
    {
      name: "rule-specific suppression at the helper definition",
      code: optionalSequenceRules().replace(
        "  __item:",
        "  // oxlint-disable-next-line rule-to-test/single-use-optional-sequence\n  __item:",
      ),
    },
  ],
  invalid: [
    {
      name: "record field name with optional array index",
      code: optionalSequenceRules(),
      errors: [optionalSequenceError],
    },
    {
      name: "static precedence around the callsite stays intact",
      code: optionalSequenceRules(undefined, "prec.right(seq($.__item, optional($.tail)))"),
      errors: [optionalSequenceError],
    },
    {
      name: "literal prefix and abbreviated valued suffix",
      code: optionalSequenceRules(
        'seq("(", $.name, optional(seq(kw("COLUMN", {offset:3}), field("column", $.number))))',
      ),
      errors: [optionalSequenceError],
    },
    {
      name: "field in the required prefix is preserved",
      code: optionalSequenceRules(
        'seq(field("name", $.identifier), optional(seq("[", field("index", $.expression), "]")))',
      ),
      errors: [optionalSequenceError],
    },
    {
      name: "core grammar rules are supported",
      code: `export default grammar({rules: {fields: ($) => $.__item, __item: ($) => ${indexedName}}});`,
      errors: [optionalSequenceError],
    },
  ],
});

const choiceSequenceBody = 'seq(choice(kw("EXCEPT"), $._using_keyword), $._field_references)';
const choiceSequenceRules = (
  body = choiceSequenceBody,
  use = "$.__selection",
  extra = "",
) => `export default () => ({
  root: ($) => ${use},
  __selection: ($) => ${body},
  ${extra}
});`;
const choiceSequenceError = {
  message:
    /__selection has one unaliased local use in root; try inlining this small sequence containing a direct choice/,
};
new RuleTester().run("single-use-choice-sequence", singleUseChoiceSequence, {
  valid: [
    choiceSequenceRules(undefined, "seq($.__selection, $.__selection)"),
    choiceSequenceRules(undefined, "alias($.__selection, $.selection)"),
    choiceSequenceRules(undefined, 'field("selection", $.__selection)'),
    choiceSequenceRules(undefined, "token($.__selection)"),
    choiceSequenceRules(undefined, "token.immediate($.__selection)"),
    choiceSequenceRules(undefined, "prec.dynamic(1, $.__selection)"),
    choiceSequenceRules(undefined, 'seq($.__selection, $["__selection"])'),
    choiceSequenceRules(undefined, '$["__selection"]'),
    choiceSequenceRules(undefined, "$.other"),
    choiceSequenceRules("seq(choice($.__selection, $.other), $.tail)"),
    choiceSequenceRules("seq($.head, $.tail)"),
    choiceSequenceRules("seq(choice($.one), $.tail)"),
    choiceSequenceRules("seq(choice($.a, $.b, $.c, $.d, $.e, $.f), $.tail)"),
    choiceSequenceRules("seq($.one, $.two, choice($.a, $.b), $.tail)"),
    choiceSequenceRules("seq(choice(seq($.a, $.b), $.c), $.tail)"),
    choiceSequenceRules("seq(choice(alias($.a, $.x), $.b), $.tail)"),
    choiceSequenceRules("seq(choice($.a, unknown()), $.tail)"),
    choiceSequenceRules("seq(optional(choice($.a, $.b)), $.tail)"),
    {
      name: "DELETE OBJECT field-wrapped choices are outside this rule",
      code: choiceSequenceRules(
        'seq($._delete_keyword, kw("OBJECT"), field("name", choice($.object_access, $.scoped_name)))',
      ),
    },
    choiceSequenceRules(`prec.right(${choiceSequenceBody})`),
    choiceSequenceRules().replaceAll("__selection", "__selection_body"),
    choiceSequenceRules().replaceAll("__selection", "_selection"),
    {
      name: "references in grammar metadata prevent inlining",
      code: `export default grammar({conflicts: ($) => [[$.__selection]], rules: {
        root: ($) => $.__selection,
        __selection: ($) => ${choiceSequenceBody},
      }});`,
    },
    {
      name: "a reference in another rule map is not a local use",
      code: `export default grammar({rules: {__selection: ($) => ${choiceSequenceBody}}, other: {rules: {root: ($) => $.__selection}}});`,
    },
    {
      name: "non-grammar object properties are ignored",
      code: `const data = {root: ($) => $.__selection, __selection: ($) => ${choiceSequenceBody}};`,
    },
    {
      name: "rule-specific suppression applies to the helper definition",
      code: choiceSequenceRules().replace(
        "  __selection:",
        "  // oxlint-disable-next-line rule-to-test/single-use-choice-sequence\n  __selection:",
      ),
    },
  ],
  invalid: [
    {
      name: "BUFFER-COMPARE EXCEPT or USING followed by field references",
      code: choiceSequenceRules(),
      errors: [choiceSequenceError],
    },
    {
      name: "a keyword followed by a choice of nonterminal bodies",
      code: choiceSequenceRules('seq(kw("UPDATE"), choice($.__record, $.__fields))'),
      errors: [choiceSequenceError],
    },
    {
      name: "fields and keyword abbreviation options remain intact",
      code: choiceSequenceRules(
        'seq(choice(kw("FIELDS", {offset:5, alias:"FIELD"}), $._using_keyword), field("items", $.items))',
      ),
      errors: [choiceSequenceError],
    },
    {
      name: "static precedence surrounding the callsite is preserved",
      code: choiceSequenceRules(undefined, "prec.right(seq($.__selection, optional($.tail)))"),
      errors: [choiceSequenceError],
    },
    {
      name: "a short choice in the middle of a sequence",
      code: choiceSequenceRules('seq("(", choice($.a, $.b), ")")'),
      errors: [choiceSequenceError],
    },
    {
      name: "core grammar rule maps are recognized",
      code: `export default grammar({rules: {root: ($) => $.__selection, __selection: ($) => ${choiceSequenceBody}}});`,
      errors: [choiceSequenceError],
    },
  ],
});

const aliasSequenceBody = "seq($.__events, alias($.__of_phrase, $.of_phrase))";
const aliasSequenceRules = (
  body = aliasSequenceBody,
  use = "$.__items",
  extra = "",
) => `export default () => ({
  root: ($) => ${use},
  __items: ($) => ${body},
  ${extra}
});`;
const aliasSequenceError = {
  message:
    /__items has one unaliased local use in root; try inlining this small sequence with its symbol aliases intact/,
};
new RuleTester().run("single-use-alias-sequence", singleUseAliasSequence, {
  valid: [
    aliasSequenceRules(undefined, "seq($.__items, $.__items)"),
    aliasSequenceRules(undefined, "alias($.__items, $.items)"),
    aliasSequenceRules(undefined, 'field("items", $.__items)'),
    aliasSequenceRules(undefined, "token($.__items)"),
    aliasSequenceRules(undefined, "token.immediate($.__items)"),
    aliasSequenceRules(undefined, "prec.dynamic(1, $.__items)"),
    aliasSequenceRules(undefined, 'seq($.__items, $["__items"])'),
    aliasSequenceRules(undefined, '$["__items"]'),
    aliasSequenceRules(undefined, "$.other"),
    aliasSequenceRules("seq($.__items, alias($.other, $.item))"),
    aliasSequenceRules("seq($.head, $.tail)"),
    aliasSequenceRules("seq(alias($.a, $.b))"),
    aliasSequenceRules("seq($.a, $.b, alias($.c, $.d), $.e)"),
    aliasSequenceRules("seq(choice($.a, $.b), alias($.c, $.d))"),
    aliasSequenceRules('seq($.a, alias(kw("FLAG"), $.flag))'),
    aliasSequenceRules("seq($.a, optional(alias($._no_error_keyword, $.no_error)))"),
    aliasSequenceRules("seq($.a, alias(token(/x/), $.name))"),
    aliasSequenceRules("seq($.a, alias($.b, $._hidden))"),
    aliasSequenceRules("seq($.a, alias($.b, $.b))"),
    aliasSequenceRules("seq($.a, alias($.b, 42))"),
    aliasSequenceRules('seq($.a, alias($["b"], $.c))'),
    aliasSequenceRules("seq($.a, alias(unknown(), $.c))"),
    aliasSequenceRules(`prec.right(${aliasSequenceBody})`),
    aliasSequenceRules().replaceAll("__items", "__items_body"),
    aliasSequenceRules().replaceAll("__items", "_items"),
    {
      name: "metadata references prevent inlining",
      code: `export default grammar({conflicts: ($) => [[$.__items]], rules: {
        root: ($) => $.__items,
        __items: ($) => ${aliasSequenceBody},
      }});`,
    },
    {
      name: "a reference from another rule map is not a local use",
      code: `export default grammar({rules: {__items: ($) => ${aliasSequenceBody}}, other: {rules: {root: ($) => $.__items}}});`,
    },
    {
      name: "non-grammar objects are ignored",
      code: `const data = {root: ($) => $.__items, __items: ($) => ${aliasSequenceBody}};`,
    },
    {
      name: "rule-specific suppression at the helper definition",
      code: aliasSequenceRules().replace(
        "  __items:",
        "  // oxlint-disable-next-line rule-to-test/single-use-alias-sequence\n  __items:",
      ),
    },
  ],
  invalid: [
    {
      name: "ON event list followed by an aliased OF phrase",
      code: aliasSequenceRules(undefined, 'seq(kw("OR"), $.__items, optional($.tail))'),
      errors: [aliasSequenceError],
    },
    {
      name: "an alias within a field retains its scope",
      code: aliasSequenceRules(
        'seq(field("event", $.event), field("function", alias($.__function, $.key_function)), $._terminator)',
      ),
      errors: [aliasSequenceError],
    },
    {
      name: "optional symbol aliases remain optional",
      code: aliasSequenceRules("seq($.head, optional(alias($.__suffix, $.suffix)))"),
      errors: [aliasSequenceError],
    },
    {
      name: "anonymous symbol aliases retain their literal target",
      code: aliasSequenceRules('seq(alias($._colon, ":"), $._compound_body)'),
      errors: [aliasSequenceError],
    },
    {
      name: "static precedence at the callsite stays intact",
      code: aliasSequenceRules(undefined, "prec.right(seq($.__items, optional($.tail)))"),
      errors: [aliasSequenceError],
    },
    {
      name: "keyword abbreviation options remain intact",
      code: aliasSequenceRules(
        'seq(kw("DEFINE", {offset:3}), alias($.__declaration, $.declaration))',
      ),
      errors: [aliasSequenceError],
    },
    {
      name: "core grammar rule maps are supported",
      code: `export default grammar({rules: {root: ($) => $.__items, __items: ($) => ${aliasSequenceBody}}});`,
      errors: [aliasSequenceError],
    },
  ],
});

const widgetFieldWrapper = 'seq(field("widget", $.widget_phrase))';
const fieldForwardingRules = (
  body = widgetFieldWrapper,
  use = "$.__widget",
  extra = "",
) => `export default () => ({
  root: ($) => ${use},
  __widget: ($) => ${body},
  ${extra}
});`;
const fieldForwardingError = {
  message: /__widget only applies field "widget" to widget_phrase/,
};
new RuleTester().run("field-forwarding-rule", fieldForwardingRule, {
  valid: [
    fieldForwardingRules(undefined, "alias($.__widget, $.widget)"),
    fieldForwardingRules(undefined, 'field("outer", $.__widget)'),
    fieldForwardingRules(undefined, "token($.__widget)"),
    fieldForwardingRules(undefined, "token.immediate($.__widget)"),
    fieldForwardingRules(undefined, "prec.dynamic(1, $.__widget)"),
    fieldForwardingRules(undefined, "seq($.__widget, alias($.__widget, $.other))"),
    fieldForwardingRules(undefined, 'seq($.__widget, $["__widget"])'),
    fieldForwardingRules(undefined, '$["__widget"]'),
    fieldForwardingRules(undefined, "$.other"),
    fieldForwardingRules('field("widget", $.__widget)'),
    fieldForwardingRules("field(label, $.widget_phrase)"),
    fieldForwardingRules("field(42, $.widget_phrase)"),
    fieldForwardingRules('field("widget", choice($.a, $.b))'),
    fieldForwardingRules('field("widget", optional($.widget_phrase))'),
    fieldForwardingRules('field("widget", alias($.other, $.widget_phrase))'),
    fieldForwardingRules('field("flag", kw("FLAG"))'),
    fieldForwardingRules('field("flag", $._flag_keyword)'),
    fieldForwardingRules('field("widget", $["widget_phrase"])'),
    fieldForwardingRules('seq(field("widget", $.widget_phrase), ".")'),
    fieldForwardingRules('seq(seq(field("widget", $.widget_phrase)))'),
    fieldForwardingRules('prec.right(field("widget", $.widget_phrase))'),
    fieldForwardingRules().replaceAll("__widget", "__widget_body"),
    fieldForwardingRules().replaceAll("__widget", "_widget"),
    {
      name: "metadata references must be checked before removing a field helper",
      code: `export default grammar({precedences: ($) => [[$.__widget, $.other]], rules: {
        root: ($) => $.__widget,
        __widget: ($) => ${widgetFieldWrapper},
      }});`,
    },
    {
      name: "uses from another rule map are not local",
      code: `export default grammar({rules: {__widget: ($) => ${widgetFieldWrapper}}, other: {rules: {root: ($) => $.__widget}}});`,
    },
    {
      name: "non-grammar objects are ignored",
      code: `const data = {root: ($) => $.__widget, __widget: ($) => ${widgetFieldWrapper}};`,
    },
    {
      name: "rule-specific suppression applies to the helper definition",
      code: fieldForwardingRules().replace(
        "  __widget:",
        "  // oxlint-disable-next-line rule-to-test/field-forwarding-rule\n  __widget:",
      ),
    },
  ],
  invalid: [
    {
      name: "ON widget field wrapper in the list head and comma tail",
      code: fieldForwardingRules(
        undefined,
        "seq($.__widget, optional($.__tail))",
        '__tail: ($) => seq(",", $.__widget, optional($.__tail)),',
      ),
      errors: [fieldForwardingError],
    },
    {
      name: "a direct field body without a redundant sequence",
      code: fieldForwardingRules('field("widget", $.widget_phrase)'),
      errors: [fieldForwardingError],
    },
    {
      name: "multiple uses in one parent preserve each field wrapper",
      code: fieldForwardingRules(undefined, "seq($.__widget, optional($.__widget))"),
      errors: [fieldForwardingError],
    },
    {
      name: "static precedence around the callsite stays intact",
      code: fieldForwardingRules(undefined, "prec.right(seq($.__widget, optional($.tail)))"),
      errors: [fieldForwardingError],
    },
    {
      name: "hidden expression targets are supported",
      code: fieldForwardingRules('field("value", $._expression)'),
      errors: [{ message: /__widget only applies field "value" to _expression/ }],
    },
    {
      name: "core grammar rule maps are supported",
      code: `export default grammar({rules: {root: ($) => $.__widget, __widget: ($) => ${widgetFieldWrapper}}});`,
      errors: [fieldForwardingError],
    },
  ],
});

const fieldChoiceBody =
  'seq(field("handle", choice($._identifier_or_qualified_name, $.preprocessor_name)))';
const fieldChoiceRules = (
  body = fieldChoiceBody,
  use = "$.__handle",
  extra = "",
) => `export default () => ({
  widget_phrase: ($) => ${use},
  __handle: ($) => ${body},
  ${extra}
});`;
const fieldChoiceError = {
  message: /__handle only applies field "handle" to a choice of symbols/,
};
new RuleTester().run("field-choice-forwarding-rule", fieldChoiceForwardingRule, {
  valid: [
    fieldChoiceRules(undefined, "alias($.__handle, $.handle)"),
    fieldChoiceRules(undefined, 'field("outer", $.__handle)'),
    fieldChoiceRules(undefined, "token($.__handle)"),
    fieldChoiceRules(undefined, "token.immediate($.__handle)"),
    fieldChoiceRules(undefined, "prec.dynamic(1, $.__handle)"),
    fieldChoiceRules(undefined, "seq($.__handle, alias($.__handle, $.other))"),
    fieldChoiceRules(undefined, 'seq($.__handle, $["__handle"])'),
    fieldChoiceRules(undefined, '$["__handle"]'),
    fieldChoiceRules(undefined, "$.other"),
    fieldChoiceRules('field("handle", choice($.__handle, $.other))'),
    fieldChoiceRules("field(label, choice($.a, $.b))"),
    fieldChoiceRules('field("handle", $.identifier)'),
    fieldChoiceRules('field("handle", choice($.a))'),
    fieldChoiceRules('field("handle", choice($.a, $.b, $.c, $.d, $.e, $.f))'),
    fieldChoiceRules('field("handle", choice($.a, alias($.b, $.c)))'),
    fieldChoiceRules('field("handle", choice($.a, optional($.b)))'),
    fieldChoiceRules('field("flag", choice(kw("A"), kw("B")))'),
    fieldChoiceRules('field("flag", choice($._a_keyword, $._b_keyword))'),
    fieldChoiceRules('field("handle", choice($["a"], $.b))'),
    fieldChoiceRules('seq(field("handle", choice($.a, $.b)), ".")'),
    fieldChoiceRules('seq(seq(field("handle", choice($.a, $.b))))'),
    fieldChoiceRules('prec.right(field("handle", choice($.a, $.b)))'),
    fieldChoiceRules().replaceAll("__handle", "__handle_body"),
    fieldChoiceRules().replaceAll("__handle", "_handle"),
    {
      name: "visible metadata references require a separate precedence analysis",
      code: `export default grammar({precedences: ($) => [[$.function_call, $.__handle]], rules: {
        widget_phrase: ($) => $.__handle,
        __handle: ($) => ${fieldChoiceBody},
      }});`,
    },
    {
      name: "another rule map is not a local caller",
      code: `export default grammar({rules: {__handle: ($) => ${fieldChoiceBody}}, other: {rules: {widget_phrase: ($) => $.__handle}}});`,
    },
    {
      name: "non-grammar object properties are ignored",
      code: `const data = {widget_phrase: ($) => $.__handle, __handle: ($) => ${fieldChoiceBody}};`,
    },
    {
      name: "rule-specific suppression at the helper definition",
      code: fieldChoiceRules().replace(
        "  __handle:",
        "  // oxlint-disable-next-line rule-to-test/field-choice-forwarding-rule\n  __handle:",
      ),
    },
  ],
  invalid: [
    {
      name: "widget handle choice inside a one-element sequence",
      code: fieldChoiceRules(),
      errors: [fieldChoiceError],
    },
    {
      name: "direct field-choice body without a sequence",
      code: fieldChoiceRules('field("handle", choice($.a, $.b))'),
      errors: [fieldChoiceError],
    },
    {
      name: "multiple unaliased callers",
      code: fieldChoiceRules(undefined, "seq($.__handle, optional($.__handle))"),
      errors: [fieldChoiceError],
    },
    {
      name: "static precedence at the use stays intact",
      code: fieldChoiceRules(undefined, 'prec("widget_handle", $.__handle)'),
      errors: [fieldChoiceError],
    },
    {
      name: "core grammar rule maps are supported",
      code: `export default grammar({rules: {widget_phrase: ($) => $.__handle, __handle: ($) => ${fieldChoiceBody}}});`,
      errors: [fieldChoiceError],
    },
  ],
});

const precedenceClauseBody =
  'prec.left(seq(kw("SKIP"), optional(field("skip", seq($._parenthesized_expression_prefix, ")")))))';
const precedenceClauseRules = (
  body = precedenceClauseBody,
  use = "$.__skip",
  extra = "",
) => `export default () => ({
  item: ($) => ${use},
  __skip: ($) => ${body},
  ${extra}
});`;
const precedenceClauseError = {
  message:
    /__skip has one unaliased local use in item; try inlining this small precedence-wrapped valued clause/,
};
new RuleTester().run("single-use-precedence-clause", singleUsePrecedenceClause, {
  valid: [
    precedenceClauseRules(undefined, "seq($.__skip, $.__skip)"),
    precedenceClauseRules(undefined, "alias($.__skip, $.skip)"),
    precedenceClauseRules(undefined, 'field("outer", $.__skip)'),
    precedenceClauseRules(undefined, "token($.__skip)"),
    precedenceClauseRules(undefined, "token.immediate($.__skip)"),
    precedenceClauseRules(undefined, "prec.dynamic(1, $.__skip)"),
    precedenceClauseRules(undefined, 'seq($.__skip, $["__skip"])'),
    precedenceClauseRules(undefined, '$["__skip"]'),
    precedenceClauseRules(undefined, "$.other"),
    precedenceClauseRules('prec.left(seq(kw("X"), field("value", $.__skip)))'),
    precedenceClauseRules('seq(kw("X"), field("value", $.value))'),
    precedenceClauseRules('prec.left(seq($._keyword, field("value", $.value)))'),
    precedenceClauseRules('prec.left(seq($.name, field("value", $.value)))'),
    precedenceClauseRules('prec.left(seq(kw("X"), $.value))'),
    precedenceClauseRules('prec.left(seq(kw("X"), field("value", $.value), $.a, $.b))'),
    precedenceClauseRules('prec.left(choice(seq(kw("X"), field("value", $.value)), $.other))'),
    precedenceClauseRules('prec.dynamic(1, seq(kw("X"), field("value", $.value)))'),
    precedenceClauseRules('prec.left(prec.dynamic(1, seq(kw("X"), field("value", $.value))))'),
    precedenceClauseRules('prec.left(seq(kw("X"), field("value", prec.dynamic(1, $.value))))'),
    precedenceClauseRules('prec.left(seq(kw("X"), field("value", unknown())))'),
    precedenceClauseRules(
      `prec.left(seq(kw("X"), field("value", seq(${Array.from({ length: 30 }, (_, i) => `$.v${i}`).join(",")}))))`,
    ),
    precedenceClauseRules().replaceAll("__skip", "__skip_body"),
    precedenceClauseRules().replaceAll("__skip", "_skip"),
    {
      name: "local metadata references need a separate precedence analysis",
      code: `export default grammar({precedences: ($) => [[$.__skip, $.function_call]], rules: {
        item: ($) => $.__skip,
        __skip: ($) => ${precedenceClauseBody},
      }});`,
    },
    {
      name: "a caller in another rule map is not a local use",
      code: `export default grammar({rules: {__skip: ($) => ${precedenceClauseBody}}, other: {rules: {item: ($) => $.__skip}}});`,
    },
    {
      name: "non-grammar objects are ignored",
      code: `const data = {item: ($) => $.__skip, __skip: ($) => ${precedenceClauseBody}};`,
    },
    {
      name: "rule-specific suppression applies to the helper definition",
      code: precedenceClauseRules().replace(
        "  __skip:",
        "  // oxlint-disable-next-line rule-to-test/single-use-precedence-clause\n  __skip:",
      ),
    },
  ],
  invalid: [
    {
      name: "DISPLAY SKIP with a compound field and left associativity",
      code: precedenceClauseRules(),
      errors: [precedenceClauseError],
    },
    {
      name: "named precedence and right associativity are retained together",
      code: precedenceClauseRules(
        'prec("position", prec.right(seq(kw("COLUMN", {offset:3}), field("column", $.expression))))',
      ),
      errors: [precedenceClauseError],
    },
    {
      name: "a shared keyword followed by a compound field",
      code: precedenceClauseRules(
        'prec.left(seq($._at_keyword, field("position", seq("(", $.expression, ")"))))',
      ),
      errors: [precedenceClauseError],
    },
    {
      name: "static precedence around the callsite stays intact",
      code: precedenceClauseRules(undefined, "prec.right(seq($.__skip, optional($.tail)))"),
      errors: [precedenceClauseError],
    },
    {
      name: "core grammar rule maps are supported",
      code: `export default grammar({rules: {item: ($) => $.__skip, __skip: ($) => ${precedenceClauseBody}}});`,
      errors: [precedenceClauseError],
    },
  ],
});

const optionalHeadGrammar = (item = "alias($.__parameter, $.parameter)", separator = '","') => `
export default () => ({
  parameters: ($) => seq("(", optional(seq(${item}, optional($.__tail))), ")"),
  __tail: ($) => seq(${separator}, ${item}, optional($.__tail)),
});`;
const optionalHeadError = {
  message: /optional list head repeats the item and continuation in __tail/,
};

new RuleTester().run("optional-list-head-extraction", optionalListHeadExtraction, {
  valid: [
    {
      name: "already extracted head",
      code: `export default () => ({ parameters: ($) => seq("(", optional($.__head), ")"), __head: ($) => seq(alias($.__parameter, $.parameter), optional($.__tail)), __tail: ($) => seq(",", $.__head) });`,
    },
    {
      name: "larger sequences belong to list-head-extraction",
      code: optionalHeadGrammar().replace("optional(seq(alias", 'optional(seq("PREFIX", alias'),
    },
    {
      name: "named head belongs to recursive-tail-reuse",
      code: `export default () => ({ __head: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", $.item, optional($.__tail)) });`,
    },
    optionalHeadGrammar().replace(
      'seq(",", alias($.__parameter, $.parameter)',
      'seq(",", alias($.__parameter, $.other)',
    ),
    optionalHeadGrammar('field("value", $.item)').replace(
      'seq(",", field("value"',
      'seq(",", field("other"',
    ),
    optionalHeadGrammar().replace('seq(",", alias($.__parameter', 'seq(",", alias($.__other'),
    optionalHeadGrammar().replace(
      'seq(",", alias($.__parameter, $.parameter), optional($.__tail))',
      'seq(",", alias($.__parameter, $.parameter), optional($.__other))',
    ),
    optionalHeadGrammar().replaceAll("__tail", "visible_tail"),
    optionalHeadGrammar("optional($.item)"),
    optionalHeadGrammar('field("value", optional($.item))'),
    optionalHeadGrammar("alias(optional($.item), $.item)"),
    optionalHeadGrammar("choice($.item, optional($.other))"),
    optionalHeadGrammar("seq($.item, $.__tail)"),
    optionalHeadGrammar("makeItem($)"),
    optionalHeadGrammar("...items"),
    optionalHeadGrammar("$.item", '";"'),
    optionalHeadGrammar("$.item", "$.separator"),
    optionalHeadGrammar().replaceAll("$.__tail", '$["__tail"]'),
    optionalHeadGrammar('kw("PARAMETER", { offset: 5 })').replace(
      'seq(",", kw("PARAMETER", { offset: 5 })',
      'seq(",", kw("PARAMETER", { offset: 6 })',
    ),
    optionalHeadGrammar("token(/a/i)").replace('seq(",", token(/a/i)', 'seq(",", token(/b/i)'),
    optionalHeadGrammar("$.key, $.value").replace(
      'seq(",", $.key, $.value',
      'seq(",", $.value, $.key',
    ),
    ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
      (wrapper) => ({
        name: `head inside ${wrapper} is excluded`,
        code: optionalHeadGrammar().replace(
          'seq("(", optional(seq(alias($.__parameter, $.parameter), optional($.__tail))), ")")',
          `${wrapper}(${wrapper === "prec" ? '"list", ' : wrapper === "prec.dynamic" ? "1, " : ""}optional(seq(alias($.__parameter, $.parameter), optional($.__tail)))${wrapper === "alias" ? ", $.parameters" : ""})`,
        ),
      }),
    ),
    {
      name: "tail precedence must not be moved",
      code: optionalHeadGrammar().replace(
        'seq(",", alias($.__parameter, $.parameter), optional($.__tail))',
        'prec.right(seq(",", alias($.__parameter, $.parameter), optional($.__tail)))',
      ),
    },
    {
      name: "different rule maps cannot share private helpers",
      code: `const a = grammar({rules: {parameters: ($) => optional(seq($.item, optional($.__tail)))}}); const b = grammar({rules: {__tail: ($) => seq(",", $.item, optional($.__tail))}});`,
    },
    optionalHeadGrammar().replace("export default () => (", "const unrelated = ("),
    optionalHeadGrammar().replace(
      "  parameters:",
      "  // oxlint-disable-next-line rule-to-test/optional-list-head-extraction\n  parameters:",
    ),
    optionalHeadGrammar().replace(
      "  __tail:",
      "  // oxlint-disable-next-line rule-to-test/optional-list-head-extraction\n  __tail:",
    ),
  ],
  invalid: [
    {
      name: "FUNCTION definition parameter list regression",
      code: optionalHeadGrammar(),
      errors: [optionalHeadError],
    },
    {
      name: "fields stay on each repeated item",
      code: optionalHeadGrammar('field("value", $.item)'),
      errors: [optionalHeadError],
    },
    {
      name: "optional comma retains its optionality",
      code: optionalHeadGrammar("$.item", 'optional(",")'),
      errors: [optionalHeadError],
    },
    {
      name: "multiple required parts form the head",
      code: optionalHeadGrammar('$.key, "=", field("value", $.value)'),
      errors: [optionalHeadError],
    },
    {
      name: "core grammar map",
      code: `export default grammar({rules: { parameters: ($) => optional(seq($.item, optional($.__tail))), __tail: ($) => seq(",", $.item, optional($.__tail)) }});`,
      errors: [optionalHeadError],
    },
  ],
});

const fieldChoiceSequenceBody =
  'seq(field("action", choice(alias(kw("GET"), $.identifier), alias(kw("REQUEST"), $.identifier))), $.__target_body)';
const fieldChoiceSequenceGrammar = (body = fieldChoiceSequenceBody, use = "$.__branch") => `
export default ({kw}) => ({
  root: ($) => seq(kw("DDE"), ${use}),
  __branch: ($) => ${body},
});`;
const fieldChoiceSequenceError = {
  message: /__branch has one unaliased local use in root.*field-wrapped choice/,
};

new RuleTester().run("single-use-field-choice-sequence", singleUseFieldChoiceSequence, {
  valid: [
    fieldChoiceSequenceGrammar().replaceAll("__branch", "visible"),
    fieldChoiceSequenceGrammar().replaceAll("__branch", "_shared"),
    fieldChoiceSequenceGrammar().replaceAll("__branch", "__branch_body"),
    fieldChoiceSequenceGrammar(fieldChoiceSequenceBody, "seq($.__branch, $.__branch)"),
    fieldChoiceSequenceGrammar(fieldChoiceSequenceBody, "$.other"),
    fieldChoiceSequenceGrammar(fieldChoiceSequenceBody.replace("$.__target_body", "$.__branch")),
    fieldChoiceSequenceGrammar(fieldChoiceSequenceBody, '$["__branch"]'),
    ...[
      "alias($.__branch, $.branch)",
      'field("value", $.__branch)',
      "token($.__branch)",
      "token.immediate($.__branch)",
      "prec.dynamic(1, $.__branch)",
      'alias(seq("X", optional($.__branch)), $.branch)',
    ].map((use) => fieldChoiceSequenceGrammar(fieldChoiceSequenceBody, use)),
    ...[
      "choice($.a, $.b)",
      'seq(field("value", choice($.a, $.b)))',
      'seq(field("value", choice($.a, $.b)), $.x, $.y, $.z)',
      "seq(choice($.a, $.b), $.tail)",
      'seq(field("value", $.a), $.tail)',
      'seq(field("value", choice($.a)), $.tail)',
      'seq(field("value", choice($.a, $.b, $.c, $.d, $.e, $.f)), $.tail)',
      'seq(field("value", choice(optional($.a), $.b)), $.tail)',
      'seq(field("value", choice(seq($.a, $.b), $.c)), $.tail)',
      'seq(field("value", choice(alias($.a, $.__hidden), $.b)), $.tail)',
      'seq(field("value", choice(kw("GET", options), $.b)), $.tail)',
      'seq(field("value", choice(...values)), $.tail)',
      'seq(field("value", choice(token(/x/), $.b)), $.tail)',
      'seq(field("value", choice(prec.dynamic(1, $.a), $.b)), $.tail)',
      'prec.right(seq(field("value", choice($.a, $.b)), $.tail))',
    ].map((body) => fieldChoiceSequenceGrammar(body)),
    ...["inline", "conflicts", "precedences", "supertypes"].map(
      (metadata) =>
        `export default grammar({ ${metadata}: ($) => [$.__branch], rules: { root: ($) => $.__branch, __branch: ($) => ${fieldChoiceSequenceBody} }});`,
    ),
    `const a = grammar({rules: { root: ($) => $.__branch }}); const b = grammar({rules: {__branch: ($) => ${fieldChoiceSequenceBody}}});`,
    fieldChoiceSequenceGrammar().replace("export default ({kw}) => (", "const unrelated = ("),
    fieldChoiceSequenceGrammar().replace(
      "  __branch:",
      "  // oxlint-disable-next-line rule-to-test/single-use-field-choice-sequence\n  __branch:",
    ),
  ],
  invalid: [
    {
      name: "DDE GET and REQUEST regression preserves both aliases",
      code: fieldChoiceSequenceGrammar(),
      errors: [fieldChoiceSequenceError],
    },
    {
      name: "symbol alternatives and surrounding fields",
      code: fieldChoiceSequenceGrammar(
        'seq(field("value", choice($.a, $.b)), field("name", $.identifier), optional($.tail))',
      ),
      errors: [fieldChoiceSequenceError],
    },
    {
      name: "unaliased keywords with static options",
      code: fieldChoiceSequenceGrammar(
        'seq(field("mode", choice(kw("FIRST", {offset: 3}), kw("LAST"))), $.tail)',
      ),
      errors: [fieldChoiceSequenceError],
    },
    {
      name: "optional call site and named precedence stay outside the body",
      code: fieldChoiceSequenceGrammar(
        fieldChoiceSequenceBody,
        'prec("clause", optional($.__branch))',
      ),
      errors: [fieldChoiceSequenceError],
    },
    {
      name: "core rule maps",
      code: `export default grammar({rules: {root: ($) => $.__branch, __branch: ($) => ${fieldChoiceSequenceBody}}});`,
      errors: [fieldChoiceSequenceError],
    },
  ],
});

const expressionAlias = "alias($._value_expression, $.value_expression)";
const expressionAliasRules = (body, definitions = "") =>
  `export default () => ({ items: ($) => ${body}, ${definitions} });`;
const expressionAliasError = {
  message: /alias of _value_expression as value_expression duplicates items/,
};

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [
    {
      filename: "grammar/statements/run.js",
      code: expressionAliasRules(`choice(${expressionAlias}, $.procedure_name)`),
    },
  ],
  invalid: [
    {
      name: "RUN and persistent trigger share the same visible expression alias",
      filename: "grammar/phrases/trigger.js",
      code: expressionAliasRules(`choice($.identifier, ${expressionAlias})`),
      errors: [expressionAliasError],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [
    ...[
      'alias(kw("FLAG"), $.flag)',
      "alias($._flag_keyword, $.flag)",
      "alias($.identifier, $.name)",
      "alias($.a_statement, $.node)",
      "alias($.__private_expression, $.value_expression)",
      "alias($._value_expression, $._hidden)",
      'alias($._value_expression, "value")',
      "alias($.value_expression, $.value_expression)",
      'alias($["_value_expression"], $.value_expression)',
      `token(${expressionAlias})`,
      `token.immediate(${expressionAlias})`,
      `alias(${expressionAlias}, $.outer)`,
    ].map((body) => expressionAliasRules(`seq(${body}, ${body})`)),
    ...["token(/value/i)", 'kw("VALUE")', 'token.immediate("VALUE")', "$.identifier"].map((body) =>
      expressionAliasRules(
        `seq(${expressionAlias}, ${expressionAlias})`,
        `_value_expression: ($) => ${body},`,
      ),
    ),
    `const unrelated = {items: ($) => seq(${expressionAlias}, ${expressionAlias})};`,
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [
    {
      filename: "grammar/statements/run.js",
      code: expressionAliasRules(`choice(
        // oxlint-disable-next-line rule-to-test/shared-expression-alias
        ${expressionAlias}, $.other)`),
    },
    {
      filename: "grammar/phrases/trigger.js",
      code: expressionAliasRules(expressionAlias),
    },
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [
    expressionAliasRules(
      `choice(${expressionAlias}, alias($._other_expression, $.value_expression), alias($._value_expression, $.different))`,
    ),
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [],
  invalid: [
    {
      name: "outer fields and precedence remain at their original call sites",
      code: expressionAliasRules(
        `seq(field("procedure", ${expressionAlias}), prec.right(${expressionAlias}))`,
        '_value_expression: ($) => seq("VALUE", "(", $.value, ")"),',
      ),
      errors: [expressionAliasError],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [],
  invalid: [
    {
      name: "public expression rules are supported",
      code: expressionAliasRules(
        "seq(alias($.binary_expression, $.value), alias($.binary_expression, $.value))",
      ),
      errors: [{ message: /alias of binary_expression as value duplicates items/ }],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-expression-alias", sharedExpressionAlias, {
  valid: [
    {
      filename: "grammar.js",
      code: `export default grammar({rules: { _aliased_value_expression: ($) => ${expressionAlias}, items: ($) => $._aliased_value_expression }});`,
    },
    {
      filename: "grammar/statements/run.js",
      code: expressionAliasRules("choice($._aliased_value_expression, $.procedure_name)"),
    },
    {
      filename: "grammar/phrases/trigger.js",
      code: expressionAliasRules('field("procedure", $._aliased_value_expression)'),
    },
  ],
  invalid: [],
});

const itemAlias = "alias($._menu_item, $.menu_item)";
const itemAliasRules = (body, definitions = "") =>
  `export default () => ({ items: ($) => ${body}, ${definitions} });`;
const itemAliasError = { message: /alias of _menu_item as menu_item duplicates items/ };

resetSharingCandidates();
new RuleTester().run("shared-item-alias", sharedItemAlias, {
  valid: [
    {
      filename: "grammar/statements/menu.js",
      code: itemAliasRules(`choice(${itemAlias}, $.other)`),
    },
  ],
  invalid: [
    {
      name: "MENU and SUB-MENU retain the exact item alias",
      filename: "grammar/statements/submenu.js",
      code: itemAliasRules(`choice(${itemAlias}, $.other)`),
      errors: [itemAliasError],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-item-alias", sharedItemAlias, {
  valid: [
    ...[
      'alias(kw("FLAG"), $.flag_item)',
      "alias($._flag_keyword, $.flag_item)",
      "alias($._lexical_token, $.lexical_item)",
      "alias($._value_expression, $.value_item)",
      "alias($._extent_phrase, $.extent_item)",
      "alias($.__private_item, $.public_item)",
      "alias($.public_item, $.other_item)",
      "alias($._menu_item, $._hidden_item)",
      "alias($._menu_item, $.menu_entry)",
      'alias($._menu_item, "menu_item")',
      'alias($["_menu_item"], $.menu_item)',
      `token(${itemAlias})`,
      `token.immediate(${itemAlias})`,
      `alias(${itemAlias}, $.outer)`,
    ].map((body) => itemAliasRules(`seq(${body}, ${body})`)),
    ...["token(/item/)", 'kw("ITEM")', "$.identifier"].map((body) =>
      itemAliasRules(`seq(${itemAlias}, ${itemAlias})`, `_menu_item: ($) => ${body},`),
    ),
    `const unrelated = {items: ($) => seq(${itemAlias}, ${itemAlias})};`,
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-item-alias", sharedItemAlias, {
  valid: [
    {
      filename: "grammar/statements/menu.js",
      code: itemAliasRules(`choice(
      // oxlint-disable-next-line rule-to-test/shared-item-alias
      ${itemAlias}, $.other)`),
    },
    { filename: "grammar/statements/submenu.js", code: itemAliasRules(itemAlias) },
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-item-alias", sharedItemAlias, {
  valid: [
    itemAliasRules(
      `choice(${itemAlias}, alias($._other_item, $.menu_item), alias($._menu_item, $.different_item))`,
    ),
  ],
  invalid: [],
});

resetSharingCandidates();
new RuleTester().run("shared-item-alias", sharedItemAlias, {
  valid: [],
  invalid: [
    {
      name: "fields and precedence remain at each call site",
      code: itemAliasRules(
        `seq(field("first", ${itemAlias}), prec.right(${itemAlias}))`,
        '_menu_item: ($) => seq("ITEM", $.identifier),',
      ),
      errors: [itemAliasError],
    },
    {
      name: "shared source can have a different name from the item target",
      code: itemAliasRules(
        "seq(alias($._menu_submenu, $.submenu_item), alias($._menu_submenu, $.submenu_item))",
      ),
      errors: [{ message: /alias of _menu_submenu as submenu_item duplicates items/ }],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-item-alias", sharedItemAlias, {
  valid: [
    {
      filename: "grammar/core/common.js",
      code: `export default () => ({_aliased_menu_item: ($) => ${itemAlias}});`,
    },
    {
      filename: "grammar/statements/menu.js",
      code: itemAliasRules("choice($._aliased_menu_item, $.other)"),
    },
    {
      filename: "grammar/statements/submenu.js",
      code: itemAliasRules("choice($._aliased_menu_item, $.other)"),
    },
  ],
  invalid: [],
});

const recordBody =
  'seq(field("record", $._identifier_or_qualified_name), optional($._except_fields), optional($.frame_phrase))';
const fieldBodyRules = (name, body = recordBody) =>
  `export default () => ({ ${name}: ($) => ${body} });`;
const fieldBodyError = { message: /field-led body duplicates __set_record_body/ };

resetSharingCandidates();
new RuleTester().run("shared-field-body", sharedFieldBody, {
  valid: [{ filename: "grammar/statements/set.js", code: fieldBodyRules("__set_record_body") }],
  invalid: [
    {
      name: "SET and UPDATE record body regression",
      filename: "grammar/statements/update.js",
      code: fieldBodyRules("__update_record_body"),
      errors: [fieldBodyError],
    },
  ],
});

for (const [name, body] of [
  ["public_body", recordBody],
  ["__prefix", recordBody],
  ["__record_body", 'seq(field("record", $.record))'],
  ["__record_body", 'seq(field("record", $.record), $.a, $.b, $.c, $.d, $.e)'],
  ["__record_body", 'seq(kw("RECORD"), field("record", $.record))'],
  ["__record_body", 'seq(field("record", token(/record/)), optional($.tail))'],
  ["__record_body", 'seq(field("record", choice($.a, $.b)), optional($.tail))'],
  ["__record_body", 'seq(field("record", $.record), alias($.tail, $.value))'],
  ["__record_body", 'seq(field("record", $.record), ...tails)'],
  ["__record_body", 'seq(field("record", $.record), helper($))'],
  ["__record_body", `prec.right(${recordBody})`],
  ["__record_body", 'seq(field("record", $["record"]), optional($.tail))'],
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-field-body", sharedFieldBody, {
    valid: [
      { filename: "grammar/first.js", code: fieldBodyRules(name, body) },
      { filename: "grammar/second.js", code: fieldBodyRules(name, body) },
    ],
    invalid: [],
  });
}

resetSharingCandidates();
new RuleTester().run("shared-field-body", sharedFieldBody, {
  valid: [
    fieldBodyRules("__record_body", 'seq(field("record", $.record), optional($.__record_body))'),
    `const unrelated = {__record_body: ($) => ${recordBody}};`,
    fieldBodyRules(
      "__record_body",
      'seq(field("table", $._identifier_or_qualified_name), optional($._except_fields), optional($.frame_phrase))',
    ),
    fieldBodyRules(
      "__record_body",
      'seq(field("record", $._identifier_or_qualified_name), optional($.frame_phrase), optional($._except_fields))',
    ),
    fieldBodyRules(
      "__record_body",
      'seq(field("record", $._identifier_or_qualified_name), $._except_fields, optional($.frame_phrase))',
    ),
    fieldBodyRules(
      "__record_body",
      'seq(field("record", $.different), optional($._except_fields), optional($.frame_phrase))',
    ),
  ],
  invalid: [],
});

for (const suppressed of [
  `export default () => ({
    // oxlint-disable-next-line rule-to-test/shared-field-body
    __set_record_body: ($) => ${recordBody},
  });`,
  `export default () => ({__set_record_body: ($) =>
    // oxlint-disable-next-line rule-to-test/shared-field-body
    ${recordBody}
  });`,
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-field-body", sharedFieldBody, {
    valid: [
      { filename: "grammar/first.js", code: suppressed },
      { filename: "grammar/second.js", code: fieldBodyRules("__update_record_body") },
    ],
    invalid: [],
  });
}

resetSharingCandidates();
new RuleTester().run("shared-field-body", sharedFieldBody, {
  valid: [],
  invalid: [
    {
      name: "local duplicates ignore formatting and comments",
      code: `export default grammar({rules: {__set_record_body: ($) => ${recordBody}, __update_record_body: ($) => seq(field("record", $._identifier_or_qualified_name), /* same tail */ optional($._except_fields), optional($.frame_phrase))}});`,
      errors: [fieldBodyError],
    },
  ],
});

resetSharingCandidates();
new RuleTester().run("shared-field-body", sharedFieldBody, {
  valid: [
    { filename: "grammar/core/common.js", code: fieldBodyRules("_set_update_record_body") },
    {
      filename: "grammar/statements/set.js",
      code: fieldBodyRules("__set_record_body", "$._set_update_record_body"),
    },
    {
      filename: "grammar/statements/update.js",
      code: fieldBodyRules("__update_record_body", "$._set_update_record_body"),
    },
  ],
  invalid: [],
});

const modifierFieldPair = 'optional(kw("CLASS")), field("type", $._type_or_string)';
const modifierFieldRules = (first, second) =>
  `export default ({kw}) => ({first: ($) => ${first}, second: ($) => ${second}});`;
const modifierFieldError = {
  message: /optional modifier and required field repeat a pair in first/,
};

new RuleTester().run("optional-modifier-field", optionalModifierField, {
  valid: [
    modifierFieldRules(
      `seq(${modifierFieldPair})`,
      'seq(optional(kw("OTHER")), field("type", $._type_or_string))',
    ),
    modifierFieldRules(
      `seq(${modifierFieldPair})`,
      'seq(optional(kw("CLASS")), field("other", $._type_or_string))',
    ),
    modifierFieldRules(
      `seq(${modifierFieldPair})`,
      'seq(optional(kw("CLASS")), field("type", $.other))',
    ),
    modifierFieldRules(
      `seq(${modifierFieldPair})`,
      'seq(field("type", $._type_or_string), optional(kw("CLASS")))',
    ),
    modifierFieldRules(
      `seq(${modifierFieldPair})`,
      'seq(optional(kw("CLASS")), optional(field("type", $._type_or_string)))',
    ),
    modifierFieldRules(
      'seq(optional(kw("CLASS", {offset: 3})), field("type", $.type))',
      'seq(optional(kw("CLASS", {offset: 4})), field("type", $.type))',
    ),
    ...[
      'seq(optional(kw("CLASS", options)), field("type", $.type))',
      'seq(optional($.identifier), field("type", $.type))',
      'seq(optional(alias(kw("CLASS"), $.flag)), field("type", $.type))',
      'seq(kw("CLASS"), field("type", $.type))',
      'seq(optional(kw("CLASS")), field("type", choice($.a, $.b)))',
      'seq(optional(kw("CLASS")), field("type", $["type"]))',
      'seq(optional(kw("CLASS")), field("type", token(/x/)))',
      'seq(optional(kw("CLASS")), ":", field("type", $.type))',
      'seq(optional(kw("CLASS")), ...fields)',
      `alias(seq(${modifierFieldPair}), $.type)`,
      `token(seq(${modifierFieldPair}))`,
      `token.immediate(seq(${modifierFieldPair}))`,
      `prec("type", seq(${modifierFieldPair}))`,
      `prec.left(seq(${modifierFieldPair}))`,
      `prec.right(seq(${modifierFieldPair}))`,
      `prec.dynamic(1, seq(${modifierFieldPair}))`,
    ].map((body) => modifierFieldRules(body, body)),
    `export default ({kw}) => ({first: ($) => choice(seq(${modifierFieldPair}), seq("X", ${modifierFieldPair}))});`,
    `const a = grammar({rules: {first: ($) => seq(${modifierFieldPair})}}); const b = grammar({rules: {second: ($) => seq(${modifierFieldPair})}});`,
    `const unrelated = {first: ($) => seq(${modifierFieldPair}), second: ($) => seq(${modifierFieldPair})};`,
    `export default ({kw}) => ({
      // oxlint-disable-next-line rule-to-test/optional-modifier-field
      first: ($) => seq(${modifierFieldPair}),
      second: ($) => seq(${modifierFieldPair}),
    });`,
    `export default ({kw}) => ({first: ($) => seq(
      // oxlint-disable-next-line rule-to-test/optional-modifier-field
      ${modifierFieldPair}), second: ($) => seq(${modifierFieldPair})});`,
    modifierFieldRules(
      "seq(optional($._as_keyword), $.__type)",
      "seq($.__type, optional($.extent))",
    ),
  ],
  invalid: [
    {
      name: "CLASS property and parameter type regression",
      code: modifierFieldRules(
        `seq(optional($._as_keyword), ${modifierFieldPair})`,
        `seq(${modifierFieldPair}, optional($.extent))`,
      ),
      errors: [modifierFieldError],
    },
    {
      name: "existing exact pair helper can be reused",
      code: modifierFieldRules(
        `seq(${modifierFieldPair})`,
        `seq(${modifierFieldPair}, optional($.extent))`,
      ),
      errors: [modifierFieldError],
    },
    {
      name: "shared keyword references",
      code: modifierFieldRules(
        'seq(optional($._class_keyword), field("type", $.type))',
        'seq("AS", optional($._class_keyword), field("type", $.type))',
      ),
      errors: [modifierFieldError],
    },
    {
      name: "core grammar maps",
      code: `export default grammar({rules: {first: ($) => seq(${modifierFieldPair}), second: ($) => seq("AS", ${modifierFieldPair})}});`,
      errors: [modifierFieldError],
    },
    {
      name: "formatting and comments do not affect identity",
      code: modifierFieldRules(
        `seq(${modifierFieldPair})`,
        'seq(optional(kw("CLASS")), /* field */ field( "type", $._type_or_string ))',
      ),
      errors: [modifierFieldError],
    },
  ],
});

const precedenceValueBody =
  'prec.left(seq(field("value", $._expression), optional($.format_phrase), optional(seq(choice($._at_keyword, $._to_keyword), field("position", $._expression)))))';
const precedenceValueRules = (body = precedenceValueBody, use = "$.__item") =>
  `export default () => ({root: ($) => choice(${use}, $.other), __item: ($) => ${body}});`;
const precedenceValueError = {
  message: /__item has one unaliased local use in root.*precedence-wrapped field-led item/,
};

new RuleTester().run("single-use-precedence-value", singleUsePrecedenceValue, {
  valid: [
    precedenceValueRules().replaceAll("__item", "visible"),
    precedenceValueRules().replaceAll("__item", "_shared"),
    precedenceValueRules().replaceAll("__item", "__item_body"),
    precedenceValueRules(precedenceValueBody, "seq($.__item, $.__item)"),
    precedenceValueRules(precedenceValueBody, "$.other"),
    precedenceValueRules(precedenceValueBody, '$["__item"]'),
    precedenceValueRules(precedenceValueBody.replace("$._expression", "$.__item")),
    ...[
      "alias($.__item, $.item)",
      'field("value", $.__item)',
      "token($.__item)",
      "token.immediate($.__item)",
      "prec.dynamic(1, $.__item)",
      'alias(seq("X", optional($.__item)), $.item)',
    ].map((use) => precedenceValueRules(precedenceValueBody, use)),
    ...[
      'seq(field("value", $._expression), optional(seq("AT", $.position)))',
      'prec.left(seq(field("value", $._expression), optional($.tail)))',
      'prec.left(seq(kw("ITEM"), optional(seq("AT", field("value", $.value)))))',
      'prec.left(seq(field("value", choice($.a, $.b)), optional(seq("AT", $.position))))',
      'prec.left(seq(field("value", $.value)))',
      'prec.left(seq(field("value", $.value), $.a, $.b, optional(seq("AT", $.position))))',
      'prec.left(seq(field("value", $.value), optional(prec.dynamic(1, $.tail))))',
      'prec.left(seq(field("value", $.value), helper($)))',
      'prec.left(seq(field("value", $.value), ...tails))',
      'prec.dynamic(1, seq(field("value", $.value), optional(seq("AT", $.position))))',
      'prec.left(seq(field("value", $.value), choice($.a, $.b, $.c, $.d, $.e, $.f, $.g, $.h, $.i, $.j, $.k, $.l, $.m, $.n, $.o, $.p, $.q, $.r, $.s, $.t)))',
    ].map((body) => precedenceValueRules(body)),
    ...["inline", "conflicts", "precedences", "supertypes"].map(
      (metadata) =>
        `export default grammar({${metadata}: ($) => [$.__item], rules: {root: ($) => $.__item, __item: ($) => ${precedenceValueBody}}});`,
    ),
    `const a = grammar({rules: {root: ($) => $.__item}}); const b = grammar({rules: {__item: ($) => ${precedenceValueBody}}});`,
    `const unrelated = {root: ($) => $.__item, __item: ($) => ${precedenceValueBody}};`,
    `export default () => ({root: ($) => $.__item,
      // oxlint-disable-next-line rule-to-test/single-use-precedence-value
      __item: ($) => ${precedenceValueBody}});`,
  ],
  invalid: [
    {
      name: "PUT expression-item regression",
      code: precedenceValueRules(),
      errors: [precedenceValueError],
    },
    {
      name: "right associativity is preserved",
      code: precedenceValueRules(precedenceValueBody.replace("prec.left", "prec.right")),
      errors: [precedenceValueError],
    },
    {
      name: "named precedence is preserved",
      code: precedenceValueRules(precedenceValueBody.replace("prec.left(", 'prec("value", ')),
      errors: [precedenceValueError],
    },
    {
      name: "optional caller retains its optionality",
      code: precedenceValueRules(precedenceValueBody, "optional($.__item)"),
      errors: [precedenceValueError],
    },
    {
      name: "core rule map",
      code: `export default grammar({rules: {root: ($) => $.__item, __item: ($) => ${precedenceValueBody}}});`,
      errors: [precedenceValueError],
    },
  ],
});

const choiceAliasBody =
  'seq(choice(kw("EACH"), kw("FIRST"), kw("LAST")), alias($.__record, $.record_phrase))';
const choiceAliasRules = (body = choiceAliasBody, use = "$.__item") =>
  `export default ({kw}) => ({root: ($) => seq(",", ${use}), __item: ($) => ${body}});`;
const choiceAliasError = {
  message: /__item has one unaliased local use in root.*direct choice and symbol alias/,
};

new RuleTester().run("single-use-choice-alias-sequence", singleUseChoiceAliasSequence, {
  valid: [
    choiceAliasRules().replaceAll("__item", "public_item"),
    choiceAliasRules().replaceAll("__item", "_shared"),
    choiceAliasRules().replaceAll("__item", "__item_body"),
    choiceAliasRules(choiceAliasBody, "seq($.__item, $.__item)"),
    choiceAliasRules(choiceAliasBody, "$.other"),
    choiceAliasRules(choiceAliasBody, '$["__item"]'),
    choiceAliasRules(choiceAliasBody.replace("$.__record", "$.__item")),
    ...[
      "alias($.__item, $.item)",
      'field("value", $.__item)',
      "token($.__item)",
      "token.immediate($.__item)",
      "prec.dynamic(1, $.__item)",
      'alias(seq("X", optional($.__item)), $.item)',
    ].map((use) => choiceAliasRules(choiceAliasBody, use)),
    ...[
      "seq(choice($.a, $.b), $.record)",
      "seq($.a, alias($.__record, $.record_phrase))",
      'seq(choice($.a, $.b), alias(kw("FLAG"), $.flag))',
      "seq(choice($.a, $.b), alias($._flag_keyword, $.flag))",
      "seq(choice($.a, $.b), alias($.record, $.record))",
      "seq(choice($.a, $.b), alias($.__record, $._record))",
      'seq(choice($.a, $.b), alias($.__record, "record"))',
      'seq(choice($.a, $.b), alias($["__record"], $.record))',
      "seq(choice($.a), alias($.__record, $.record))",
      "seq(choice($.a, $.b, $.c, $.d, $.e, $.f), alias($.__record, $.record))",
      "seq(choice(seq($.a, $.b), $.c), alias($.__record, $.record))",
      'seq(choice(kw("EACH", options), $.b), alias($.__record, $.record))',
      "seq(choice(...values), alias($.__record, $.record))",
      "seq(choice($.a, $.b), alias($.__record, $.record), $.x, $.y)",
      `prec.right(${choiceAliasBody})`,
    ].map((body) => choiceAliasRules(body)),
    ...["inline", "conflicts", "precedences", "supertypes"].map(
      (metadata) =>
        `export default grammar({${metadata}: ($) => [$.__item], rules: {root: ($) => $.__item, __item: ($) => ${choiceAliasBody}}});`,
    ),
    `const a = grammar({rules: {root: ($) => $.__item}}); const b = grammar({rules: {__item: ($) => ${choiceAliasBody}}});`,
    `const unrelated = {root: ($) => $.__item, __item: ($) => ${choiceAliasBody}};`,
    `export default ({kw}) => ({root: ($) => $.__item,
      // oxlint-disable-next-line rule-to-test/single-use-choice-alias-sequence
      __item: ($) => ${choiceAliasBody}});`,
  ],
  invalid: [
    {
      name: "OPEN QUERY join item regression",
      code: choiceAliasRules(),
      errors: [choiceAliasError],
    },
    {
      name: "alias before choice retains order",
      code: choiceAliasRules("seq(alias($.__record, $.record_phrase), choice($.a, $.b))"),
      errors: [choiceAliasError],
    },
    {
      name: "fields and keyword options are retained",
      code: choiceAliasRules(
        'seq(choice(kw("EACH", {offset: 2}), kw("FIRST")), alias($.__record, $.record_phrase), optional(field("name", $.identifier)))',
      ),
      errors: [choiceAliasError],
    },
    {
      name: "call site precedence is retained",
      code: choiceAliasRules(choiceAliasBody, "prec.right(seq($.__item, optional($.tail)))"),
      errors: [choiceAliasError],
    },
    {
      name: "core rule map",
      code: `export default grammar({rules: {root: ($) => $.__item, __item: ($) => ${choiceAliasBody}}});`,
      errors: [choiceAliasError],
    },
  ],
});

const signatureChunk =
  'field("name", $._routine_name), optional(kw("RETURNS", {offset: 5})), $.__type';
const fieldChunkRules = (first, second) =>
  `export default ({kw}) => ({first: ($) => ${first}, second: ($) => ${second}});`;
const fieldChunkError = { message: /three field-led elements repeat a chunk in first/ };

new RuleTester().run("shared-field-chunk", sharedFieldChunk, {
  valid: [
    ...[
      signatureChunk.replace('"name"', '"other"'),
      signatureChunk.replace("$._routine_name", "$.identifier"),
      signatureChunk.replace("offset: 5", "offset: 6"),
      signatureChunk.replace("$.__type", "$.__other_type"),
      'field("name", $._routine_name), $.__type, optional(kw("RETURNS", {offset: 5}))',
      'field("name", $._routine_name), kw("RETURNS", {offset: 5}), $.__type',
    ].map((chunk) =>
      fieldChunkRules(`seq("FUNCTION", ${signatureChunk})`, `seq(${chunk}, $.tail)`),
    ),
    ...[
      'field("name", choice($.a, $.b)), optional(kw("RETURNS")), $.type',
      'field("name", $["name"]), optional(kw("RETURNS")), $.type',
      'field("name", $.name), optional(kw("RETURNS", options)), $.type',
      'field("name", $.name), optional(kw("RETURNS")), alias($.type, $.value)',
      'field("name", $.name), optional(kw("RETURNS")), helper($)',
      'field("name", $.name), optional(kw("RETURNS")), ...values',
    ].map((chunk) => fieldChunkRules(`seq("FUNCTION", ${chunk})`, `seq(${chunk}, $.tail)`)),
    fieldChunkRules(`seq(${signatureChunk})`, `seq(${signatureChunk}, $.tail)`),
    ...["token", "token.immediate", "prec.left", "prec.right"].map((wrapper) =>
      fieldChunkRules(
        `${wrapper}(seq("FUNCTION", ${signatureChunk}))`,
        `${wrapper}(seq(${signatureChunk}, $.tail))`,
      ),
    ),
    fieldChunkRules(
      `prec("type", seq("FUNCTION", ${signatureChunk}))`,
      `seq(${signatureChunk}, $.tail)`,
    ),
    fieldChunkRules(
      `prec.dynamic(1, seq("FUNCTION", ${signatureChunk}))`,
      `seq(${signatureChunk}, $.tail)`,
    ),
    fieldChunkRules(
      `alias(seq("FUNCTION", ${signatureChunk}), $.signature)`,
      `seq(${signatureChunk}, $.tail)`,
    ),
    `export default ({kw}) => ({first: ($) => choice(seq("FUNCTION", ${signatureChunk}), seq(${signatureChunk}, $.tail))});`,
    `const a = grammar({rules: {first: ($) => seq("FUNCTION", ${signatureChunk})}}); const b = grammar({rules: {second: ($) => seq(${signatureChunk}, $.tail)}});`,
    `const unrelated = {first: ($) => seq("FUNCTION", ${signatureChunk}), second: ($) => seq(${signatureChunk}, $.tail)};`,
    `export default ({kw}) => ({
      // oxlint-disable-next-line rule-to-test/shared-field-chunk
      first: ($) => seq("FUNCTION", ${signatureChunk}),
      second: ($) => seq(${signatureChunk}, $.tail),
    });`,
    `export default ({kw}) => ({first: ($) => seq("FUNCTION",
      // oxlint-disable-next-line rule-to-test/shared-field-chunk
      ${signatureChunk}), second: ($) => seq(${signatureChunk}, $.tail)});`,
    `export default ({kw}) => ({__signature: ($) => seq(${signatureChunk}), first: ($) => seq("FUNCTION", $.__signature, $.a), second: ($) => seq($.__signature, $.b)});`,
  ],
  invalid: [
    {
      name: "FUNCTION definition and forward signature regression",
      code: fieldChunkRules(
        `seq(kw("FUNCTION"), ${signatureChunk}, $.body)`,
        `seq(${signatureChunk}, optional($.tail))`,
      ),
      errors: [fieldChunkError],
    },
    {
      name: "different surrounding tokens do not enter the chunk",
      code: fieldChunkRules(
        `seq("BEFORE", ${signatureChunk}, "AFTER")`,
        `seq("OTHER", ${signatureChunk}, "END")`,
      ),
      errors: [fieldChunkError],
    },
    {
      name: "core grammar maps",
      code: `export default grammar({rules: {first: ($) => seq("FUNCTION", ${signatureChunk}), second: ($) => seq(${signatureChunk}, $.tail)}});`,
      errors: [fieldChunkError],
    },
    {
      name: "formatting and comments are ignored",
      code: fieldChunkRules(
        `seq("FUNCTION", ${signatureChunk})`,
        'seq(field("name", $._routine_name), /* marker */ optional(kw("RETURNS", { offset: 5 })), $.__type, $.tail)',
      ),
      errors: [fieldChunkError],
    },
  ],
});

const choiceHeadGrammar = (item = 'field("field", $._name)', separator = '","') => `
export default ({kw}) => ({
  root: ($) => seq("(", choice(kw("ROWID"), seq(${item}, optional($.__tail))), ")"),
  __tail: ($) => seq(${separator}, ${item}, optional($.__tail)),
});`;
const choiceHeadError = { message: /choice branch repeats the item and continuation in __tail/ };

new RuleTester().run("choice-list-head-extraction", choiceListHeadExtraction, {
  valid: [
    `export default () => ({root: ($) => choice("ROWID", $.__head), __head: ($) => seq($.item, optional($.__tail)), __tail: ($) => seq(",", $.__head)});`,
    choiceHeadGrammar().replace('choice(kw("ROWID"), seq', "optional(seq"),
    choiceHeadGrammar().replace('choice(kw("ROWID"), seq(', 'choice(kw("ROWID"), seq("PREFIX",'),
    choiceHeadGrammar().replace('seq(",", field("field"', 'seq(",", field("different"'),
    choiceHeadGrammar().replace(
      'seq(",", field("field", $._name)',
      'seq(",", field("field", $.other)',
    ),
    choiceHeadGrammar().replace(
      'seq(",", field("field", $._name), optional($.__tail))',
      'seq(",", field("field", $._name), optional($.__other))',
    ),
    choiceHeadGrammar().replaceAll("__tail", "visible_tail"),
    choiceHeadGrammar().replaceAll("$.__tail", '$["__tail"]'),
    choiceHeadGrammar("optional($.item)"),
    choiceHeadGrammar('field("field", optional($.item))'),
    choiceHeadGrammar("alias(optional($.item), $.value)"),
    choiceHeadGrammar("choice($.item, optional($.other))"),
    choiceHeadGrammar("seq($.item, $.__tail)"),
    choiceHeadGrammar("makeItem($)"),
    choiceHeadGrammar("...items"),
    choiceHeadGrammar("$.item", '";"'),
    choiceHeadGrammar("$.item", "$.separator"),
    choiceHeadGrammar("alias($.item, $.value)").replace(
      'seq(",", alias($.item, $.value)',
      'seq(",", alias($.item, $.other)',
    ),
    choiceHeadGrammar('kw("FIELD", {offset: 3})').replace(
      'seq(",", kw("FIELD", {offset: 3})',
      'seq(",", kw("FIELD", {offset: 4})',
    ),
    ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
      (wrapper) => ({
        name: `choice under ${wrapper} is excluded`,
        code: choiceHeadGrammar().replace(
          'seq("(", choice(kw("ROWID"), seq(field("field", $._name), optional($.__tail))), ")")',
          `${wrapper}(${wrapper === "prec" ? '"list", ' : wrapper === "prec.dynamic" ? "1, " : ""}choice(kw("ROWID"), seq(field("field", $._name), optional($.__tail)))${wrapper === "alias" ? ", $.list" : ""})`,
        ),
      }),
    ),
    choiceHeadGrammar().replace(
      'seq(",", field("field", $._name), optional($.__tail))',
      'prec.right(seq(",", field("field", $._name), optional($.__tail)))',
    ),
    `const a = grammar({rules: {root: ($) => choice("ROWID", seq($.item, optional($.__tail)))}}); const b = grammar({rules: {__tail: ($) => seq(",", $.item, optional($.__tail))}});`,
    choiceHeadGrammar().replace("export default ({kw}) => (", "const unrelated = ("),
    choiceHeadGrammar().replace(
      "  root:",
      "  // oxlint-disable-next-line rule-to-test/choice-list-head-extraction\n  root:",
    ),
    choiceHeadGrammar().replace(
      "  __tail:",
      "  // oxlint-disable-next-line rule-to-test/choice-list-head-extraction\n  __tail:",
    ),
  ],
  invalid: [
    { name: "DATA-SOURCE KEYS regression", code: choiceHeadGrammar(), errors: [choiceHeadError] },
    {
      name: "named aliases are preserved",
      code: choiceHeadGrammar("alias($.item, $.value)"),
      errors: [choiceHeadError],
    },
    {
      name: "optional comma remains optional",
      code: choiceHeadGrammar("$.item", 'optional(",")'),
      errors: [choiceHeadError],
    },
    {
      name: "multiple item parts",
      code: choiceHeadGrammar('$.key, "=", field("value", $.value)'),
      errors: [choiceHeadError],
    },
    {
      name: "core rule maps",
      code: `export default grammar({rules: {root: ($) => choice("ROWID", seq($.item, optional($.__tail))), __tail: ($) => seq(",", $.item, optional($.__tail))}});`,
      errors: [choiceHeadError],
    },
  ],
});

console.log("✓ Optimizer lint plugin tests passed successfully");
