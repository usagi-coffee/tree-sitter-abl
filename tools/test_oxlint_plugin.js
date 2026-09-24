import { RuleTester } from "oxlint/plugins-dev";

import {
  sharedRepeatedSignature,
  leftRecursiveList,
  recursiveItemInline,
  recursiveItemExtraction,
  recursiveChoiceItemExtraction,
  optionalBlockBodyExtraction,
  commonSuffixHeadExtraction,
  sharedPrecedenceSequenceInline,
  sharedClosingDelimiterInline,
  sharedKeywordFieldInline,
  forwardedAliasReuse,
  closingDelimiterHoist,
  choiceProductExtraction,
  sharedFieldMarker,
  redundantInheritedField,
  singleUseFieldSequence,
  sharedValuedFragment,
  sharedDelimiterFieldPrefix,
  sharedAssignmentClause,
  shortPrivatePrefix,
  sharedDeclarationTail,
  sharedBlockClose,
  optionalRepetitionInline,
  sharedCommaContinuation,
  nullableSlotList,
  singleUseFieldChoice,
  recursiveContinuationInline,
  sharedCommaField,
  closingDelimiterWrapper,
  singleUseDelimitedSequence,
  orderedOptionalChain,
  precedenceListHeadExtraction,
  fieldListHeadExtraction,
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
  singleUseSharedChoiceInline,
  sharedKeywordInline,
  singleUseSharedSequenceInline,
  sharedKeywordAliasChoiceInline,
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

const compoundRecursiveItem = `seq(field("field", $._assignable), optional(seq("=", field("value", $._expression))), optional($._when_phrase), optional($.__items))`;
new RuleTester().run("recursive-item-extraction", recursiveItemExtraction, {
  valid: [
    `export default () => ({ __items: ($) => seq($.__item, optional($.__items)), __item: ($) => seq(field("field", $._assignable), optional($._when_phrase)) });`,
    `export default () => ({ items: ($) => seq(field("field", $.name), optional($.flag), optional($.items)) });`,
    `export default () => ({ __items: ($) => prec.right(${compoundRecursiveItem}) });`,
    `export default () => ({ __items: ($) => seq(optional(field("field", $.name)), optional($.flag), optional($.__items)) });`,
    `export default () => ({ __items: ($) => seq(field("field", $.__items), optional($.flag), optional($.__items)) });`,
    `export default () => ({ __items: ($) => seq(field("field", $.name), optional($.__items)) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/recursive-item-extraction
      __items: ($) => ${compoundRecursiveItem},
    });`,
  ],
  invalid: [
    {
      name: "ASSIGN INPUT field with optional value and WHEN",
      code: `export default () => ({ __items: ($) => ${compoundRecursiveItem} });`,
      errors: [{ message: /__items repeats a compound field item before optional self-recursion/ }],
    },
  ],
});

const recursiveChoiceItem = `choice(seq(kw("TARGET"), field("target", $.value)), seq(kw("SOURCE"), field("source", $.value)))`;
new RuleTester().run("recursive-choice-item-extraction", recursiveChoiceItemExtraction, {
  valid: [
    `export default () => ({ _options: ($) => prec.right(seq($._option, optional($._options))), _option: ($) => ${recursiveChoiceItem} });`,
    `export default () => ({ options: ($) => seq(${recursiveChoiceItem}, optional($.options)) });`,
    `export default () => ({ _options: ($) => prec.dynamic(1, seq(${recursiveChoiceItem}, optional($._options))) });`,
    `export default () => ({ _options: ($) => seq(choice(optional($.a), seq("B", $.b)), optional($._options)) });`,
    `export default () => ({ _options: ($) => seq(choice(seq("A", $._options), $.b), optional($._options)) });`,
    `export default () => ({ _options: ($) => seq(${recursiveChoiceItem}, optional(seq(",", $._options))) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/recursive-choice-item-extraction
      _options: ($) => prec.right(seq(${recursiveChoiceItem}, optional($._options))),
    });`,
  ],
  invalid: [
    {
      name: "CONVERT options retain list precedence after extraction",
      code: `export default () => ({ _options: ($) => prec.right(seq(${recursiveChoiceItem}, optional($._options))) });`,
      errors: [{ message: /_options repeats a compound choice before optional self-recursion/ }],
    },
    {
      name: "unwrapped recursive choices are candidates too",
      code: `export default () => ({ _options: ($) => seq(${recursiveChoiceItem}, optional($._options)) });`,
      errors: [{ message: /_options repeats a compound choice before optional self-recursion/ }],
    },
  ],
});

new RuleTester().run("optional-block-body-extraction", optionalBlockBodyExtraction, {
  valid: [
    `export default () => ({ _block: ($) => seq(optional($.options), optional($.stream), $.body) });`,
    `export default () => ({ _block: ($) => seq("FOR", $.record, optional($.options), $.body) });`,
    `export default () => ({ _block: ($) => seq("FOR", optional($.options), optional($.stream), optional($.body)) });`,
    `export default () => ({ _block: ($) => seq("FOR", optional($.options), optional($.stream), $._terminator) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/optional-block-body-extraction
      _block: ($) => seq("FOR", optional($.options), optional($.stream), $.body),
    });`,
  ],
  invalid: [
    {
      name: "FOR block options and stream clause before required body",
      code: `export default () => ({ __for_body: ($) => seq($._for_keyword, $.__for_record_or_variables, optional($.__for_while_transaction_tail), optional($._block_options), optional($.__for_with_stream_io_phrase), $.body) });`,
      errors: [{ message: /two optional clauses and required body/ }],
    },
    {
      name: "named body helper with enclosing precedence",
      code: `export default () => ({ _block: ($) => prec.right(seq("DO", optional($.a), optional($.b), $.__loop_body)) });`,
      errors: [{ message: /two optional clauses and required __loop_body/ }],
    },
  ],
});

const formItemSuffix = `optional(repeat1(choice($.at_phrase, seq(kw("TO"), field("to", $._expression)), $.display_option)))`;
new RuleTester().run("common-suffix-head-extraction", commonSuffixHeadExtraction, {
  valid: [
    `export default () => ({ item: ($) => seq($.__head, ${formItemSuffix}), __head: ($) => choice($.macro, field("value", $.string)) });`,
    `export default () => ({ item: ($) => choice(seq($.a, ${formItemSuffix}), $.other, seq($.b, ${formItemSuffix})) });`,
    `export default () => ({ item: ($) => choice(seq(optional($.a), ${formItemSuffix}), seq($.b, ${formItemSuffix})) });`,
    `export default () => ({ item: ($) => choice(seq(field("value", optional($.a)), ${formItemSuffix}), seq($.b, ${formItemSuffix})) });`,
    `export default () => ({ item: ($) => choice(seq($.a, optional(field("left", $.value))), seq($.b, optional(field("right", $.value)))) });`,
    `export default () => ({ item: ($) => choice(seq($.a, $.tail), seq($.b, $.tail)) });`,
    `export default () => ({ item: ($) => token(choice(seq("A", optional(repeat1("x"))), seq("B", optional(repeat1("x"))))) });`,
    `export default () => ({ item: ($) =>
      // oxlint-disable-next-line rule-to-test/common-suffix-head-extraction
      choice(seq($.a, ${formItemSuffix}), seq($.b, ${formItemSuffix})),
    });`,
  ],
  invalid: [
    {
      name: "FRAME macro and literal alternatives share their complete suffix",
      code: `export default () => ({ item: ($) => choice(seq($.preprocessor_name, ${formItemSuffix}), seq(field("value", $.string_literal), ${formItemSuffix}), seq(field("value", $.number_literal), ${formItemSuffix})) });`,
      errors: [
        {
          message:
            /Adjacent sequence alternatives have different heads and an exact compound suffix/,
        },
      ],
    },
  ],
});

const displaySpacePhrase = `prec.left(seq(kw("SPACE"), optional(field("space", seq($._parenthesized_expression_prefix, ")")))))`;
new RuleTester().run("shared-precedence-sequence-inline", sharedPrecedenceSequenceInline, {
  valid: [
    `export default grammar({ inline: ($) => [$._space], rules: { _space: ($) => ${displaySpacePhrase} } });`,
    `export default () => ({ space: ($) => ${displaySpacePhrase} });`,
    `export default () => ({ __space: ($) => ${displaySpacePhrase} });`,
    `export default () => ({ _space: ($) => seq(kw("SPACE"), optional($.value)) });`,
    `export default () => ({ _space: ($) => prec.dynamic(1, seq(kw("SPACE"), optional($.value))) });`,
    `export default () => ({ _space: ($) => prec.left(priority, seq(kw("SPACE"), optional($.value))) });`,
    `export default () => ({ _space: ($) => prec.left(seq(kw("SPACE"), optional($._space))) });`,
    `export default () => ({ _space: ($) => prec.left(choice(kw("SPACE"), $.value)) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/shared-precedence-sequence-inline
      _space: ($) => ${displaySpacePhrase},
    });`,
  ],
  invalid: [
    {
      name: "DISPLAY SPACE shared precedence sequence",
      code: `export default () => ({ _display_space_phrase: ($) => ${displaySpacePhrase} });`,
      errors: [
        { message: /_display_space_phrase wraps a nonrecursive sequence in static precedence/ },
      ],
    },
    {
      name: "nested static precedence wrappers are retained",
      code: `export default () => ({ _space: ($) => prec("space", ${displaySpacePhrase}) });`,
      errors: [{ message: /_space wraps a nonrecursive sequence in static precedence/ }],
    },
  ],
});

new RuleTester().run("shared-closing-delimiter-inline", sharedClosingDelimiterInline, {
  valid: [
    `export default grammar({ inline: ($) => [$._value], rules: { _value: ($) => seq($._value_prefix, ")") } });`,
    `export default () => ({ value: ($) => seq($._value_prefix, ")") });`,
    `export default () => ({ __value: ($) => seq($._value_prefix, ")") });`,
    `export default () => ({ _value: ($) => seq($._value_prefix, ")", $.tail) });`,
    `export default () => ({ _value: ($) => seq($.visible_prefix, ")") });`,
    `export default () => ({ _value: ($) => seq($._value_prefix, ";") });`,
    `export default () => ({ _value: ($) => seq($._item, ")") });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/shared-closing-delimiter-inline
      _value: ($) => seq($._value_prefix, ")"),
    });`,
  ],
  invalid: [
    {
      name: "shared parenthesized value used by FORM and PROMPT-FOR",
      code: `export default () => ({ _parenthesized_value: ($) => seq($._parenthesized_expression_prefix, ")") });`,
      errors: [
        { message: /_parenthesized_value appends.*hidden prefix _parenthesized_expression_prefix/ },
      ],
    },
    {
      name: "bracket closing wrapper",
      code: `export default () => ({ _value: ($) => seq($._value_prefix, "]") });`,
      errors: [{ message: /_value appends.*hidden prefix _value_prefix/ }],
    },
  ],
});

const keywordFieldBody = `seq(kw("TABLE-HANDLE"), field("table_handle", $.identifier))`;
new RuleTester().run("shared-keyword-field-inline", sharedKeywordFieldInline, {
  valid: [
    `export default grammar({ inline: ($) => [$._value], rules: { _value: ($) => ${keywordFieldBody} } });`,
    `export default () => ({ value: ($) => ${keywordFieldBody} });`,
    `export default () => ({ __value: ($) => ${keywordFieldBody} });`,
    `export default () => ({ _value: ($) => ${keywordFieldBody}, root: ($) => alias($._value, $.value) });`,
    `export default () => ({ _value: ($) => seq(kw("TABLE-HANDLE", options), field("value", $.identifier)) });`,
    `export default () => ({ _value: ($) => seq(kw("TABLE-HANDLE"), field("value", choice($.a, $.b))) });`,
    `export default () => ({ _value: ($) => seq(kw("TABLE-HANDLE"), field("value", $._value)) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/shared-keyword-field-inline
      _value: ($) => ${keywordFieldBody},
    });`,
  ],
  invalid: [
    {
      name: "TABLE-HANDLE value shared by signature grammars",
      code: `export default () => ({ _table_handle_value: ($) => ${keywordFieldBody} });`,
      errors: [{ message: /_table_handle_value is a shared keyword-plus-field helper/ }],
    },
    {
      name: "abbreviation options remain at the keyword",
      code: `export default () => ({ _initial: ($) => seq(kw("INITIAL", {offset: 4}), field("initial", $.value)) });`,
      errors: [{ message: /_initial is a shared keyword-plus-field helper/ }],
    },
  ],
});

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

new RuleTester().run("single-use-shared-choice-inline", singleUseSharedChoiceInline, {
  valid: [
    `export default () => ({ _value: ($) => choice($.a, $.b), first: ($) => $._value, second: ($) => $._value });`,
    `export default () => ({ _value: ($) => choice($.a, $.b), first: ($) => alias($._value, $.value) });`,
    `export default () => ({ __value: ($) => choice($.a, $.b), first: ($) => $.__value });`,
    `export default () => ({ value: ($) => choice($.a, $.b), first: ($) => $.value });`,
    `export default grammar({ inline: ($) => [$._value], rules: { _value: ($) => choice($.a, $.b), first: ($) => $._value } });`,
    `export default grammar({ conflicts: ($) => [[$._value, $.other]], rules: { _value: ($) => choice($.a, $.b), first: ($) => $._value } });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/single-use-shared-choice-inline
      _value: ($) => choice($.a, $.b),
      first: ($) => $._value,
    });`,
  ],
  invalid: [
    {
      name: "one local use suggests metadata inlining",
      code: `export default () => ({ _initial_value: ($) => choice($._expression, seq($._array_initializer_prefix, "]")), _initial_phrase: ($) => field("initial", $._initial_value) });`,
      errors: [{ message: /_initial_value has one unaliased local use in _initial_phrase/ }],
    },
  ],
});

new RuleTester().run("shared-keyword-inline", sharedKeywordInline, {
  valid: [
    `export default grammar({ inline: ($) => [$._not_keyword], rules: { _not_keyword: ($) => kw("NOT"), expression: ($) => seq($._not_keyword, $.value) } });`,
    `export default () => ({ _keyword: ($) => kw("ONLY") });`,
    `export default () => ({ _keyword: ($) => kw("ONLY", options), root: ($) => $._keyword });`,
    `export default () => ({ _keyword: ($) => seq(kw("ONLY"), $.value), root: ($) => $._keyword });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/shared-keyword-inline
      _keyword: ($) => kw("ONLY"),
      root: ($) => $._keyword,
    });`,
  ],
  invalid: [
    {
      name: "static keyword wrapper used by a grammar rule",
      code: `export default grammar({ rules: { _not_keyword: ($) => kw("NOT"), expression: ($) => prec("not", seq($._not_keyword, $.value)) } });`,
      errors: [{ message: /_not_keyword wraps one static keyword/ }],
    },
    {
      name: "static keyword options are preserved",
      code: `export default () => ({ _keyword: ($) => kw("DEFINE", { offset: 3 }), root: ($) => $._keyword });`,
      errors: [{ message: /_keyword wraps one static keyword/ }],
    },
  ],
});

new RuleTester().run("single-use-shared-sequence-inline", singleUseSharedSequenceInline, {
  valid: [
    `export default () => ({ _pair: ($) => seq($.a, $.b), first: ($) => $._pair, second: ($) => $._pair });`,
    `export default () => ({ _pair: ($) => seq($.a, $.b), first: ($) => alias($._pair, $.pair) });`,
    `export default () => ({ __pair: ($) => seq($.a, $.b), first: ($) => $.__pair });`,
    `export default grammar({ inline: ($) => [$._pair], rules: { _pair: ($) => seq($.a, $.b), first: ($) => $._pair } });`,
    `export default grammar({ conflicts: ($) => [[$._pair, $.other]], rules: { _pair: ($) => seq($.a, $.b), first: ($) => $._pair } });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/single-use-shared-sequence-inline
      _pair: ($) => seq($.a, $.b),
      first: ($) => $._pair,
    });`,
  ],
  invalid: [
    {
      name: "position and optional length sequence",
      code: `export default () => ({ _position_length: ($) => seq(field("position", $._expression), optional($._comma_length)), _comma_position_length: ($) => seq(",", $._position_length) });`,
      errors: [{ message: /_position_length has one unaliased local sequence use/ }],
    },
  ],
});

const serializationChoice = `choice(alias(kw("SERIALIZABLE"), $.serializable), alias(kw("NON-SERIALIZABLE"), $.serializable))`;
new RuleTester().run("shared-keyword-alias-choice-inline", sharedKeywordAliasChoiceInline, {
  valid: [
    `export default grammar({ inline: ($) => [$._serialization], rules: { _serialization: ($) => ${serializationChoice} } });`,
    `export default grammar({ conflicts: ($) => [[$._serialization, $.other]], rules: { _serialization: ($) => ${serializationChoice} } });`,
    `export default () => ({ serialization: ($) => ${serializationChoice} });`,
    `export default () => ({ __serialization: ($) => ${serializationChoice} });`,
    `export default () => ({ _access: ($) => choice(alias(kw("PUBLIC"), $.public), alias(kw("PRIVATE"), $.private)) });`,
    `export default () => ({ _serialization: ($) => choice(alias(kw("A", options), $.flag), alias(kw("B"), $.flag)) });`,
    `export default () => ({
      // oxlint-disable-next-line rule-to-test/shared-keyword-alias-choice-inline
      _serialization: ($) => ${serializationChoice},
    });`,
  ],
  invalid: [
    {
      name: "shared serialization choice may have callers in other files",
      code: `export default () => ({ _serialization_modifier: ($) => ${serializationChoice} });`,
      errors: [
        { message: /_serialization_modifier chooses static keywords aliased as serializable/ },
      ],
    },
    {
      name: "keyword abbreviation options are retained",
      code: `export default () => ({ _direction: ($) => choice(alias(kw("ASCENDING", {offset: 3}), $.direction), alias(kw("DESCENDING", {offset: 4}), $.direction)) });`,
      errors: [{ message: /_direction chooses static keywords aliased as direction/ }],
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

const fieldHeadGrammar = (item = "$.__value", separator = '","') => `
export default () => ({
  root: ($) => seq("ITEMS", field("items", seq(${item}, optional($.__tail)))),
  __tail: ($) => seq(${separator}, ${item}, optional($.__tail)),
});`;
const fieldHeadError = { message: /field contains the item and continuation repeated by __tail/ };

new RuleTester().run("field-list-head-extraction", fieldListHeadExtraction, {
  valid: [
    `export default () => ({root: ($) => field("items", $.__head), __head: ($) => seq($.value, optional($.__tail)), __tail: ($) => seq(",", $.__head)});`,
    fieldHeadGrammar().replace('field("items", seq(', 'field("items", seq("PREFIX", '),
    fieldHeadGrammar().replace('field("items", seq(', "optional(seq("),
    fieldHeadGrammar().replace('field("items", seq(', 'choice("ROWID", seq('),
    fieldHeadGrammar().replace('seq(",", $.__value,', 'seq(",", $.other,'),
    fieldHeadGrammar().replace(
      'seq(",", $.__value, optional($.__tail))',
      'seq(",", $.__value, optional($.__other))',
    ),
    fieldHeadGrammar().replaceAll("__tail", "visible_tail"),
    fieldHeadGrammar().replaceAll("$.__tail", '$["__tail"]'),
    fieldHeadGrammar("optional($.value)"),
    fieldHeadGrammar('field("value", optional($.value))'),
    fieldHeadGrammar("alias(optional($.value), $.item)"),
    fieldHeadGrammar("choice($.value, optional($.other))"),
    fieldHeadGrammar("seq($.value, $.__tail)"),
    fieldHeadGrammar("makeItem($)"),
    fieldHeadGrammar("...items"),
    fieldHeadGrammar("$.value", '";"'),
    fieldHeadGrammar("$.value", "$.separator"),
    fieldHeadGrammar('field("value", $.value)').replace(
      'seq(",", field("value"',
      'seq(",", field("other"',
    ),
    fieldHeadGrammar("alias($.value, $.item)").replace(
      'seq(",", alias($.value, $.item)',
      'seq(",", alias($.value, $.other)',
    ),
    fieldHeadGrammar("token(/a/i)").replace('seq(",", token(/a/i)', 'seq(",", token(/b/i)'),
    ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
      (wrapper) => ({
        name: `field under ${wrapper} is excluded`,
        code: fieldHeadGrammar().replace(
          'seq("ITEMS", field("items", seq($.__value, optional($.__tail))))',
          `${wrapper}(${wrapper === "prec" ? '"list", ' : wrapper === "prec.dynamic" ? "1, " : ""}field("items", seq($.__value, optional($.__tail)))${wrapper === "alias" ? ", $.list" : ""})`,
        ),
      }),
    ),
    fieldHeadGrammar().replace(
      'seq(",", $.__value, optional($.__tail))',
      'prec.right(seq(",", $.__value, optional($.__tail)))',
    ),
    `const a = grammar({rules: {root: ($) => field("items", seq($.value, optional($.__tail)))}}); const b = grammar({rules: {__tail: ($) => seq(",", $.value, optional($.__tail))}});`,
    fieldHeadGrammar().replace("export default () => (", "const unrelated = ("),
    fieldHeadGrammar().replace(
      "  root:",
      "  // oxlint-disable-next-line rule-to-test/field-list-head-extraction\n  root:",
    ),
    fieldHeadGrammar().replace(
      "  __tail:",
      "  // oxlint-disable-next-line rule-to-test/field-list-head-extraction\n  __tail:",
    ),
  ],
  invalid: [
    { name: "COMBO-BOX LIST-ITEMS regression", code: fieldHeadGrammar(), errors: [fieldHeadError] },
    {
      name: "inner fields stay inside the head",
      code: fieldHeadGrammar('field("value", $.value)'),
      errors: [fieldHeadError],
    },
    {
      name: "aliases stay inside the head",
      code: fieldHeadGrammar("alias($.value, $.item)"),
      errors: [fieldHeadError],
    },
    {
      name: "optional comma remains optional",
      code: fieldHeadGrammar("$.value", 'optional(",")'),
      errors: [fieldHeadError],
    },
    {
      name: "multiple item parts",
      code: fieldHeadGrammar('$.key, "=", field("value", $.value)'),
      errors: [fieldHeadError],
    },
    {
      name: "core grammar maps",
      code: `export default grammar({rules: {root: ($) => field("items", seq($.value, optional($.__tail))), __tail: ($) => seq(",", $.value, optional($.__tail))}});`,
      errors: [fieldHeadError],
    },
  ],
});

const precedenceHeadGrammar = (
  item = "$.widget_phrase",
  wrapper = "prec.right",
  separator = '","',
) => `
export default () => ({
  root: ($) => field("widgets", ${wrapper}(seq(${item}, optional($.__tail)))),
  __tail: ($) => seq(${separator}, ${item}, optional($.__tail)),
});`;
const precedenceHeadError = {
  message: /precedence-wrapped list repeats the item and continuation in __tail/,
};
new RuleTester().run("precedence-list-head-extraction", precedenceListHeadExtraction, {
  valid: [
    `export default () => ({root: ($) => field("widgets", prec.right($.__widgets)), __widgets: ($) => seq($.widget_phrase, optional(seq(",", $.__widgets)))});`,
    precedenceHeadGrammar().replace("prec.right(seq(", "optional(seq("),
    precedenceHeadGrammar().replace("prec.right(seq(", "prec.dynamic(1, seq("),
    precedenceHeadGrammar().replace("prec.right(seq(", "prec(getPriority(), seq("),
    precedenceHeadGrammar().replace('seq(",", $.widget_phrase,', 'seq(",", $.other,'),
    precedenceHeadGrammar().replace(
      'seq(",", $.widget_phrase, optional($.__tail))',
      'seq(",", $.widget_phrase, optional($.__other))',
    ),
    precedenceHeadGrammar().replace("prec.right(seq(", 'prec.right(seq("PREFIX", '),
    precedenceHeadGrammar().replaceAll("__tail", "visible_tail"),
    precedenceHeadGrammar().replaceAll("$.__tail", '$["__tail"]'),
    precedenceHeadGrammar("optional($.value)"),
    precedenceHeadGrammar('field("value", optional($.value))'),
    precedenceHeadGrammar("alias(optional($.value), $.item)"),
    precedenceHeadGrammar("seq($.value, $.__tail)"),
    precedenceHeadGrammar("makeItem($)"),
    precedenceHeadGrammar("...items"),
    precedenceHeadGrammar("$.value", "prec.right", '";"'),
    precedenceHeadGrammar('field("value", $.value)').replace(
      'seq(",", field("value"',
      'seq(",", field("other"',
    ),
    precedenceHeadGrammar("alias($.value, $.item)").replace(
      'seq(",", alias($.value, $.item)',
      'seq(",", alias($.value, $.other)',
    ),
    precedenceHeadGrammar().replace(
      'seq(",", $.widget_phrase, optional($.__tail))',
      'prec.right(seq(",", $.widget_phrase, optional($.__tail)))',
    ),
    ...["token", "token.immediate", "alias", "prec.dynamic"].map((wrapper) =>
      precedenceHeadGrammar().replace(
        'field("widgets", prec.right(seq($.widget_phrase, optional($.__tail))))',
        `${wrapper}(${wrapper === "prec.dynamic" ? "1, " : ""}prec.right(seq($.widget_phrase, optional($.__tail)))${wrapper === "alias" ? ", $.widgets" : ""})`,
      ),
    ),
    `const a = grammar({rules: {root: ($) => prec.right(seq($.value, optional($.__tail)))}}); const b = grammar({rules: {__tail: ($) => seq(",", $.value, optional($.__tail))}});`,
    precedenceHeadGrammar().replace("export default () => (", "const unrelated = ("),
    ...["root", "__tail"].map((name) =>
      precedenceHeadGrammar().replace(
        `  ${name}:`,
        `  // oxlint-disable-next-line rule-to-test/precedence-list-head-extraction\n  ${name}:`,
      ),
    ),
  ],
  invalid: [
    {
      name: "WAIT-FOR widgets regression",
      code: precedenceHeadGrammar(),
      errors: [precedenceHeadError],
    },
    {
      name: "left associativity",
      code: precedenceHeadGrammar("$.value", "prec.left"),
      errors: [precedenceHeadError],
    },
    {
      name: "named precedence chain stays outside the head",
      code: precedenceHeadGrammar()
        .replace("prec.right(seq(", 'prec("widgets", prec.right(seq(')
        .replace("optional($.__tail))))", "optional($.__tail)))))"),
      errors: [precedenceHeadError],
    },
    {
      name: "inner fields",
      code: precedenceHeadGrammar('field("value", $.value)'),
      errors: [precedenceHeadError],
    },
    {
      name: "inner aliases",
      code: precedenceHeadGrammar("alias($.value, $.item)"),
      errors: [precedenceHeadError],
    },
    {
      name: "optional comma",
      code: precedenceHeadGrammar("$.value", "prec.right", 'optional(",")'),
      errors: [precedenceHeadError],
    },
    {
      name: "multiple item parts",
      code: precedenceHeadGrammar('$.key, "=", field("value", $.value)'),
      errors: [precedenceHeadError],
    },
    {
      name: "core grammar",
      code: `export default grammar({rules: {root: ($) => prec.right(seq($.value, optional($.__tail))), __tail: ($) => seq(",", $.value, optional($.__tail))}});`,
      errors: [precedenceHeadError],
    },
  ],
});

const orderedChainGrammar = (
  first = 'alias(kw("FROM-CURRENT"), $.from_current)',
  second = "$.__direction",
  last = "$.frame_phrase",
) => `
export default () => ({
  root: ($) => seq("SCROLL", optional(choice(seq(${first}, optional(choice($.__tail, ${last}))), $.__tail, ${last}))),
  __tail: ($) => seq(${second}, optional(${last})),
});`;
const orderedChainError = {
  message: /nested choice enumerates three independently optional elements in order/,
};
new RuleTester().run("ordered-optional-chain", orderedOptionalChain, {
  valid: [
    `export default () => ({root: ($) => seq(optional($.a), optional($.b), optional($.c))});`,
    orderedChainGrammar()
      .replace("optional(choice(seq(", "choice(seq(")
      .replace("$.__tail, $.frame_phrase))),", "$.__tail, $.frame_phrase)),"),
    orderedChainGrammar().replace(
      "optional(choice($.__tail, $.frame_phrase))",
      "optional(choice($.frame_phrase, $.__tail))",
    ),
    orderedChainGrammar().replace(
      "optional(choice($.__tail, $.frame_phrase))",
      "optional(choice($.__tail, $.other))",
    ),
    orderedChainGrammar().replace(
      "seq($.__direction, optional($.frame_phrase))",
      "seq($.__direction, optional($.other))",
    ),
    orderedChainGrammar().replace(
      "seq($.__direction, optional($.frame_phrase))",
      "prec.right(seq($.__direction, optional($.frame_phrase)))",
    ),
    orderedChainGrammar().replace(
      "seq($.__direction, optional($.frame_phrase))",
      "seq($.__direction, $.frame_phrase)",
    ),
    orderedChainGrammar("optional($.a)"),
    orderedChainGrammar('field("a", optional($.a))'),
    orderedChainGrammar("alias(optional($.a), $.a)"),
    orderedChainGrammar("makePrefix($)"),
    orderedChainGrammar("...items"),
    orderedChainGrammar("$.a", "optional($.b)"),
    orderedChainGrammar("$.a", "$.b", "optional($.c)"),
    orderedChainGrammar().replaceAll("__tail", "visible_tail"),
    orderedChainGrammar().replaceAll("__tail", "__main_body"),
    orderedChainGrammar().replaceAll("$.__tail", '$["__tail"]'),
    orderedChainGrammar().replace("  __tail:", "  extra: ($) => $.__tail,\n  __tail:"),
    orderedChainGrammar().replace("  __tail:", '  extra: ($) => $["__tail"],\n  __tail:'),
    ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
      (wrapper) =>
        orderedChainGrammar()
          .replace(
            'seq("SCROLL", optional(',
            `${wrapper}(${wrapper === "prec" ? '\"chain\", ' : wrapper === "prec.dynamic" ? "1, " : ""}seq("SCROLL", optional(`,
          )
          .replace(
            "$.frame_phrase))),",
            `$.frame_phrase)))${wrapper === "alias" ? ", $.chain" : ""}),`,
          ),
    ),
    `export default grammar({inline: ($) => [$.__tail], rules: {root: ($) => optional(choice(seq($.a, optional(choice($.__tail, $.c))), $.__tail, $.c)), __tail: ($) => seq($.b, optional($.c))}});`,
    `const a = grammar({rules: {root: ($) => optional(choice(seq($.a, optional(choice($.__tail, $.c))), $.__tail, $.c))}}); const b = grammar({rules: {__tail: ($) => seq($.b, optional($.c))}});`,
    orderedChainGrammar().replace("export default () => (", "const unrelated = ("),
    ...["root", "__tail"].map((name) =>
      orderedChainGrammar().replace(
        `  ${name}:`,
        `  // oxlint-disable-next-line rule-to-test/ordered-optional-chain\n  ${name}:`,
      ),
    ),
  ],
  invalid: [
    { name: "SCROLL regression", code: orderedChainGrammar(), errors: [orderedChainError] },
    {
      name: "symbol elements",
      code: orderedChainGrammar("$.a", "$.b", "$.c"),
      errors: [orderedChainError],
    },
    {
      name: "field preservation",
      code: orderedChainGrammar('field("a", $.a)', 'field("b", $.b)', 'field("c", $.c)'),
      errors: [orderedChainError],
    },
    {
      name: "alias preservation",
      code: orderedChainGrammar(
        "alias($.a, $.first)",
        "alias($.b, $.second)",
        "alias($.c, $.third)",
      ),
      errors: [orderedChainError],
    },
    {
      name: "core grammar",
      code: `export default grammar({rules: {root: ($) => optional(choice(seq($.a, optional(choice($.__tail, $.c))), $.__tail, $.c)), __tail: ($) => seq($.b, optional($.c))}});`,
      errors: [orderedChainError],
    },
  ],
});

const delimitedSequenceGrammar = (
  body = 'seq("(", field("buffer", $._expression), ",", $._position_length, ")")',
  use = "$.__args",
) => `
export default () => ({
  root: ($) => seq($.type, ${use}, $.value),
  __args: ($) => ${body},
});`;
const delimitedSequenceError = {
  message: /__args has one unaliased local use in root; try inlining this delimited sequence/,
};
new RuleTester().run("single-use-delimited-sequence", singleUseDelimitedSequence, {
  valid: [
    delimitedSequenceGrammar().replaceAll("__args", "public_args"),
    delimitedSequenceGrammar().replaceAll("__args", "__main_body"),
    delimitedSequenceGrammar(undefined, "seq($.__args, $.__args)"),
    delimitedSequenceGrammar(undefined, 'seq($.__args, $["__args"])'),
    delimitedSequenceGrammar(undefined, '$["__args"]'),
    delimitedSequenceGrammar(undefined, "alias($.__args, $.arguments)"),
    delimitedSequenceGrammar(undefined, 'field("arguments", $.__args)'),
    delimitedSequenceGrammar('seq("(", $.value, ")")'),
    delimitedSequenceGrammar('seq("(", $.a, $.b, $.c, $.d, $.e, $.f, ")")'),
    delimitedSequenceGrammar('seq("(", $.a, ",", $.b, "]")'),
    delimitedSequenceGrammar('seq("START", $.a, ",", $.b, "END")'),
    delimitedSequenceGrammar('seq("(", "a", ",", "b", ")")'),
    delimitedSequenceGrammar('seq("(", $.a, ",", $.__args, ")")'),
    delimitedSequenceGrammar('seq("(", $.a, ",", makeValue($), ")")'),
    delimitedSequenceGrammar('seq("(", $.a, ...items, ")")'),
    delimitedSequenceGrammar('prec.right(seq("(", $.a, ",", $.b, ")"))'),
    delimitedSequenceGrammar('seq("(", alias($.a, $.item), ",", $.b, ")")'),
    ...["token", "token.immediate", "prec.dynamic"].map((wrapper) =>
      delimitedSequenceGrammar(
        undefined,
        `${wrapper}(${wrapper === "prec.dynamic" ? "1, " : ""}$.__args)`,
      ),
    ),
    `export default grammar({inline: ($) => [$.__args], rules: {root: ($) => $.__args, __args: ($) => seq("(", $.a, ",", $.b, ")")}});`,
    `export default grammar({precedences: ($) => [[$.__args, $.other]], rules: {root: ($) => $.__args, __args: ($) => seq("(", $.a, ",", $.b, ")")}});`,
    `const a = grammar({rules: {root: ($) => $.__args}}); const b = grammar({rules: {__args: ($) => seq("(", $.a, ",", $.b, ")")}});`,
    delimitedSequenceGrammar().replace("export default () => (", "const unrelated = ("),
    ...["root", "__args"].map((name) =>
      delimitedSequenceGrammar().replace(
        `  ${name}:`,
        `  // oxlint-disable-next-line rule-to-test/single-use-delimited-sequence\n  ${name}:`,
      ),
    ),
  ],
  invalid: [
    {
      name: "PUT assignment arguments regression",
      code: delimitedSequenceGrammar(),
      errors: [delimitedSequenceError],
    },
    {
      name: "bracket delimiters",
      code: delimitedSequenceGrammar('seq("[", $.a, ",", $.b, "]")'),
      errors: [delimitedSequenceError],
    },
    {
      name: "brace delimiters",
      code: delimitedSequenceGrammar('seq("{", $.a, ",", $.b, "}")'),
      errors: [delimitedSequenceError],
    },
    {
      name: "optional field preserved",
      code: delimitedSequenceGrammar(
        'seq("(", field("first", $.a), ",", optional(field("second", $.b)), ")")',
      ),
      errors: [delimitedSequenceError],
    },
    {
      name: "outer optional retained",
      code: delimitedSequenceGrammar(undefined, "optional($.__args)"),
      errors: [delimitedSequenceError],
    },
    {
      name: "call-site precedence retained",
      code: delimitedSequenceGrammar(undefined, "prec.right($.__args)"),
      errors: [delimitedSequenceError],
    },
    {
      name: "core grammar",
      code: `export default grammar({rules: {root: ($) => $.__args, __args: ($) => seq("(", $.a, ",", $.b, ")")}});`,
      errors: [delimitedSequenceError],
    },
  ],
});

const closingWrapperGrammar = (open = '"("', close = '")"') => `
export default () => ({
  first: ($) => seq("FIELDS", $.__wrapped),
  second: ($) => seq("EXCEPT", $.__wrapped),
  __wrapped: ($) => seq($.__prefix, ${close}),
  __prefix: ($) => seq(${open}, optional($.names)),
});`;
const closingWrapperError = {
  message: /__wrapped only appends a closing delimiter to __prefix at 2 local unaliased uses/,
};
new RuleTester().run("closing-delimiter-wrapper", closingDelimiterWrapper, {
  valid: [
    closingWrapperGrammar().replaceAll("__wrapped", "visible_wrapper"),
    closingWrapperGrammar().replaceAll("__wrapped", "__main_body"),
    closingWrapperGrammar().replaceAll("$.__wrapped", '$["__wrapped"]'),
    closingWrapperGrammar().replace('seq("EXCEPT", $.__wrapped)', 'seq("EXCEPT", $.other)'),
    closingWrapperGrammar().replace('seq("EXCEPT", $.__wrapped)', 'seq("EXCEPT", $["__wrapped"])'),
    closingWrapperGrammar().replace('seq($.__prefix, ")")', 'prec.right(seq($.__prefix, ")"))'),
    closingWrapperGrammar().replace('seq($.__prefix, ")")', 'seq($.__prefix, ",", ")")'),
    closingWrapperGrammar().replace('seq($.__prefix, ")")', "seq($.__prefix, $.close)"),
    closingWrapperGrammar().replace(
      'seq("(", optional($.names))',
      'seq("(", optional($.__wrapped))',
    ),
    closingWrapperGrammar().replace('seq("(", optional($.names))', "makePrefix($)"),
    closingWrapperGrammar().replace(
      'seq("(", optional($.names))',
      'prec.right(seq("(", optional($.names)))',
    ),
    closingWrapperGrammar('"["', '")"'),
    closingWrapperGrammar('"START"', '"END"'),
    ...["alias", "field", "token", "token.immediate", "prec.dynamic"].map((wrapper) =>
      closingWrapperGrammar().replace(
        'seq("FIELDS", $.__wrapped)',
        `seq("FIELDS", ${wrapper}(${wrapper === "field" ? '\"items\", ' : wrapper === "prec.dynamic" ? "1, " : ""}$.__wrapped${wrapper === "alias" ? ", $.items" : ""}))`,
      ),
    ),
    `export default grammar({inline: ($) => [$.__wrapped], rules: {first: ($) => $.__wrapped, second: ($) => $.__wrapped, __wrapped: ($) => seq($.__prefix, ")"), __prefix: ($) => seq("(", $.names)}});`,
    `const a = grammar({rules: {first: ($) => $.__wrapped, second: ($) => $.__wrapped}}); const b = grammar({rules: {__wrapped: ($) => seq($.__prefix, ")"), __prefix: ($) => seq("(", $.names)}});`,
    closingWrapperGrammar().replace("export default () => (", "const unrelated = ("),
    ...["first", "__wrapped"].map((name) =>
      closingWrapperGrammar().replace(
        `  ${name}:`,
        `  // oxlint-disable-next-line rule-to-test/closing-delimiter-wrapper\n  ${name}:`,
      ),
    ),
  ],
  invalid: [
    {
      name: "QUERY FIELDS and EXCEPT regression",
      code: closingWrapperGrammar(),
      errors: [closingWrapperError],
    },
    {
      name: "square brackets",
      code: closingWrapperGrammar('"["', '"]"'),
      errors: [closingWrapperError],
    },
    { name: "braces", code: closingWrapperGrammar('"{"', '"}"'), errors: [closingWrapperError] },
    {
      name: "caller optionality preserved",
      code: closingWrapperGrammar().replace(
        'seq("FIELDS", $.__wrapped)',
        'seq("FIELDS", optional($.__wrapped))',
      ),
      errors: [closingWrapperError],
    },
    {
      name: "caller static precedence preserved",
      code: closingWrapperGrammar().replace(
        'seq("FIELDS", $.__wrapped)',
        'seq("FIELDS", prec.right($.__wrapped))',
      ),
      errors: [closingWrapperError],
    },
    {
      name: "prefix suppression for another transformation",
      code: closingWrapperGrammar().replace(
        "  __prefix:",
        "  // oxlint-disable-next-line rule-to-test/single-use-sequence\n  __prefix:",
      ),
      errors: [closingWrapperError],
    },
    {
      name: "core grammar",
      code: `export default grammar({rules: {first: ($) => $.__wrapped, second: ($) => $.__wrapped, __wrapped: ($) => seq($.__prefix, ")"), __prefix: ($) => seq("(", $.names)}});`,
      errors: [closingWrapperError],
    },
  ],
});

const commaFieldSeed = `export default () => ({first: ($) => seq($.position, optional(seq(",", field("length", $._expression))))});`;
const commaFieldTarget = `export default () => ({second: ($) => seq(",", field("length", $._expression), optional($.type))});`;
const commaFieldError = { message: /comma and length field repeat a fragment in first/ };
const commaSeedCase = { filename: "grammar/core/common.js", code: commaFieldSeed };
const commaTargetCase = (code) => ({ filename: "grammar/statements/overlay.js", code });
for (const code of [
  commaFieldTarget.replace('field("length"', 'field("size"'),
  commaFieldTarget.replace("$._expression", "$.number_literal"),
  commaFieldTarget.replace('seq(",",', 'seq(";",'),
  commaFieldTarget.replace(
    'field("length", $._expression)',
    'field("length", optional($._expression))',
  ),
  commaFieldTarget.replace('field("length", $._expression)', 'field("length", $["_expression"])'),
  commaFieldTarget.replace('field("length", $._expression)', 'field("length", makeValue($))'),
  commaFieldTarget.replace('field("length", $._expression)', 'field("length", ...items)'),
  commaFieldTarget.replace('field("length", $._expression)', 'field("length", $.__local_value)'),
  commaFieldTarget.replace(
    'seq(",", field("length", $._expression), optional($.type))',
    "seq($._comma_length, optional($.type))",
  ),
  commaFieldTarget.replace("export default () => (", "const unrelated = ("),
  ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
    (wrapper) =>
      commaFieldTarget.replace(
        'seq(",", field("length", $._expression), optional($.type))',
        `${wrapper}(${wrapper === "prec" ? '\"argument\", ' : wrapper === "prec.dynamic" ? "1, " : ""}seq(",", field("length", $._expression))${wrapper === "alias" ? ", $.argument" : ""})`,
      ),
  ),
  commaFieldTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-comma-field\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-comma-field", sharedCommaField, {
    valid: [commaSeedCase, commaTargetCase(code)],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-comma-field", sharedCommaField, {
  valid: [commaSeedCase],
  invalid: [{ ...commaTargetCase(commaFieldTarget), errors: [commaFieldError] }],
});
resetSharingCandidates();
new RuleTester().run("shared-comma-field", sharedCommaField, {
  valid: [],
  invalid: [
    {
      name: "same local map",
      code: `export default () => ({first: ($) => seq($.position, optional(seq(",", field("length", $._expression)))), second: ($) => seq("OVERLAY", optional(seq(",", field("length", $._expression), optional($.type))))});`,
      errors: [commaFieldError],
    },
  ],
});
resetSharingCandidates();
new RuleTester().run("shared-comma-field", sharedCommaField, {
  valid: [
    `const a = grammar({rules: {first: ($) => seq(",", field("length", $._expression))}}); const b = grammar({rules: {second: ($) => seq(",", field("length", $._expression))}});`,
  ],
  invalid: [],
});
resetSharingCandidates();
new RuleTester().run("shared-comma-field", sharedCommaField, {
  valid: [
    {
      filename: "grammar/statements/single.js",
      code: `export default () => ({single: ($) => choice(seq(",", field("length", $._expression)), seq(",", field("length", $._expression), $.other))});`,
    },
  ],
  invalid: [],
});
resetSharingCandidates();
new RuleTester().run("shared-comma-field", sharedCommaField, {
  valid: [
    {
      ...commaSeedCase,
      code: commaFieldSeed.replace(
        "first:",
        "\n// oxlint-disable-next-line rule-to-test/shared-comma-field\nfirst:",
      ),
    },
    commaTargetCase(commaFieldTarget),
  ],
  invalid: [],
});
resetSharingCandidates();

const continuationGrammar = (separator = 'optional(",")') =>
  `export default () => ({_tail: ($) => seq(${separator}, $.__head), __head: ($) => seq(choice($.identifier, $.string_literal), optional($._tail))});`;
const continuationError = { message: /_tail only adds a separator before recursing into __head/ };
new RuleTester().run("recursive-continuation-inline", recursiveContinuationInline, {
  valid: [
    continuationGrammar().replace('seq(optional(","), $.__head)', 'seq(optional(","), $.other)'),
    continuationGrammar().replace("optional($._tail)", "repeat($._tail)"),
    continuationGrammar().replaceAll("_tail", "visible_tail"),
    continuationGrammar().replaceAll("__head", "visible_head"),
    continuationGrammar().replaceAll("$._tail", '$["_tail"]'),
    continuationGrammar('";"'),
    continuationGrammar().replace(
      'seq(optional(","), $.__head)',
      'prec.right(seq(optional(","), $.__head))',
    ),
    continuationGrammar().replace(
      "seq(choice($.identifier, $.string_literal), optional($._tail))",
      "prec.right(seq(choice($.identifier, $.string_literal), optional($._tail)))",
    ),
    continuationGrammar().replace("_tail:", "extra: ($) => $._tail, _tail:"),
    continuationGrammar().replace("_tail:", 'extra: ($) => $["_tail"], _tail:'),
    continuationGrammar().replace("export default () => (", "const unrelated = ("),
    ...["_tail", "__head"].map((name) =>
      continuationGrammar().replace(
        `${name}:`,
        `\n// oxlint-disable-next-line rule-to-test/recursive-continuation-inline\n${name}:`,
      ),
    ),
  ],
  invalid: [
    { name: "GO-ON optional separator", code: continuationGrammar(), errors: [continuationError] },
    { name: "required separator", code: continuationGrammar('","'), errors: [continuationError] },
  ],
});

const fieldChoiceGrammar = (use = 'optional(field("size", $._sizes))') =>
  `export default () => ({root: ($) => seq("EXTENT", ${use}), _sizes: ($) => choice($.number_literal, $.identifier, $.null_literal)});`;
const fieldWrappedChoiceError = { message: /_sizes has one local use inside the size field/ };
new RuleTester().run("single-use-field-choice", singleUseFieldChoice, {
  valid: [
    fieldChoiceGrammar().replaceAll("_sizes", "public_sizes"),
    fieldChoiceGrammar().replaceAll("$._sizes", '$["_sizes"]'),
    fieldChoiceGrammar("$._sizes"),
    fieldChoiceGrammar("alias($._sizes, $.size)"),
    fieldChoiceGrammar('seq(field("size", $._sizes), $._sizes)'),
    fieldChoiceGrammar('seq(field("size", $._sizes), $["_sizes"])'),
    fieldChoiceGrammar().replace("$.null_literal", "$._sizes"),
    fieldChoiceGrammar().replace("$.null_literal", "$._some_keyword"),
    fieldChoiceGrammar().replace(
      "choice($.number_literal, $.identifier, $.null_literal)",
      "prec.right(choice($.number_literal, $.identifier, $.null_literal))",
    ),
    fieldChoiceGrammar().replace("$.null_literal", "seq($.a, $.b)"),
    ...["alias", "token", "token.immediate", "prec.dynamic"].map((wrapper) =>
      fieldChoiceGrammar(
        `${wrapper}(${wrapper === "prec.dynamic" ? "1, " : ""}field("size", $._sizes)${wrapper === "alias" ? ", $.value" : ""})`,
      ),
    ),
    ...["root", "_sizes"].map((name) =>
      fieldChoiceGrammar().replace(
        `${name}:`,
        `\n// oxlint-disable-next-line rule-to-test/single-use-field-choice\n${name}:`,
      ),
    ),
  ],
  invalid: [
    {
      name: "EXTENT size regression",
      code: fieldChoiceGrammar(),
      errors: [fieldWrappedChoiceError],
    },
    {
      name: "static caller precedence",
      code: fieldChoiceGrammar('prec.right(field("size", $._sizes))'),
      errors: [fieldWrappedChoiceError],
    },
  ],
});

const slotListGrammar = `export default () => ({root: ($) => seq("(", optional($._slots)), _slots: ($) => choice(seq($.argument, repeat(seq(",", optional($.argument)))), repeat1(seq(",", optional($.argument))))});`;
new RuleTester().run("nullable-slot-list", nullableSlotList, {
  valid: [
    slotListGrammar.replaceAll("_slots", "visible_slots"),
    slotListGrammar.replaceAll("$._slots", '$["_slots"]'),
    slotListGrammar.replace("optional($._slots)", "$._slots"),
    slotListGrammar.replace(
      'repeat1(seq(",", optional($.argument)))',
      'repeat1(seq(",", $.argument))',
    ),
    slotListGrammar.replaceAll('seq(",",', 'seq(";",'),
    slotListGrammar.replace("seq($.argument, repeat", "seq($.different, repeat"),
    slotListGrammar.replace("_slots:", "other: ($) => $._slots, _slots:"),
    slotListGrammar.replace("_slots:", 'other: ($) => $["_slots"], _slots:'),
    slotListGrammar.replace(
      'seq("(", optional($._slots))',
      'field("items", seq("(", optional($._slots)))',
    ),
    slotListGrammar.replace(
      'seq("(", optional($._slots))',
      'alias(seq("(", optional($._slots)), $.items)',
    ),
    slotListGrammar.replace('seq("(", optional($._slots))', 'token(seq("(", optional($._slots)))'),
    ...["root", "_slots"].map((name) =>
      slotListGrammar.replace(
        `${name}:`,
        `\n// oxlint-disable-next-line rule-to-test/nullable-slot-list\n${name}:`,
      ),
    ),
  ],
  invalid: [
    {
      name: "omitted COM arguments",
      code: slotListGrammar,
      errors: [{ message: /_slots distinguishes present and omitted first items/ }],
    },
  ],
});

const continuationSeed = {
  filename: "grammar/phrases/on-endkey.js",
  code: 'export default () => ({first: ($) => seq("ENDKEY", optional(seq(",", $._action)))});',
};
const continuationTarget = 'export default () => ({second: ($) => seq("STOP", ",", $._action)});';
for (const code of [
  continuationTarget.replace("$._action", "$._other"),
  continuationTarget.replace("$._action", "$.__private"),
  continuationTarget.replace("$._action", "$._some_keyword"),
  continuationTarget.replace("$._action", "$.visible"),
  continuationTarget.replace("$._action", 'field("action", $._action)'),
  continuationTarget.replace("$._action", '$["_action"]'),
  continuationTarget.replace('","', '";"'),
  ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
    (wrapper) =>
      continuationTarget.replace(
        'seq("STOP", ",", $._action)',
        `${wrapper}(${wrapper === "prec" ? '"action", ' : wrapper === "prec.dynamic" ? "1, " : ""}seq("STOP", ",", $._action)${wrapper === "alias" ? ", $.action" : ""})`,
      ),
  ),
  continuationTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-comma-continuation\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-comma-continuation", sharedCommaContinuation, {
    valid: [continuationSeed, { filename: "grammar/phrases/on-stop.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-comma-continuation", sharedCommaContinuation, {
  valid: [continuationSeed],
  invalid: [
    {
      filename: "grammar/phrases/on-stop.js",
      code: continuationTarget,
      errors: [{ message: /comma and _action continuation repeat a fragment in first/ }],
    },
  ],
});
resetSharingCandidates();
new RuleTester().run("shared-comma-continuation", sharedCommaContinuation, {
  valid: [
    {
      ...continuationSeed,
      code: continuationSeed.code.replace(
        "first:",
        "\n// oxlint-disable-next-line rule-to-test/shared-comma-continuation\nfirst:",
      ),
    },
    { filename: "grammar/phrases/on-stop.js", code: continuationTarget },
  ],
  invalid: [],
});
resetSharingCandidates();

const optionalRepeatGrammar = `export default () => ({root: ($) => choice(seq($.a, optional($.__options)), seq($.b, optional($.__options))), __options: ($) => repeat1(choice($.at_phrase, seq($._to_keyword, field("to", $._expression)), $.__display_option))});`;
new RuleTester().run("optional-repetition-inline", optionalRepetitionInline, {
  valid: [
    optionalRepeatGrammar.replaceAll("__options", "visible_options"),
    optionalRepeatGrammar.replaceAll("__options", "__main_body"),
    optionalRepeatGrammar.replaceAll("$.__options", '$["__options"]'),
    optionalRepeatGrammar.replace("seq($.b, optional($.__options))", "$.b"),
    optionalRepeatGrammar.replace("seq($.b, optional($.__options))", "seq($.b, $.__options)"),
    optionalRepeatGrammar.replace(
      'repeat1(choice($.at_phrase, seq($._to_keyword, field("to", $._expression)), $.__display_option))',
      'repeat(choice($.at_phrase, seq($._to_keyword, field("to", $._expression)), $.__display_option))',
    ),
    optionalRepeatGrammar.replace("$.__display_option", "$.__options"),
    optionalRepeatGrammar.replace(
      "seq($.b, optional($.__options))",
      "seq($.b, alias(optional($.__options), $.options))",
    ),
    optionalRepeatGrammar.replace(
      "seq($.b, optional($.__options))",
      'seq($.b, field("options", optional($.__options)))',
    ),
    optionalRepeatGrammar.replace(
      "seq($.b, optional($.__options))",
      "seq($.b, token(optional($.__options)))",
    ),
    optionalRepeatGrammar.replace(
      "seq($.b, optional($.__options))",
      "seq($.b, prec.dynamic(1, optional($.__options)))",
    ),
    optionalRepeatGrammar.replace("__options:", "metadata: ($) => $.__options, __options:"),
    optionalRepeatGrammar.replace("__options:", 'metadata: ($) => $["__options"], __options:'),
    ...["root", "__options"].map((name) =>
      optionalRepeatGrammar.replace(
        `${name}:`,
        `\n// oxlint-disable-next-line rule-to-test/optional-repetition-inline\n${name}:`,
      ),
    ),
  ],
  invalid: [
    {
      name: "FRAME display-value options",
      code: optionalRepeatGrammar,
      errors: [
        { message: /__options is a non-empty repetition used only inside 2 local optional calls/ },
      ],
    },
  ],
});

const blockCloseSeed = {
  filename: "grammar/statements/catch.js",
  code: 'export default () => ({first: ($) => seq("CATCH", $.body, $._end_keyword, optional("CATCH"))});',
};
const blockCloseTarget =
  'export default () => ({second: ($) => seq("FINALLY", $.body, $._end_keyword, optional("FINALLY"))});';
for (const code of [
  blockCloseTarget.replace("$.body", "$.__body"),
  blockCloseTarget.replace("$.body", "$.other_body"),
  blockCloseTarget.replace("$._end_keyword", "$._terminator"),
  blockCloseTarget.replace("$.body", 'field("body", $.body)'),
  blockCloseTarget.replace("$.body", '$["body"]'),
  blockCloseTarget.replace("$.body, $._end_keyword", "$._closed_body"),
  ...["alias", "token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].map(
    (wrapper) =>
      blockCloseTarget.replace(
        'seq("FINALLY", $.body, $._end_keyword, optional("FINALLY"))',
        `${wrapper}(${wrapper === "prec" ? '"block", ' : wrapper === "prec.dynamic" ? "1, " : ""}seq("FINALLY", $.body, $._end_keyword)${wrapper === "alias" ? ", $.block" : ""})`,
      ),
  ),
  blockCloseTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-block-close\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-block-close", sharedBlockClose, {
    valid: [blockCloseSeed, { filename: "grammar/statements/finally.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-block-close", sharedBlockClose, {
  valid: [blockCloseSeed],
  invalid: [
    {
      filename: "grammar/statements/finally.js",
      code: blockCloseTarget,
      errors: [{ message: /body node and END delimiter repeat a fragment in first/ }],
    },
  ],
});
resetSharingCandidates();

const declarationSeed = {
  filename: "grammar/statements/event.js",
  code: 'export default () => ({first: ($) => seq($._define_keyword, optional($.modifiers), kw("EVENT"), $._event_body, $._terminator)});',
};
const declarationTarget =
  'export default () => ({second: ($) => seq($._define_keyword, kw("EVENT"), $._event_body, $._terminator)});';
for (const code of [
  declarationTarget.replace('kw("EVENT")', 'kw("EVENT", {offset: 3})'),
  declarationTarget.replace("$._event_body", "$._other_body"),
  declarationTarget.replace("$._event_body", "$.__private_body"),
  declarationTarget.replace("$._terminator", "$._no_error_terminator"),
  declarationTarget.replace('kw("EVENT"), $._event_body, $._terminator', "$._event_tail"),
  declarationTarget.replace('kw("EVENT")', "getKeyword()"),
  declarationTarget.replace(
    'seq($._define_keyword, kw("EVENT"), $._event_body, $._terminator)',
    'token(seq($._define_keyword, kw("EVENT"), $._event_body, $._terminator))',
  ),
  declarationTarget.replace(
    'seq($._define_keyword, kw("EVENT"), $._event_body, $._terminator)',
    'prec.right(seq($._define_keyword, kw("EVENT"), $._event_body, $._terminator))',
  ),
  declarationTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-declaration-tail\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-declaration-tail", sharedDeclarationTail, {
    valid: [declarationSeed, { filename: "grammar/statements/interface.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-declaration-tail", sharedDeclarationTail, {
  valid: [declarationSeed],
  invalid: [
    {
      filename: "grammar/statements/interface.js",
      code: declarationTarget,
      errors: [
        { message: /keyword, _event_body and terminator clause repeat a fragment in first/ },
      ],
    },
  ],
});
resetSharingCandidates();

const privatePrefixGrammar =
  'export default () => ({assign_statement: ($) => seq($.__assign_statement_prefix, $._terminator), __assign_statement_prefix: ($) => seq("ASSIGN", $.value)});';
new RuleTester().run("short-private-prefix", shortPrivatePrefix, {
  valid: [
    { filename: "grammar.js", code: privatePrefixGrammar },
    { filename: "grammar/core/common.js", code: privatePrefixGrammar },
    { filename: "grammar/statements/other.js", code: privatePrefixGrammar },
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar.replaceAll("__assign_statement_prefix", "__assign_prefix"),
    },
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar.replace(
        "__assign_statement_prefix:",
        "__assign_prefix: ($) => $.value, __assign_statement_prefix:",
      ),
    },
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar.replace("assign_statement:", "different_statement:"),
    },
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar.replace('seq("ASSIGN", $.value)', "choice($.a, $.b)"),
    },
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar.replace(
        "__assign_statement_prefix:",
        "other: ($) => alias($.value, $.__assign_statement_prefix), __assign_statement_prefix:",
      ),
    },
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar.replace(
        "__assign_statement_prefix:",
        "\n// oxlint-disable-next-line rule-to-test/short-private-prefix\n__assign_statement_prefix:",
      ),
    },
  ],
  invalid: [
    {
      filename: "grammar/statements/assign.js",
      code: privatePrefixGrammar,
      errors: [{ message: /__assign_statement_prefix repeats the statement role/ }],
    },
  ],
});

const statusSeed = {
  filename: "grammar/statements/close-stored-procedure.js",
  code: 'export default () => ({first: ($) => optional(seq(field("status_var", $._identifier_or_qualified_name), "=", kw("PROC-STATUS")))});',
};
const statusTarget =
  'export default () => ({second: ($) => seq("LOAD-RESULT-INTO", $.handle, optional(seq(field("status_var", $._identifier_or_qualified_name), "=", kw("PROC-STATUS"))))});';
for (const code of [
  statusTarget.replace('"status_var"', '"other"'),
  statusTarget.replace("$._identifier_or_qualified_name", "$.identifier"),
  statusTarget.replace("$._identifier_or_qualified_name", "$.__local"),
  statusTarget.replace('"="', '":"'),
  statusTarget.replace('kw("PROC-STATUS")', 'kw("PROC-HANDLE")'),
  statusTarget.replace('kw("PROC-STATUS")', 'kw("PROC-STATUS", {offset: 4})'),
  statusTarget.replace("optional(seq(", "token(seq("),
  statusTarget.replace("optional(seq(", "prec.right(seq("),
  statusTarget.replace('kw("PROC-STATUS")', "getValue($)"),
  statusTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-assignment-clause\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-assignment-clause", sharedAssignmentClause, {
    valid: [statusSeed, { filename: "grammar/statements/run-stored-procedure.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-assignment-clause", sharedAssignmentClause, {
  valid: [statusSeed],
  invalid: [
    {
      filename: "grammar/statements/run-stored-procedure.js",
      code: statusTarget,
      errors: [{ message: /status_var assignment clause repeats first/ }],
    },
  ],
});
resetSharingCandidates();

const delimiterSeed = {
  filename: "grammar/phrases/record.js",
  code: 'export default () => ({first: ($) => seq($.name, optional(seq("[", field("index", $._expression), "]")))});',
};
const delimiterTarget =
  'export default () => ({second: ($) => seq(field("array", $.identifier), "[", field("index", $._expression), "]")});';
for (const code of [
  delimiterTarget.replace('"index"', '"other"'),
  delimiterTarget.replace("$._expression", "$.number_literal"),
  delimiterTarget.replace("$._expression", "$.__local"),
  delimiterTarget.replace("$._expression", '$["_expression"]'),
  delimiterTarget.replace('"]"', '")"'),
  delimiterTarget.replace('"["', '"<"'),
  delimiterTarget.replace(
    'field("index", $._expression)',
    'field("index", optional($._expression))',
  ),
  delimiterTarget.replace('field("index", $._expression)', 'field("index", getValue($))'),
  delimiterTarget.replace(
    'seq(field("array", $.identifier), "[", field("index", $._expression), "]")',
    'seq(field("array", $.identifier), $._index_prefix, "]")',
  ),
  ...["token", "prec.right"].map((wrapper) =>
    delimiterTarget.replace(
      'seq(field("array", $.identifier), "[", field("index", $._expression), "]")',
      `${wrapper}(seq(field("array", $.identifier), "[", field("index", $._expression), "]"))`,
    ),
  ),
  delimiterTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-delimiter-field-prefix\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-delimiter-field-prefix", sharedDelimiterFieldPrefix, {
    valid: [delimiterSeed, { filename: "grammar/statements/display.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-delimiter-field-prefix", sharedDelimiterFieldPrefix, {
  valid: [delimiterSeed],
  invalid: [
    {
      filename: "grammar/statements/display.js",
      code: delimiterTarget,
      errors: [{ message: /delimited index field repeats a fragment in first/ }],
    },
  ],
});
resetSharingCandidates();

const valuedSeed = {
  filename: "grammar/statements/get-key-value.js",
  code: 'export default ({kw}) => ({first: ($) => seq(kw("GET-KEY-VALUE"), kw("SECTION"), field("section", $._expression), $.tail)});',
};
const valuedTarget =
  'export default ({kw}) => ({second: ($) => seq(kw("PUT-KEY-VALUE"), choice(seq(kw("SECTION"), field("section", $._expression), kw("KEY"), $.key), $.other))});';
for (const code of [
  valuedTarget.replace('"section"', '"different"'),
  valuedTarget.replace("$._expression", "$.identifier"),
  valuedTarget.replace("$._expression", "$.__local"),
  valuedTarget.replace("$._expression", '$["_expression"]'),
  valuedTarget.replace('kw("SECTION")', 'kw("SECTION", {offset: 3})'),
  valuedTarget.replace('kw("SECTION")', "kw(section)"),
  valuedTarget.replace(
    'field("section", $._expression)',
    'field("section", optional($._expression))',
  ),
  valuedTarget.replace('field("section", $._expression)', 'field("section", getValue($))'),
  ...["token", "prec.right", 'field.bind(null, "outer")'].map((wrapper) =>
    valuedTarget.replace(
      'seq(kw("SECTION"), field("section", $._expression), kw("KEY"), $.key)',
      `${wrapper}(seq(kw("SECTION"), field("section", $._expression), kw("KEY"), $.key))`,
    ),
  ),
  valuedTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-valued-fragment\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-valued-fragment", sharedValuedFragment, {
    valid: [valuedSeed, { filename: "grammar/statements/put-key-value.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-valued-fragment", sharedValuedFragment, {
  valid: [valuedSeed],
  invalid: [
    {
      filename: "grammar/statements/put-key-value.js",
      code: valuedTarget,
      errors: [{ message: /valued section fragment repeats first/ }],
    },
  ],
});
resetSharingCandidates();

const fieldSequenceGrammar =
  'export default () => ({root: ($) => field("else_branch", $.__else_clause), __else_clause: ($) => seq(token(/&ELSE/i), $.values)});';
new RuleTester().run("single-use-field-sequence", singleUseFieldSequence, {
  valid: [
    fieldSequenceGrammar.replace('field("else_branch", $.__else_clause)', "$.__else_clause"),
    fieldSequenceGrammar.replace(
      'field("else_branch", $.__else_clause)',
      "alias($.__else_clause, $.branch)",
    ),
    fieldSequenceGrammar.replace(
      'field("else_branch", $.__else_clause)',
      'alias(field("else_branch", $.__else_clause), $.branch)',
    ),
    fieldSequenceGrammar.replace(
      'field("else_branch", $.__else_clause)',
      'token(field("else_branch", $.__else_clause))',
    ),
    fieldSequenceGrammar.replace(
      'field("else_branch", $.__else_clause)',
      'prec.dynamic(1, field("else_branch", $.__else_clause))',
    ),
    fieldSequenceGrammar.replace("$.__else_clause)", '$["__else_clause"])'),
    fieldSequenceGrammar.replace("$.values", "$.__else_clause"),
    fieldSequenceGrammar.replace("$.values", "dynamic($)"),
    fieldSequenceGrammar.replace("__else_clause:", "other: ($) => $.__else_clause, __else_clause:"),
    fieldSequenceGrammar.replaceAll("__else_clause", "visible"),
    fieldSequenceGrammar.replaceAll("__else_clause", "__else_body"),
    fieldSequenceGrammar.replace(
      "__else_clause:",
      "\n// oxlint-disable-next-line rule-to-test/single-use-field-sequence\n__else_clause:",
    ),
    'export default grammar({inline: ($) => [$.__tail], rules: {root: ($) => field("x", $.__tail), __tail: ($) => seq("=", $.value)}});',
  ],
  invalid: [
    {
      code: fieldSequenceGrammar,
      errors: [{ message: /one local use inside the else_branch field/ }],
    },
    {
      code: fieldSequenceGrammar.replace(
        "seq(token(/&ELSE/i), $.values)",
        'seq(field("name", $.identifier), optional(field("alias", $.identifier)))',
      ),
      errors: [{ message: /one local use inside the else_branch field/ }],
    },
  ],
});

const inheritedFieldGrammar =
  'export default () => ({root: ($) => field("field", $.__item), __item: ($) => seq(field("field", $.identifier), optional($.format_phrase))});';
new RuleTester().run("redundant-inherited-field", redundantInheritedField, {
  valid: [
    inheritedFieldGrammar.replace('root: ($) => field("field", $.__item)', "root: ($) => $.__item"),
    inheritedFieldGrammar.replace(
      'root: ($) => field("field", $.__item)',
      'root: ($) => field("other", $.__item)',
    ),
    inheritedFieldGrammar.replace('field("field", $.identifier)', "$.identifier"),
    inheritedFieldGrammar.replace('field("field", $.identifier)', 'field("name", $.identifier)'),
    inheritedFieldGrammar.replace(
      'field("field", $.identifier)',
      'field("field", alias($.identifier, $.name))',
    ),
    inheritedFieldGrammar.replace("$.__item)", '$["__item"])'),
    inheritedFieldGrammar.replace("optional($.format_phrase)", "optional($.__item)"),
    inheritedFieldGrammar.replace("optional($.format_phrase)", "dynamic($)"),
    inheritedFieldGrammar.replaceAll("__item", "item"),
    inheritedFieldGrammar.replace("__item:", 'other: ($) => field("different", $.__item), __item:'),
    inheritedFieldGrammar.replace(
      'field("field", $.__item)',
      'alias(field("field", $.__item), $.item)',
    ),
    inheritedFieldGrammar.replace('field("field", $.__item)', 'token(field("field", $.__item))'),
    inheritedFieldGrammar.replace(
      "__item:",
      "\n// oxlint-disable-next-line rule-to-test/redundant-inherited-field\n__item:",
    ),
    'export default grammar({inline: ($) => [$.__item], rules: {root: ($) => field("field", $.__item), __item: ($) => seq(field("field", $.name), $.suffix)}});',
  ],
  invalid: [
    {
      code: inheritedFieldGrammar,
      errors: [{ message: /Every local use of __item already applies the field field/ }],
    },
    {
      code: inheritedFieldGrammar.replace(
        "__item:",
        'other: ($) => field("field", $.__item), __item:',
      ),
      errors: [{ message: /matching inner field annotation/ }],
    },
  ],
});

const fieldMarkerSeed = {
  filename: "grammar/phrases/format.js",
  code: 'export default ({kw}) => ({first: ($) => seq(kw("SIZE"), field("width", $.number_literal), $._by_keyword, field("height", $.number_literal))});',
};
const fieldMarkerTarget =
  'export default ({kw}) => ({second: ($) => seq(kw("IMAGE-SIZE"), field("width", $.number_literal), $._by_keyword, field("height", $.number_literal))});';
for (const code of [
  fieldMarkerTarget.replace('"width"', '"left"'),
  fieldMarkerTarget.replace("$.number_literal", "$._expression"),
  fieldMarkerTarget.replace("$.number_literal", "$.__local"),
  fieldMarkerTarget.replace("$.number_literal", '$["number_literal"]'),
  fieldMarkerTarget.replace("$._by_keyword", "$.__by_keyword"),
  fieldMarkerTarget.replace("$._by_keyword", "$._to_keyword"),
  fieldMarkerTarget.replace("$._by_keyword", 'kw("BY", options)'),
  fieldMarkerTarget.replace('field("height", $.number_literal)', "$.number_literal"),
  fieldMarkerTarget.replace(
    'seq(kw("IMAGE-SIZE"), field("width", $.number_literal), $._by_keyword, field("height", $.number_literal))',
    'prec.right(seq(kw("IMAGE-SIZE"), field("width", $.number_literal), $._by_keyword, field("height", $.number_literal)))',
  ),
  fieldMarkerTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-field-marker\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-field-marker", sharedFieldMarker, {
    valid: [fieldMarkerSeed, { filename: "grammar/phrases/image.js", code }],
    invalid: [],
  });
}
for (const code of [
  fieldMarkerTarget,
  fieldMarkerTarget.replace('field("height", $.number_literal)', 'field("other", $._expression)'),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-field-marker", sharedFieldMarker, {
    valid: [fieldMarkerSeed],
    invalid: [
      {
        filename: "grammar/phrases/image.js",
        code,
        errors: [{ message: /width-and-marker prefix repeats first/ }],
      },
    ],
  });
}
resetSharingCandidates();

const productSequence =
  'seq(kw("SEEK"), choice(kw("INPUT"), kw("OUTPUT"), $._stream_phrase), $._to_keyword, choice($._end_keyword, $._expression))';
const productGrammar = `export default ({kw}) => ({__seek_prefix: ($) => ${productSequence}});`;
new RuleTester().run("choice-product-extraction", choiceProductExtraction, {
  valid: [
    productGrammar.replace(
      'choice(kw("INPUT"), kw("OUTPUT"), $._stream_phrase)',
      "$.__seek_stream",
    ),
    productGrammar.replace(', kw("OUTPUT")', ""),
    productGrammar
      .replace("$._stream_phrase", 'kw("STREAM")')
      .replace("$._expression", 'kw("START")'),
    productGrammar.replace("$._stream_phrase", "getStream($)"),
    productGrammar.replace(
      "choice($._end_keyword, $._expression)",
      "optional(choice($._end_keyword, $._expression))",
    ),
    productGrammar.replace(
      "choice($._end_keyword, $._expression)",
      "choice($._end_keyword, optional($._expression))",
    ),
    productGrammar
      .replace("$._stream_phrase", "$.__seek_prefix")
      .replace("$._expression", "$.__seek_prefix"),
    ...["token", "prec.right", "prec.dynamic.bind(null, 1)"].map((wrapper) =>
      productGrammar.replace(productSequence, `${wrapper}(${productSequence})`),
    ),
    productGrammar.replace(productSequence, `alias(${productSequence}, $.seek)`),
    productGrammar.replace(productSequence, `field("body", ${productSequence})`),
    productGrammar.replace(
      "__seek_prefix:",
      "\n// oxlint-disable-next-line rule-to-test/choice-product-extraction\n__seek_prefix:",
    ),
    `const ordinary = ($) => ${productSequence};`,
  ],
  invalid: [
    { code: productGrammar, errors: [{ message: /2 independent choices form 6 combinations/ }] },
    {
      code: productGrammar.replace("$._to_keyword", 'choice(kw("TO"), kw("FROM"))'),
      errors: [{ message: /3 independent choices form 12 combinations/ }],
    },
  ],
});

const closingHoistGrammar =
  'export default () => ({a: ($) => optional(field("extent", $.__extent)), b: ($) => field("extent", $.__extent), __extent: ($) => seq("[", optional(choice($.number, $.name)), "]")});';
new RuleTester().run("closing-delimiter-hoist", closingDelimiterHoist, {
  valid: [
    closingHoistGrammar.replace('b: ($) => field("extent", $.__extent), ', ""),
    closingHoistGrammar.replace(
      'b: ($) => field("extent", $.__extent)',
      "b: ($) => alias($.__extent, $.extent)",
    ),
    closingHoistGrammar.replace(
      'b: ($) => field("extent", $.__extent)',
      "b: ($) => token($.__extent)",
    ),
    closingHoistGrammar.replace(
      'b: ($) => field("extent", $.__extent)',
      "b: ($) => prec.dynamic(1, $.__extent)",
    ),
    closingHoistGrammar.replace("$.__extent)", '$["__extent"])'),
    closingHoistGrammar.replace("$.name", "$.__extent"),
    closingHoistGrammar.replace("$.name", "getName($)"),
    closingHoistGrammar.replace('"]")', '")")'),
    closingHoistGrammar.replaceAll("__extent", "extent"),
    closingHoistGrammar.replaceAll("__extent", "__extent_body"),
    closingHoistGrammar.replace(
      "__extent:",
      "\n// oxlint-disable-next-line rule-to-test/closing-delimiter-hoist\n__extent:",
    ),
    'export default grammar({inline: ($) => [$.__extent], rules: {a: ($) => $.__extent, b: ($) => $.__extent, __extent: ($) => seq("[", $.n, "]")}});',
  ],
  invalid: [
    {
      code: closingHoistGrammar,
      errors: [{ message: /complete delimited value at 2 local uses/ }],
    },
    {
      code: closingHoistGrammar.replace(
        "optional(choice($.number, $.name))",
        'field("size", $.number)',
      ),
      errors: [{ message: /closing delimiter at each caller/ }],
    },
  ],
});

const forwardedAliasSeed = {
  filename: "grammar.js",
  code: "export default grammar({rules: {include_statement: ($) => $.__include, include_file_reference: ($) => $.__include}});",
};
const forwardedAliasTarget =
  "export default () => ({case_body: ($) => prec.right(choice($.branch, alias($.include_statement, $.include_file_reference)))});";
for (const code of [
  forwardedAliasTarget.replace("$.include_statement", "$.missing"),
  forwardedAliasTarget.replace("$.include_file_reference", "$.different"),
  forwardedAliasTarget.replace("$.include_statement", '$["include_statement"]'),
  forwardedAliasTarget.replace("$.include_file_reference", '"include"'),
  forwardedAliasTarget.replace(
    "alias($.include_statement, $.include_file_reference)",
    "$.include_file_reference",
  ),
  forwardedAliasTarget.replace(
    "alias($.include_statement, $.include_file_reference)",
    "token(alias($.include_statement, $.include_file_reference))",
  ),
  forwardedAliasTarget.replace("prec.right", "prec.dynamic.bind(null, 1)"),
  forwardedAliasTarget.replace(
    "case_body:",
    "\n// oxlint-disable-next-line rule-to-test/forwarded-alias-reuse\ncase_body:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("forwarded-alias-reuse", forwardedAliasReuse, {
    valid: [forwardedAliasSeed, { filename: "grammar/statements/case.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("forwarded-alias-reuse", forwardedAliasReuse, {
  valid: [forwardedAliasSeed],
  invalid: [
    {
      filename: "grammar/statements/case.js",
      code: forwardedAliasTarget,
      errors: [{ message: /both forward to __include/ }],
    },
  ],
});
for (const source of [
  'export default () => ({a: ($) => $.__x, a: ($) => seq("X", $.value), b: ($) => $.__x, use: ($) => alias($.a, $.b)});',
  "export default () => ({a: ($) => $.visible, b: ($) => $.visible, use: ($) => alias($.a, $.b)});",

  "export default () => ({a: ($) => $.__x, b: ($) => $.__y, use: ($) => alias($.a, $.b)});",
  "export default () => ({a: ($) => prec.right($.__x), b: ($) => $.__x, use: ($) => alias($.a, $.b)});",
  "export default () => ({a: ($) => $.__x, b: ($) => $.visible, use: ($) => alias($.a, $.b)});",
]) {
  resetSharingCandidates();
  new RuleTester().run("forwarded-alias-reuse", forwardedAliasReuse, {
    valid: [source],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("forwarded-alias-reuse", forwardedAliasReuse, {
  valid: [],
  invalid: [
    {
      code: "export default () => ({a: ($) => $.__x, b: ($) => $.__x, use: ($) => alias($.a, $.b)});",
      errors: [{ message: /using \$\.b directly/ }],
    },
  ],
});
resetSharingCandidates();

resetSharingCandidates();
new RuleTester().run("forwarded-alias-reuse", forwardedAliasReuse, {
  valid: [
    { filename: "grammar/a.js", code: "export default () => ({a: ($) => $.__x});" },
    { filename: "grammar/b.js", code: "export default () => ({b: ($) => $.__x});" },
    { filename: "grammar/use.js", code: "export default () => ({use: ($) => alias($.a, $.b)});" },
  ],
  invalid: [],
});
resetSharingCandidates();

const recursiveItemGrammar =
  'export default () => ({_pairs: ($) => seq($._pair, optional(seq(",", $._pairs))), _pair: ($) => seq(field("label", $.expression), ",", field("value", $.expression))});';
new RuleTester().run("recursive-item-inline", recursiveItemInline, {
  valid: [
    recursiveItemGrammar.replace("seq($._pair,", "seq(alias($._pair, $.pair),"),
    recursiveItemGrammar.replace("seq($._pair,", 'seq(field("item", $._pair),'),
    recursiveItemGrammar.replace("seq($._pair,", 'seq($["_pair"],'),
    recursiveItemGrammar.replaceAll("_pairs", "pairs"),
    recursiveItemGrammar.replace("_pair:", "another: ($) => $._pair, _pair:"),
    recursiveItemGrammar.replace('optional(seq(",", $._pairs))', 'optional(seq(";", $._pairs))'),
    recursiveItemGrammar.replace('optional(seq(",", $._pairs))', 'optional(seq(",", $._other))'),
    recursiveItemGrammar.replace("$.expression", "getValue($)"),
    recursiveItemGrammar.replace(
      'field("label", $.expression), ",", field("value", $.expression)',
      '$.expression, ",", $.expression',
    ),
    recursiveItemGrammar.replace(
      "_pair:",
      "\n// oxlint-disable-next-line rule-to-test/recursive-item-inline\n_pair:",
    ),
    'export default grammar({inline: ($) => [$._pair], rules: {_pairs: ($) => seq($._pair, optional(seq(",", $._pairs))), _pair: ($) => seq(field("label", $.x), ",", field("value", $.x))}});',
  ],
  invalid: [
    {
      code: recursiveItemGrammar,
      errors: [{ message: /item of the hidden recursive list _pairs/ }],
    },
    {
      code: recursiveItemGrammar.replaceAll("_pair", "__pair"),
      errors: [{ message: /keeping the comma continuation unchanged/ }],
    },
  ],
});

const leftRecursiveListGrammar =
  'export default () => ({__records: ($) => seq($.__record, repeat(seq(",", $.__record)))});';
new RuleTester().run("left-recursive-list", leftRecursiveList, {
  valid: [
    leftRecursiveListGrammar.replace("__records:", "records:"),
    leftRecursiveListGrammar.replace("repeat(", "repeat1("),
    leftRecursiveListGrammar.replace('seq(",", $.__record)', 'seq(";", $.__record)'),
    leftRecursiveListGrammar.replace('seq(",", $.__record)', 'seq(",", $.__other)'),
    leftRecursiveListGrammar.replaceAll("$.__record", '$["__record"]'),
    leftRecursiveListGrammar.replaceAll("$.__record", "$.__records"),
    leftRecursiveListGrammar.replaceAll("$.__record", 'kw("FLAG")'),
    leftRecursiveListGrammar.replace(
      'seq($.__record, repeat(seq(",", $.__record)))',
      'prec.right(seq($.__record, repeat(seq(",", $.__record))))',
    ),
    leftRecursiveListGrammar.replace(
      "__records:",
      "\n// oxlint-disable-next-line rule-to-test/left-recursive-list\n__records:",
    ),
    'export default grammar({inline: ($) => [$.__records], rules: {__records: ($) => seq($.record, repeat(seq(",", $.record)))}});',
    'export default () => ({__records: ($) => seq(field("first", $.record), repeat(seq(",", field("next", $.record))))});',
  ],
  invalid: [
    { code: leftRecursiveListGrammar, errors: [{ message: /hidden left-recursive sequence/ }] },
    {
      code: leftRecursiveListGrammar.replaceAll("$.__record", 'field("record", $.record)'),
      errors: [{ message: /one-item minimum/ }],
    },
    {
      code: leftRecursiveListGrammar.replaceAll("$.__record", "alias($.__entry, $.record)"),
      errors: [{ message: /fields, aliases and order/ }],
    },
  ],
});

const repeatedSignatureSeed = {
  filename: "grammar/statements/interface.js",
  code: 'export default ({kw}) => ({first: ($) => seq(kw("METHOD"), repeat($._modifiers), $._method_signature)});',
};
const repeatedSignatureTarget =
  'export default ({kw}) => ({second: ($) => seq(kw("METHOD"), kw("ABSTRACT"), repeat($._modifiers), $._method_signature, $._terminator)});';
for (const code of [
  repeatedSignatureTarget.replace("$._modifiers", "$._other_modifiers"),
  repeatedSignatureTarget.replace("$._modifiers", "$.__modifiers"),
  repeatedSignatureTarget.replace("$._modifiers", '$["_modifiers"]'),
  repeatedSignatureTarget.replace("$._method_signature", "$._other_signature"),
  repeatedSignatureTarget.replace("$._method_signature", "$.__method_signature"),
  repeatedSignatureTarget.replace("$._method_signature", "$.method_signature"),
  repeatedSignatureTarget.replace("$._method_signature", "$._end_keyword"),
  repeatedSignatureTarget.replace("repeat(", "repeat1("),
  repeatedSignatureTarget.replace("$._modifiers", "getModifiers($)"),
  repeatedSignatureTarget.replace(
    'seq(kw("METHOD"), kw("ABSTRACT"), repeat($._modifiers), $._method_signature, $._terminator)',
    'prec.right(seq(kw("METHOD"), kw("ABSTRACT"), repeat($._modifiers), $._method_signature, $._terminator))',
  ),
  repeatedSignatureTarget.replace(
    "second:",
    "\n// oxlint-disable-next-line rule-to-test/shared-repeated-signature\nsecond:",
  ),
]) {
  resetSharingCandidates();
  new RuleTester().run("shared-repeated-signature", sharedRepeatedSignature, {
    valid: [repeatedSignatureSeed, { filename: "grammar/statements/class.js", code }],
    invalid: [],
  });
}
resetSharingCandidates();
new RuleTester().run("shared-repeated-signature", sharedRepeatedSignature, {
  valid: [repeatedSignatureSeed],
  invalid: [
    {
      filename: "grammar/statements/class.js",
      code: repeatedSignatureTarget,
      errors: [{ message: /signature also appear in first/ }],
    },
  ],
});
resetSharingCandidates();
new RuleTester().run("shared-repeated-signature", sharedRepeatedSignature, {
  valid: [],
  invalid: [
    {
      code: 'export default ({kw}) => ({first: ($) => seq(kw("METHOD"), repeat($._modifiers), $._method_signature), second: ($) => seq(kw("ABSTRACT"), repeat($._modifiers), $._method_signature)});',
      errors: [{ message: /required-field metadata/ }],
    },
  ],
});
resetSharingCandidates();

console.log("✓ Optimizer lint plugin tests passed successfully");
