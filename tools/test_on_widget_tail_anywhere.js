import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { onWidgetTailAnywhere } from "../oxlint/index.js";

const name = "on-widget-tail-anywhere";
const anywhere = 'alias(kw("ANYWHERE"), $.anywhere)';
const ofPhrase = "alias($.__on_of_phrase, $.of_phrase)";
const tail = "optional($.__on_ui_event_widgets_tail)";
const tailBody = "seq($._kw_or, seq($.__on_ui_events, " + ofPhrase + "), " + tail + ")";
const firstGroup = "seq(" + ofPhrase + ", " + tail + ", optional(" + anywhere + "))";
const target = "choice(" + anywhere + ", " + firstGroup + ")";
const widget = 'field("widget", $.widget_phrase)';
const before = `const ON_WIDGET_EVENTS = ["CHOOSE", "LEAVE"];
export default ({ kw }) => ({
  on_statement: ($) => prec.right(seq($._kw_on, choice(
    seq($.__on_ui_events, $.__on_ui_event_target, $.__on_trigger_action),
    choice(
      seq($.__on_database_event_head, seq(field("object", $._qualified_identifier), optional($.__on_database_event_tail), choice($.__on_revert_action, $._statement))),
      seq(field("event", $._kw_delete), $._kw_of, field("widget", alias($._frame_browse_menu_widget, $.widget_phrase)), optional(${anywhere}), $.__on_trigger_action),
    ),
    seq(field("event", $.__on_key_label), field("function", alias($.__on_key_function, $.key_function)), $._terminator),
    $.__on_web_notify_branch,
  ))),
  __on_ui_event_target: ($) => ${target},
  __on_ui_event_widgets_tail: ($) => ${tailBody},
  __on_ui_events: ($) => seq(field("event", $.__on_ui_event), optional(seq(",", $.__on_ui_events))),
  __on_ui_anywhere_branch: ($) => seq($.__on_ui_events, ${anywhere}),
  __on_of_phrase: ($) => seq($._kw_of, ${widget}, optional($.__on_of_widget_tail)),
  __on_of_widget_tail: ($) => seq(",", ${widget}, optional($.__on_of_widget_tail)),
  __on_trigger_action: ($) => choice($.__on_revert_action, seq(field("function", alias($.__on_ui_key_function, $.key_function)), $._terminator), $._statement, seq(kw("PERSISTENT"), $._kw_run, field("procedure", $.identifier), optional($.__on_persistent_run_suffix), $._terminator)),
  __on_ui_event_name: ($) =>
    choice(...ON_WIDGET_EVENTS.map((word) => kw(word, { precedence: "keyword", alias: false }))),
});`;
const folded = before
  .replace(firstGroup, "seq(" + ofPhrase + ", " + tail + ")")
  .replace(tailBody, "choice(" + tailBody + ", " + anywhere + ")");
const message = /trailing ANYWHERE alias.*terminal alternative.*right-recursive ON OR widget tail/;
const appendRule = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (part, rule = "rule-to-test/" + name) =>
  before.replace(part, "\n  // oxlint-disable-next-line " + rule + "\n  " + part);
const directory = mkdtempSync(join(tmpdir(), "abl-on-widget-tail-anywhere-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "on.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  new RuleTester().run(name, onWidgetTailAnywhere, {
    valid: [
      fixture("measured terminal alternative", folded),
      fixture("changed right precedence", before.replace("prec.right", "prec.left")),
      fixture(
        "changed UI trigger",
        before.replace(
          "seq($.__on_ui_events, $.__on_ui_event_target, $.__on_trigger_action)",
          "seq($.__on_ui_events, $.__on_ui_event_target, $._statement)",
        ),
      ),
      fixture(
        "changed trigger terminator",
        before.replace("$._terminator), $._statement", "$._terminator_dot), $._statement"),
      ),
      fixture(
        "changed database widget alias",
        before.replace("$.widget_phrase)), optional", "$.target)), optional"),
      ),
      fixture("no standalone ANYWHERE", before.replace(target, firstGroup)),
      fixture(
        "required trailing ANYWHERE",
        before.replace(firstGroup, firstGroup.replace("optional(" + anywhere + ")", anywhere)),
      ),
      fixture(
        "different standalone alias",
        before.replace(target, target.replace("$.anywhere", "$.different")),
      ),
      fixture(
        "different trailing alias",
        before.replace(firstGroup, firstGroup.replace("$.anywhere", "$.different")),
      ),
      fixture(
        "different ANYWHERE keyword options",
        before.replace(
          firstGroup,
          firstGroup.replace('kw("ANYWHERE")', 'kw("ANYWHERE", { offset: 3 })'),
        ),
      ),
      fixture(
        "different first OF alias",
        before.replace(firstGroup, firstGroup.replace("$.of_phrase", "$.different")),
      ),
      fixture(
        "different OR OF alias",
        before.replace(tailBody, tailBody.replace("$.of_phrase", "$.different")),
      ),
      fixture(
        "different OR marker",
        before.replace(tailBody, tailBody.replace("$._kw_or", "$._kw_and")),
      ),
      fixture(
        "required recursive continuation",
        before.replace(tailBody, tailBody.replace(tail, "$.__on_ui_event_widgets_tail")),
      ),
      fixture(
        "different event field",
        before.replace('field("event", $.__on_ui_event)', 'field("event_name", $.__on_ui_event)'),
      ),
      fixture("different widget field", before.replace(widget, 'field("target", $.widget_phrase)')),
      fixture(
        "computed target key",
        before.replace("__on_ui_event_target:", '["__on_ui_event_target"]:'),
      ),
      fixture(
        "computed unseen tail reference",
        appendRule('other: ($) => $["__on_ui_event_widgets_tail"]'),
      ),
      fixture("spread in rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("duplicate rule", appendRule("__on_ui_event_target: ($) => $.other")),
      fixture("extra target use", appendRule("other: ($) => $.__on_ui_event_target")),
      fixture(
        "extra aliased recursive-tail use",
        appendRule("other: ($) => alias($.__on_ui_event_widgets_tail, $.targets)"),
      ),
      fixture("extra OF use", appendRule("other: ($) => $.__on_of_phrase")),
      fixture("defined alias target", appendRule("anywhere: ($) => $.other")),
      fixture("computed event names", before.replace('"LEAVE"', "eventName()")),
      fixture("dynamic event keyword mapping", before.replace("alias: false", "alias: true")),
      fixture(
        "event keyword options supplied by an identifier",
        before.replace('{ precedence: "keyword", alias: false }', "ObjectExpression"),
      ),
      fixture(
        "spread argument lookalike",
        before.replace(
          '...ON_WIDGET_EVENTS.map((word) => kw(word, { precedence: "keyword", alias: false }))',
          "SpreadElement",
        ),
      ),
      fixture(
        "metadata in factory module",
        before + "\nexport const inline = ($) => [$.__on_ui_event_widgets_tail];",
      ),
      fixture(
        "suppressed trailing alias",
        before.replace(
          firstGroup,
          firstGroup.replace(
            "optional(" + anywhere + ")",
            "\n  // oxlint-disable-next-line rule-to-test/" +
              name +
              "\n  optional(" +
              anywhere +
              ")",
          ),
        ),
      ),
      fixture("suppressed tail helper", suppress("__on_ui_event_widgets_tail: ($) => " + tailBody)),
      fixture("suppressed ON statement", suppress("on_statement:")),
    ],
    invalid: [
      { ...fixture("measured original layout"), errors: [{ message }] },
      {
        ...fixture(
          "unrelated suppression",
          suppress("__on_ui_event_target:", "rule-to-test/single-use-choice"),
        ),
        errors: [{ message }],
      },
    ],
  });

  const blockedSources = [
    [
      "root inline metadata",
      join(directory, "grammar.js"),
      "export default grammar({inline: ($) => [$.__on_ui_event_widgets_tail]});",
    ],
    [
      "external target precedence",
      join(directory, "grammar", "precedences", "on.js"),
      "export default ($) => [[$.__on_ui_event_target, $.other]];",
    ],
    [
      "external computed OF use",
      join(directory, "grammar", "statements", "other.js"),
      'export default () => ({ other: ($) => $["__on_of_phrase"] });',
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(name + " " + label, onWidgetTailAnywhere, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
