import { report, rule } from "../helpers.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "triggers-terminal-end";
const bodyName = "__triggers_body";
const entriesName = "__triggers_entries";
const measuredRules = new Map([
  [
    "trigger_phrase",
    "choice(seq($._kw_triggers,$.__triggers_body),seq($._kw_on,$.__trigger_event_list))",
  ],
  [
    bodyName,
    'prec.right(seq(":",optional($.__triggers_entries),$._kw_end,optional($._kw_triggers)))',
  ],
  [
    entriesName,
    'seq($._kw_on,field("event",$.__trigger_event_list),optional(alias(kw("ANYWHERE"),$.anywhere)),$.__trigger_action,optional($.__triggers_entries))',
  ],
  [
    "__trigger_action",
    'choice(alias(seq(kw("DO"),$.__trigger_body_tail),$.trigger_body),$.__persistent_trigger)',
  ],
  ["__trigger_event_list", 'seq($._events,optional(seq(",",$.__trigger_event_list)))'],
]);
const expectedUses = new Map([
  [bodyName, 1],
  [entriesName, 2],
  ["__triggers_entry", 0],
  ["__trigger_action", 1],
  ["__trigger_event_list", 3],
]);

export const triggersTerminalEnd = rule(
  (context) => ({
    "Program:exit"(program) {
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (
        !local ||
        ["anywhere", "trigger_body", "_kw_triggers", "_kw_on", "_kw_end", "_events"].some((name) =>
          local.has(name),
        )
      )
        return;

      report(
        context,
        local.get(bodyName),
        ruleId,
        "Try extracting each complete ON entry into a private helper and making required END the terminal alternative of the TRIGGERS entry list. Preserve the event field, action aliases, optional closing TRIGGERS, and right precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest making END the terminal alternative of the TRIGGERS entry list",
);
