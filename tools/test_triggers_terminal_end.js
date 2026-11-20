import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { triggersTerminalEnd } from "../oxlint/index.js";

const name = "triggers-terminal-end";
const body =
  'prec.right(seq(":", optional($.__triggers_entries), $._kw_end, optional($._kw_triggers)))';
const eventField = 'field("event", $.__trigger_event_list)';
const anywhere = 'optional(alias(kw("ANYWHERE"), $.anywhere))';
const entry = "seq($._kw_on, " + eventField + ", " + anywhere + ", $.__trigger_action";
const continuation = "optional($.__triggers_entries)";
const entries = entry + ", " + continuation + ")";
const action =
  'choice(alias(seq(kw("DO"), $.__trigger_body_tail), $.trigger_body), $.__persistent_trigger)';
const eventList = 'seq($._events, optional(seq(",", $.__trigger_event_list)))';
const before = [
  "export default ({ kw }) => ({",
  "  trigger_phrase: ($) => choice(seq($._kw_triggers, $.__triggers_body), seq($._kw_on, $.__trigger_event_list)),",
  "  __triggers_body: ($) => " + body + ",",
  "  __triggers_entries: ($) => " + entries + ",",
  "  __trigger_action: ($) => " + action + ",",
  "  __trigger_event_list: ($) => " + eventList + ",",
  "});",
].join("\n");
const after = before
  .replace(body, 'prec.right(seq(":", $.__triggers_entries, optional($._kw_triggers)))')
  .replace(entries, "choice(seq($.__triggers_entry, $.__triggers_entries), $._kw_end)")
  .replace("\n});", "\n  __triggers_entry: ($) => " + entry + "),\n});");
const appendRule = (rule) => before.replace("\n});", "\n  " + rule + ",\n});");
const suppress = (target, id = "rule-to-test/" + name) =>
  before.replace(target, "// oxlint-disable-next-line " + id + "\n  " + target);
const message =
  /complete ON entry into a private helper.*required END the terminal alternative.*TRIGGERS entry list/;

const directory = mkdtempSync(join(tmpdir(), "abl-triggers-terminal-end-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "phrases", "trigger.js"),
});

try {
  mkdirSync(join(directory, "grammar", "phrases"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  new RuleTester().run(name, triggersTerminalEnd, {
    valid: [
      fixture("measured terminal alternative", after),
      fixture(
        "different body precedence",
        before.replace(body, body.replace("prec.right", "prec.left")),
      ),
      fixture(
        "required closing TRIGGERS",
        before.replace("optional($._kw_triggers)", "$._kw_triggers"),
      ),
      fixture("optional END", before.replace("$._kw_end", "optional($._kw_end)")),
      fixture(
        "different event field",
        before.replace(eventField, 'field("value", $.__trigger_event_list)'),
      ),
      fixture(
        "different ANYWHERE alias",
        before.replace(anywhere, anywhere.replace("$.anywhere", "$.other")),
      ),
      fixture(
        "different action alias",
        before.replace(action, action.replace("$.trigger_body", "$.other")),
      ),
      fixture(
        "different event separator",
        before.replace(eventList, eventList.replace('","', '";"')),
      ),
      fixture("required continuation", before.replace(entries, entry + ", $.__triggers_entries)")),
      fixture("different continuation", before.replace(entries, entry + ", optional($.other))")),
      fixture(
        "different standalone ON arm",
        before.replace("seq($._kw_on, $.__trigger_event_list)", "$._kw_on"),
      ),
      fixture("shared entries", before.replaceAll("__triggers_entries", "_triggers_entries")),
      fixture("extra body use", appendRule("other: ($) => $.__triggers_body")),
      fixture(
        "extra aliased list use",
        appendRule("other: ($) => alias($.__triggers_entries, $.entries)"),
      ),
      fixture("entry name collision", appendRule("__triggers_entry: ($) => $.other")),
      fixture("local ANYWHERE alias target", appendRule("anywhere: ($) => $.other")),
      fixture(
        "computed entries reference",
        before.replace("$.__triggers_entries", '$["__triggers_entries"]'),
      ),
      fixture("computed body key", before.replace("__triggers_body:", '["__triggers_body"]:')),
      fixture("spread in rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("duplicate entries", appendRule("__triggers_entries: ($) => $.other")),
      fixture(
        "same-file metadata",
        before + "\nexport const inline = ($) => [$.__triggers_entries];",
      ),
      fixture("suppressed body", suppress("__triggers_body:")),
      fixture("suppressed entries", suppress("__triggers_entries:")),
    ],
    invalid: [
      { ...fixture("measured original layout"), errors: [{ message }] },
      {
        ...fixture(
          "unrelated ANYWHERE rule",
          suppress("__triggers_entries:", "rule-to-test/inline-keyword-owner"),
        ),
        errors: [{ message }],
      },
    ],
  });

  const blockedSources = [
    [
      "root grammar metadata",
      join(directory, "grammar.js"),
      "export default grammar({inline: ($) => [$.__triggers_entries]});",
    ],
    [
      "external body precedence",
      join(directory, "grammar", "precedences", "other.js"),
      "export default ($) => [[$.__triggers_body, $.other]];",
    ],
    [
      "external computed private reference",
      join(directory, "grammar", "phrases", "other.js"),
      'export default () => ({ other: ($) => $["__triggers_entries"] });',
    ],
    [
      "external entry name collision",
      join(directory, "grammar", "phrases", "other.js"),
      "export default () => ({ __triggers_entry: ($) => $.other });",
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(name + " " + label, triggersTerminalEnd, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
