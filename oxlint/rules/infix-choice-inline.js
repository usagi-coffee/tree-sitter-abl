import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

export const infixChoiceInline = rule((context) => {
  const properties = [],
    factories = new Map(),
    calls = new Map(),
    references = new Map();
  const restricted = rootMetadataSymbols(context, [
    "inline",
    "conflicts",
    "supertypes",
    "externals",
    "word",
    "extras",
  ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  try {
    const root = resolve(context.cwd, "grammar.js");
    const source =
      resolve(context.filename) === root
        ? context.sourceCode.getText()
        : readFileSync(root, "utf8");
    const tokens = (
      source.match(
        /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
      ) ?? []
    ).filter((part) => !part.startsWith("//") && !part.startsWith("/*"));
    for (let index = 0; index < tokens.length - 8; index++) {
      if (
        tokens[index] === "word" &&
        tokens.slice(index + 1, index + 8).join(" ") === ": ( $ ) => $ ." &&
        /^[$A-Z_a-z][$\w]*$/.test(tokens[index + 8])
      )
        restricted.add(tokens[index + 8]);
    }
  } catch {}
  let dynamicReference = false;
  const parameterName = (parameter) =>
    parameter?.type === "Identifier"
      ? parameter.name
      : parameter?.type === "AssignmentPattern" &&
          parameter.left.type === "Identifier" &&
          memberName(parameter.right)
        ? parameter.left.name
        : null;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    FunctionDeclaration(node) {
      if (
        node.parent?.type !== "Program" ||
        node.async ||
        node.generator ||
        !node.id ||
        node.params.length < 2 ||
        parameterName(node.params[0]) !== "$" ||
        !node.params.every(parameterName) ||
        node.body.body.length !== 1 ||
        node.body.body[0].type !== "ReturnStatement"
      )
        return;
      factories.set(node.id.name, node);
    },
    CallExpression(node) {
      if (node.callee.type !== "Identifier") return;
      const uses = calls.get(node.callee.name) ?? [];
      uses.push(node);
      calls.set(node.callee.name, uses);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 6 ||
          !body.arguments.every(
            (branch) =>
              (branch.type === "Literal" &&
                typeof branch.value === "string" &&
                branch.value.length > 0) ||
              isStaticKeywordCall(branch) ||
              (memberName(branch)?.startsWith("_") && memberName(branch) !== name),
          )
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          sequence = use.parent,
          precedence = sequence?.parent;
        if (
          isRuleDisabled(context, use) ||
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
          continue;
        let parent = precedence.parent;
        while (callName(parent) === "choice") parent = parent.parent;
        const factory = parent?.parent?.parent;
        if (parent?.type !== "ReturnStatement" || factories.get(factory?.id?.name) !== factory)
          continue;
        const operand = factory.params.findIndex(
          (parameter) => parameterName(parameter) === sequence.arguments[0].name,
        );
        if (operand < 1) continue;
        const instantiations = calls.get(factory.id.name) ?? [];
        if (
          instantiations.length < 2 ||
          !instantiations.every((call) => {
            const owner = enclosingRule(call);
            return (
              owner?.parent === property.parent &&
              owner.value.body === call &&
              !isRuleDisabled(context, owner) &&
              !isRuleDisabled(context, call) &&
              call.arguments.length <= factory.params.length &&
              factory.params
                .slice(call.arguments.length)
                .every((parameter) => parameter.type === "AssignmentPattern") &&
              call.arguments[0]?.type === "Identifier" &&
              call.arguments[0].name === "$" &&
              memberName(call.arguments[operand])
            );
          })
        )
          continue;
        const operands = new Set(instantiations.map((call) => memberName(call.arguments[operand])));
        if (operands.size < 2) continue;
        report(
          context,
          property,
          "infix-choice-inline",
          `${name} retains a compact infix choice in ${factory.id.name} across ${operands.size} operand contexts; try adding the selector to grammar.inline. Preserve the choice, token identities, named precedence and associativity, check cross-file uses and metadata, then measure large states and actions and compare complete valid and recovery trees including anonymous fields.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of retained infix choices in reused static grammar factories");
