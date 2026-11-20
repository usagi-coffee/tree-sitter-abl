import {
  callName,
  dslSignature,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { usedOutsideFile } from "../helpers/project-metadata.js";

const ruleId = "on-widget-tail-anywhere";
const targetName = "__on_ui_event_target";
const tailName = "__on_ui_event_widgets_tail";
const anywhere = 'alias(kw("ANYWHERE"),$.anywhere)';
const ofPhrase = "alias($.__on_of_phrase,$.of_phrase)";
const widget = 'field("widget",$.widget_phrase)';
const ui = "seq($.__on_ui_events,$.__on_ui_event_target,$.__on_trigger_action)";
const database = [
  'seq($.__on_database_event_head,seq(field("object",$._qualified_identifier),optional($.__on_database_event_tail),choice($.__on_revert_action,$._statement)))',
  'seq(field("event",$._kw_delete),$._kw_of,field("widget",alias($._frame_browse_menu_widget,$.widget_phrase)),optional(' +
    anywhere +
    "),$.__on_trigger_action)",
].join(",");
const key =
  'seq(field("event",$.__on_key_label),field("function",alias($.__on_key_function,$.key_function)),$._terminator)';

const measuredRules = new Map([
  [
    "on_statement",
    "prec.right(seq($._kw_on,choice(" +
      ui +
      ",choice(" +
      database +
      ")," +
      key +
      ",$.__on_web_notify_branch)))",
  ],
  [
    targetName,
    "choice(" +
      anywhere +
      ",seq(" +
      ofPhrase +
      ",optional($." +
      tailName +
      "),optional(" +
      anywhere +
      ")))",
  ],
  [tailName, "seq($._kw_or,seq($.__on_ui_events," + ofPhrase + "),optional($." + tailName + "))"],
  ["__on_ui_events", 'seq(field("event",$.__on_ui_event),optional(seq(",",$.__on_ui_events)))'],
  ["__on_ui_anywhere_branch", "seq($.__on_ui_events," + anywhere + ")"],
  ["__on_of_phrase", "seq($._kw_of," + widget + ",optional($.__on_of_widget_tail))"],
  ["__on_of_widget_tail", 'seq(",",' + widget + ",optional($.__on_of_widget_tail))"],
  [
    "__on_trigger_action",
    'choice($.__on_revert_action,seq(field("function",alias($.__on_ui_key_function,$.key_function)),$._terminator),$._statement,seq(kw("PERSISTENT"),$._kw_run,field("procedure",$.identifier),optional($.__on_persistent_run_suffix),$._terminator))',
  ],
]);
const expectedUses = new Map([
  [targetName, 1],
  [tailName, 2],
  ["__on_ui_events", 4],
  ["__on_of_phrase", 2],
  ["__on_of_widget_tail", 2],
  ["__on_trigger_action", 2],
]);

function isWidgetEventList(node) {
  if (
    node?.type !== "VariableDeclaration" ||
    node.kind !== "const" ||
    node.declarations.length !== 1
  )
    return false;
  const [eventList] = node.declarations;
  const array = eventList.init;
  return (
    eventList.id.type === "Identifier" &&
    eventList.id.name === "ON_WIDGET_EVENTS" &&
    array?.type === "ArrayExpression" &&
    array.elements.length > 0 &&
    array.elements.every((entry) => entry?.type === "Literal" && typeof entry.value === "string")
  );
}

function isWidgetEventChoice(node) {
  if (callName(node) !== "choice" || node.arguments.length !== 1) return false;
  const [spread] = node.arguments;
  if (spread.type !== "SpreadElement") return false;
  const mapped = spread.argument;
  if (callName(mapped) !== "ON_WIDGET_EVENTS.map" || mapped.arguments.length !== 1) return false;
  const [callback] = mapped.arguments;
  if (
    callback.type !== "ArrowFunctionExpression" ||
    callback.async ||
    callback.params.length !== 1 ||
    callback.params[0].type !== "Identifier" ||
    callback.params[0].name !== "word" ||
    dslSignature(callback.body) !== "kw(word,ObjectExpression)"
  )
    return false;

  const options = callback.body.arguments[1];
  if (options.type !== "ObjectExpression" || options.properties.length !== 2) return false;
  const { properties } = options;
  const [precedence, alias] = properties;
  return (
    properties.every(
      (entry) => entry.type === "Property" && !entry.computed && entry.value.type === "Literal",
    ) &&
    ruleName(precedence) === "precedence" &&
    precedence.value.value === "keyword" &&
    ruleName(alias) === "alias" &&
    alias.value.value === false
  );
}

export const onWidgetTailAnywhere = rule((context) => {
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    "Program:exit"(program) {
      const [eventList, declaration] = program.body;
      const factory = declaration?.declaration;
      if (
        program.body.length !== 2 ||
        declaration.type !== "ExportDefaultDeclaration" ||
        factory?.type !== "ArrowFunctionExpression" ||
        factory.async ||
        factory.params.length !== 1 ||
        factory.params[0].type !== "ObjectPattern" ||
        factory.body.type !== "ObjectExpression" ||
        !isWidgetEventList(eventList)
      )
        return;
      const bindings = factory.params[0].properties;
      if (bindings.length !== 1 || !bindings[0].shorthand || bindings[0].value.name !== "kw")
        return;

      const properties = factory.body.properties;
      const local = new Map(properties.map((entry) => [ruleName(entry), entry]));
      if (
        !local.has(targetName) ||
        local.size !== properties.length ||
        ["anywhere", "of_phrase", "widget_phrase"].some((name) => local.has(name))
      )
        return;
      const eventChoice = local.get("__on_ui_event_name");
      if (
        !eventChoice ||
        properties.some(
          (entry) =>
            !isRuleProperty(entry) ||
            entry.computed ||
            entry.value.async ||
            entry.value.params.length !== 1 ||
            (entry === eventChoice
              ? !isWidgetEventChoice(entry.value.body)
              : !isStaticDsl(entry.value.body)),
        )
      )
        return;

      for (const [name, signature] of measuredRules) {
        const entry = local.get(name);
        if (
          !entry ||
          dslSignature(entry.value.body) !== signature ||
          suppressed(entry) ||
          suppressed(entry.value.body)
        )
          return;
      }

      const counts = new Map();
      for (const entry of properties) {
        for (const name of referencedSymbols(entry.value.body)) {
          if (expectedUses.has(name)) counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      }
      for (const [name, expected] of expectedUses) {
        if (
          (counts.get(name) ?? 0) !== expected ||
          usedOutsideFile(context, name, { wholeName: true })
        )
          return;
      }

      report(
        context,
        local.get(targetName).value.body.arguments[1].arguments[2],
        ruleId,
        "Try making the trailing ANYWHERE alias the terminal alternative of the right-recursive ON OR widget tail. Keep the first OF phrase, standalone ANYWHERE branch, event and widget fields, and right precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  };
}, "Suggest making ANYWHERE the terminal alternative of the ON widget tail");
