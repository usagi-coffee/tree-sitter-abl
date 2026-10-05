import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const shortKeywordHelperName = rule((context) => {
  const properties = [],
    exposed = new Set();
  const symbolName = (node) =>
    memberName(node) ??
    (node?.type === "MemberExpression" &&
    node.computed &&
    node.object.type === "Identifier" &&
    node.object.name === "$" &&
    node.property.type === "Literal" &&
    typeof node.property.value === "string"
      ? node.property.value
      : null);
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) === "alias" && node.arguments.length === 2) {
        const name = symbolName(node.arguments[1]);
        if (name) exposed.add(name);
      }
    },
    MemberExpression(node) {
      if (enclosingRule(node)) return;
      for (let parent = node.parent; parent; parent = parent.parent) {
        if (
          parent.type === "Property" &&
          ["externals", "supertypes", "word"].includes(ruleName(parent))
        ) {
          const name = symbolName(node);
          if (name) exposed.add(name);
          break;
        }
      }
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        const match = name.match(/^_([a-z][a-z0-9_]*)_keyword$/);
        if (
          property.computed ||
          !match ||
          exposed.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "kw" ||
          body.arguments.length < 1 ||
          body.arguments.length > 2
        )
          continue;
        const word = body.arguments[0];
        if (
          word.type !== "Literal" ||
          typeof word.value !== "string" ||
          word.value.toLowerCase().replaceAll("-", "_") !== match[1] ||
          (body.arguments.length === 2 && body.arguments[1].type !== "ObjectExpression")
        )
          continue;
        const shorter = `_kw_${match[1]}`;
        if (properties.some((other) => ruleName(other) === shorter)) continue;
        report(
          context,
          property,
          "short-keyword-helper-name",
          `${name} can use the established keyword helper convention ${shorter}, reducing repeated generated symbol text. Preserve the exact kw call, token identity and aliases; update all references and metadata and check cross-file collisions or exposed aliases. Measure parser bytes and validate trees before retaining the rename.`,
        );
      }
    },
  };
}, "Suggest the shorter _kw_ convention for shared hidden keyword helpers");
