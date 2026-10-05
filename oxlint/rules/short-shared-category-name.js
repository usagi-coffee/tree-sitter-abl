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

export const shortSharedCategoryName = rule((context) => {
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
        if (
          property.computed ||
          !/^_[^_].*_or_/.test(name) ||
          name.length < 24 ||
          exposed.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2
        )
          continue;
        const alternative = (node) => {
          const symbol = memberName(node);
          if (symbol) return symbol !== name;
          return (
            callName(node) === "alias" &&
            node.arguments.length === 2 &&
            memberName(node.arguments[0]) &&
            memberName(node.arguments[0]) !== name &&
            memberName(node.arguments[1])
          );
        };
        if (!body.arguments.every(alternative)) continue;
        report(
          context,
          property,
          "short-shared-category-name",
          `${name} enumerates alternatives in a long shared hidden name; consider a concise semantic category name such as _qualified_identifier for optionally qualified identifiers. Update all references and metadata, check collisions and exposed aliases, and retain the exact rule body. Measure generated parser bytes and validate trees; this only shortens emitted symbol text, not parser counts or runtime.`,
        );
      }
    },
  };
}, "Suggest concise semantic names for shared hidden symbol-choice categories");
