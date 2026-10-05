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
import {
  projectPrecedenceSymbols,
  rootInlineSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";

export const contextualInfixBoundary = rule((context) => {
  const properties = [],
    factories = new Map(),
    calls = new Map(),
    references = new Map(),
    inlined = rootInlineSymbols(context),
    restricted = rootMetadataSymbols(context, ["conflicts", "supertypes", "externals"]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const inlineEntry = (node) => {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (parent.type === "Property") return ruleName(parent) === "inline";
    }
    return false;
  };
  const infixUse = (use) => {
    const sequence = use.parent,
      precedence = sequence?.parent;
    if (
      callName(sequence) !== "seq" ||
      sequence.arguments.length !== 3 ||
      sequence.arguments[1] !== use ||
      sequence.arguments[0].type !== "Identifier" ||
      sequence.arguments[2].type !== "Identifier" ||
      sequence.arguments[0].name !== sequence.arguments[2].name ||
      !["prec.left", "prec.right"].includes(callName(precedence)) ||
      precedence.arguments.length !== 2 ||
      precedence.arguments[1] !== sequence ||
      precedence.arguments[0].type !== "Literal" ||
      typeof precedence.arguments[0].value !== "string" ||
      !precedence.arguments[0].value
    )
      return null;
    let parent = precedence.parent;
    while (parent?.type === "CallExpression" && callName(parent) === "choice")
      parent = parent.parent;
    if (parent?.type !== "ReturnStatement") return null;
    const factory = parent.parent?.parent;
    if (
      factory?.type !== "FunctionDeclaration" ||
      factories.get(factory.id?.name) !== factory ||
      factory.body.body.length !== 1 ||
      factory.parent?.type !== "Program"
    )
      return null;
    const operand = factory.params.findIndex(
      (parameter) => parameter.name === sequence.arguments[0].name,
    );
    if (operand < 1) return null;
    return { factory, operand, precedence: precedence.arguments[0].value };
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    FunctionDeclaration(node) {
      if (
        node.id &&
        !node.async &&
        !node.generator &&
        node.params.length >= 2 &&
        node.params.every((parameter) => parameter.type === "Identifier") &&
        node.params[0].name === "$"
      )
        factories.set(node.id.name, node);
    },
    CallExpression(node) {
      if (node.callee.type !== "Identifier") return;
      const name = node.callee.name;
      if (!calls.has(name)) calls.set(name, []);
      calls.get(name).push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          !inlined.has(name) ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 6 ||
          !body.arguments.every(
            (branch) =>
              branch.type === "Literal" &&
              typeof branch.value === "string" &&
              /^[+*/%<>=|&^!-]+$/.test(branch.value),
          )
        )
          continue;
        const uses = (references.get(name) ?? []).filter((use) => !inlineEntry(use));
        if (uses.length !== 1) continue;
        const infix = infixUse(uses[0]);
        if (!infix) continue;
        const instantiations = calls.get(infix.factory.id.name) ?? [];
        if (
          instantiations.length < 2 ||
          !instantiations.every(
            (call) =>
              enclosingRule(call)?.value.body === call &&
              !isRuleDisabled(context, enclosingRule(call)) &&
              !isRuleDisabled(context, call) &&
              call.arguments.length === infix.factory.params.length &&
              call.arguments[0].type === "Identifier" &&
              call.arguments[0].name === "$" &&
              memberName(call.arguments[infix.operand]),
          )
        )
          continue;
        const operands = new Set(
          instantiations.map((call) => memberName(call.arguments[infix.operand])),
        );
        if (operands.size < 2) continue;
        report(
          context,
          property,
          "contextual-infix-boundary",
          `${name} expands an infix literal choice in ${infix.factory.id.name} across ${operands.size} operand contexts; try parameterizing the factory's operator selector to retain a hidden boundary in a measured context while keeping the exact choice expanded in the other contexts. Carry the existing named precedence ${JSON.stringify(infix.precedence)} to the retained helper, preserve associativity and token identity, check external uses and metadata, then compare parser counts and complete trees including error recovery.`,
        );
      }
    },
  };
}, "Suggest context-specific hidden boundaries for literal infix operators in reused grammar factories");
