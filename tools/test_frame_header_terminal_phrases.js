import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { frameHeaderTerminalPhrases } from "../oxlint/index.js";

const name = "frame-header-terminal-phrases";
const keyword = 'kw("FRAME", { offset: 4 })';
const record = 'seq(field("record", $._qualified_identifier), $._kw_except, $._field_references)';
const members = "choice(" + record + ", optional($.__frame_form_items))";
const header = "optional($.__frame_header_section)";
const frames = "repeat($.frame_phrase)";
const repeatHeader = "optional($.__frame_head_items)";
const headItems = "prec.right(seq($.__frame_head_item, " + repeatHeader + "))";
const headerAlias = 'alias(kw("HEADER"), $.header)';
const backgroundAlias = 'alias(kw("BACKGROUND"), $.background)';
const before = `export default ({ kw }) => ({
  frame_definition: ($) => seq($.__frame_prefix, $._terminator),
  __frame_prefix: ($) => seq($._define_scope_prefix, ${keyword}, $.__frame_body),
  __frame_body: ($) => seq(field("name", $._frame_name), ${members}, ${header}, ${frames}),
  __frame_form_items: ($) => prec.right(seq($.__frame_form_item, optional($.__frame_form_items))),
  __frame_header_section: ($) =>
    seq(choice(${headerAlias}, ${backgroundAlias}), $.__frame_head_items),
  __frame_head_items: ($) => ${headItems},
  __frame_head_item: ($) => choice(
    prec.left("frame_skip", seq($._kw_skip, optional(field("skip", seq($._parenthesized_expression_prefix, ")"))))),
    $._display_space_phrase,
    seq(field("value", $._expression), optional($.at_phrase), optional($.__frame_display_options)),
  ),
});`;
const after = before
  .replace(
    header + ", " + frames,
    "optional(choice($.__frame_header_section, repeat1($.frame_phrase)))",
  )
  .replace(repeatHeader, "optional(choice($.__frame_head_items, repeat1($.frame_phrase)))");
const message =
  /nonempty frame phrase sequence.*terminal alternative.*right-recursive FRAME header item list/;
const appendRule = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (part, rule = "rule-to-test/" + name) =>
  before.replace(part, "\n  // oxlint-disable-next-line " + rule + "\n  " + part);
const directory = mkdtempSync(join(tmpdir(), "abl-frame-header-terminal-phrases-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "frame.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    join(directory, "grammar", "precedences", "binary.js"),
    "export default ($) => [[$.binary_expression, $.__frame_head_item]];",
  );
  new RuleTester().run(name, frameHeaderTerminalPhrases, {
    valid: [
      fixture("measured terminal alternative", after),
      fixture("different terminator", before.replace("$._terminator", "$._terminator_dot")),
      fixture("different scope prefix", before.replace("$._define_scope_prefix", "$._kw_define")),
      fixture("different abbreviation", before.replace("offset: 4", "offset: 3")),
      fixture(
        "additional keyword option",
        before.replace("offset: 4", 'offset: 4, alias: "OTHER"'),
      ),
      fixture("different frame name field", before.replace('field("name"', 'field("frame"')),
      fixture("different EXCEPT field", before.replace('field("record"', 'field("source"')),
      fixture("frames required after header", before.replace(frames, "repeat1($.frame_phrase)")),
      fixture("header required", before.replace(header, "$.__frame_header_section")),
      fixture(
        "frame phrases before header",
        before.replace(header + ", " + frames, frames + ", " + header),
      ),
      fixture(
        "different HEADER alias",
        before.replace(headerAlias, 'alias(kw("HEADER"), $.other)'),
      ),
      fixture("missing BACKGROUND alias", before.replace(backgroundAlias, 'kw("BACKGROUND")')),
      fixture(
        "header items may be empty",
        before.replace(
          backgroundAlias + "), $.__frame_head_items",
          backgroundAlias + "), " + repeatHeader,
        ),
      ),
      fixture(
        "different continuation",
        before.replace(headItems, headItems.replace(repeatHeader, "optional($.__frame_body)")),
      ),
      fixture(
        "different header precedence",
        before.replace(headItems, headItems.replace("prec.right", "prec.left")),
      ),
      fixture("different skip precedence", before.replace('"frame_skip"', '"other_skip"')),
      fixture("different header item field", before.replace('field("value"', 'field("other"')),
      fixture("extra body use", appendRule("other: ($) => $.__frame_body")),
      fixture(
        "extra aliased header items",
        appendRule("other: ($) => alias($.__frame_head_items, $.items)"),
      ),
      fixture("extra header section use", appendRule("other: ($) => $.__frame_header_section")),
      fixture(
        "computed header reference",
        before.replace(header, 'optional($["__frame_header_section"])'),
      ),
      fixture("computed body key", before.replace("__frame_body:", '["__frame_body"]:')),
      fixture("spread in rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("duplicate header body", appendRule("__frame_head_items: ($) => $.other")),
      fixture("local frame phrase", appendRule("frame_phrase: ($) => $.other")),
      fixture("local HEADER alias target", appendRule("header: ($) => $.other")),
      fixture("local BACKGROUND alias target", appendRule("background: ($) => $.other")),
      fixture(
        "same-file metadata",
        before + "\nexport const inline = ($) => [$.__frame_head_items];",
      ),
      fixture("suppressed repetition", suppress(frames)),
      fixture("suppressed header items", suppress("__frame_head_items: ($) => " + headItems)),
    ],
    invalid: [
      { ...fixture("measured original layout"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress(frames, "rule-to-test/recurse")),
        errors: [{ message }],
      },
    ],
  });

  const blockedSources = [
    [
      "root inline metadata",
      join(directory, "grammar.js"),
      "export default grammar({inline: ($) => [$.__frame_head_items]});",
    ],
    [
      "external body precedence",
      join(directory, "grammar", "precedences", "other.js"),
      "export default ($) => [[$.__frame_body, $.other]];",
    ],
    [
      "external computed private reference",
      join(directory, "grammar", "statements", "other.js"),
      'export default () => ({ other: ($) => $["__frame_header_section"] });',
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(name + " " + label, frameHeaderTerminalPhrases, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
