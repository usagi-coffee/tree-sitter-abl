import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { rootMetadataSymbols } from "../helpers/project-metadata.js";

export const literalCompoundAliasBoundary = rule((context) => {
  const properties = [],
    choices = [],
    metadata = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "word",
    ]);
  let dynamicMetadata = false;
  const literal = (node) => {
    const name = memberName(node);
    return name && !name.startsWith("_") && name.endsWith("_literal");
  };
  const delimiters = new Map([
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
    ["<", ">"],
  ]);
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (enclosingRule(node)) return;
      const name = memberName(node);
      if (name) metadata.add(name);
      else if (node.computed && node.object.type === "Identifier" && node.object.name === "$") {
        if (node.property.type === "Literal" && typeof node.property.value === "string")
          metadata.add(node.property.value);
        else dynamicMetadata = true;
      }
    },
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node),
        field = node.parent;
      if (
        !owner ||
        callName(field) !== "field" ||
        field.arguments.length !== 2 ||
        field.arguments[1] !== node ||
        field.arguments[0].type !== "Literal" ||
        typeof field.arguments[0].value !== "string"
      )
        return;
      const mapParent = owner.parent.parent;
      if (
        mapParent.type !== "ArrowFunctionExpression" &&
        !(mapParent.type === "Property" && ruleName(mapParent) === "rules")
      )
        return;
      for (let parent = node; parent !== owner; parent = parent.parent) {
        if (isRuleDisabled(context, parent)) return;
        if (
          parent.type === "CallExpression" &&
          (!["seq", "choice", "field", "optional", "prec", "prec.left", "prec.right"].includes(
            callName(parent),
          ) ||
            !isStaticDsl(parent))
        )
          return;
      }
      if (isRuleDisabled(context, owner)) return;
      choices.push({ node, owner, field: field.arguments[0].value });
    },
    "Program:exit"() {
      if (dynamicMetadata) return;
      for (const { node, owner, field } of choices) {
        if (metadata.has(ruleName(owner))) continue;
        for (let index = 0; index + 1 < node.arguments.length; index++) {
          const pair = node.arguments.slice(index, index + 2),
            aliased = literal(pair[0]) ? pair[1] : literal(pair[1]) ? pair[0] : null;
          if (callName(aliased) !== "alias" || aliased.arguments.length !== 2) continue;
          const source = memberName(aliased.arguments[0]),
            target = memberName(aliased.arguments[1]);
          if (!source?.startsWith("__") || !target || target.startsWith("_")) continue;
          const definition = properties.find(
            (property) => property.parent === owner.parent && ruleName(property) === source,
          );
          if (!definition || definition === owner || metadata.has(source)) continue;
          const body = definition.value.body;
          if (callName(body) !== "seq" || body.arguments.length < 3 || !isStaticDsl(body)) continue;
          const close = body.arguments.at(-1);
          if (
            close.type !== "Literal" ||
            !body.arguments
              .slice(0, -1)
              .some(
                (part) => part.type === "Literal" && delimiters.get(part.value) === close.value,
              ) ||
            referencedSymbols(body).includes(ruleName(owner)) ||
            referencedSymbols(body).includes(source) ||
            [definition, body, ...pair, ...aliased.arguments].some((part) =>
              isRuleDisabled(context, part),
            )
          )
            continue;
          report(
            context,
            node,
            "literal-compound-alias-boundary",
            `This ${field} choice contains adjacent literal and named ${target} alternatives backed by a private delimited sequence; try grouping only that exact pair in a hidden choice helper. Keep the field and other alternatives at their caller, retain branch order and the compound alias, avoid extracting alternatives with competing reductions, check metadata, measure large states, actions and table bytes, and compare complete valid and error-recovery trees before keeping the boundary.`,
          );
          break;
        }
      }
    },
  };
}, "Suggest boundaries for embedded adjacent literal and aliased compound alternatives");
