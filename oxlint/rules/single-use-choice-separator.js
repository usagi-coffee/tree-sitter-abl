import { relative, resolve, sep } from "node:path";
import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const ruleId = "single-use-choice-separator";
const isCall = (node, name, arity) => callName(node) === name && node.arguments.length === arity;
const isLiteral = (node) =>
  node?.type === "Literal" && typeof node.value === "string" && node.value.length > 0;
const isAtom = (node) => memberName(node) !== null || isLiteral(node) || isStaticKeywordCall(node);

function hasUnsafeDependency(local, boundaries, roots) {
  const visited = new Set();
  function reachesBoundary(name) {
    if (boundaries.includes(name)) return true;
    if (visited.has(name)) return false;
    visited.add(name);
    const dependency = local.get(name);
    if (!dependency) return false;
    const body = dependency.value.body;
    return !isStaticDsl(body) || referencedSymbols(body).some(reachesBoundary);
  }
  return roots.flatMap(referencedSymbols).some(reachesBoundary);
}

function staticRuleMap(object) {
  const entries = object.properties;
  if (
    entries.some(
      (entry) =>
        entry.type !== "Property" ||
        entry.computed ||
        ruleName(entry) === null ||
        entry.value.type !== "ArrowFunctionExpression" ||
        entry.value.async,
    )
  )
    return null;
  const names = new Map(entries.map((entry) => [ruleName(entry), entry]));
  return names.size === entries.length ? names : null;
}

export const singleUseChoiceSeparator = rule((context) => {
  const definitions = [];
  const references = new Map();
  let dynamicReference = false;

  function unsafe(node) {
    return (
      isRuleDisabled(context, node) ||
      ["token", "token.immediate", "prec.dynamic"].includes(callName(node)) ||
      (node.type === "CallExpression" && node.arguments.some(unsafe))
    );
  }

  return {
    Property(node) {
      if (isRuleProperty(node)) definitions.push(node);
    },
    Identifier(node) {
      if (node.name !== "$") return;
      const parent = node.parent;
      if (parent.params?.includes(node)) return;
      if (
        parent.type === "MemberExpression" &&
        (parent.object === node || (!parent.computed && parent.property === node))
      )
        return;
      dynamicReference = true;
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node) ?? (node.computed && node.property.value);
      if (typeof name !== "string" || node.optional) {
        dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      let restricted;
      for (const definition of definitions) {
        const name = ruleName(definition);
        const body = definition.value.body;
        if (!name.startsWith("_") || callName(body) !== "choice" || body.arguments.length < 2)
          continue;

        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const [use] = uses;
        const pair = use.parent;
        const optional = pair.parent;
        if (
          memberName(use) !== name ||
          !isCall(pair, "seq", 2) ||
          pair.arguments[1] !== use ||
          !isCall(optional, "optional", 1) ||
          optional.arguments[0] !== pair
        )
          continue;
        const separator = pair.arguments[0];
        if (!isLiteral(separator) || !/^[\p{P}\p{S}]+$/u.test(separator.value)) continue;

        const prefix = enclosingRule(use);
        const prefixName = prefix && ruleName(prefix);
        const sequence = prefix?.value.body;
        if (
          !prefixName?.startsWith("_") ||
          prefix.parent !== definition.parent ||
          callName(sequence) !== "seq" ||
          sequence.arguments.length < 2 ||
          sequence.arguments.at(-1) !== optional ||
          !isAtom(sequence.arguments[0])
        )
          continue;

        const prefixUses = references.get(prefixName) ?? [];
        if (prefixUses.length !== 1) continue;
        const [prefixUse] = prefixUses;
        const owner = enclosingRule(prefixUse);
        const outer = owner?.value.body;
        if (
          !owner ||
          owner.parent !== definition.parent ||
          ruleName(owner).startsWith("_") ||
          !isCall(outer, "seq", 2) ||
          outer.arguments[0] !== prefixUse ||
          memberName(prefixUse) !== prefixName ||
          !isAtom(outer.arguments[1])
        )
          continue;

        const local = staticRuleMap(definition.parent);
        if (
          !local ||
          [definition, prefix, owner].some(
            (entry) => entry.value.params.length !== 1 || isRuleDisabled(context, entry),
          ) ||
          [body, sequence, outer].some((part) => !isStaticDsl(part) || unsafe(part))
        )
          continue;

        const ownerName = ruleName(owner);
        const boundaries = [name, prefixName, ownerName];
        restricted ??= new Set([
          ...rootMetadataSymbols(context, [
            "inline",
            "conflicts",
            "precedences",
            "supertypes",
            "externals",
            "extras",
            "word",
          ]),
          ...projectPrecedenceSymbols(context),
        ]);
        if (
          boundaries.some((symbol) => restricted.has(symbol)) ||
          (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference)) ||
          hasUnsafeDependency(local, boundaries, [
            body,
            ...sequence.arguments.slice(0, -1),
            outer.arguments[1],
          ])
        )
          continue;

        const [directory, ...file] = relative(
          context.cwd,
          resolve(context.cwd, context.filename),
        ).split(sep);
        const sourceDirectories = file.length > 0 && directory !== ".." ? [directory] : [];
        const outsideOptions = { wholeName: true, sourceDirectories };
        if (
          usedOutsideFile(context, name, outsideOptions) ||
          usedOutsideFile(context, prefixName, outsideOptions)
        )
          continue;

        report(
          context,
          definition,
          ruleId,
          `${name} is a hidden choice with one optional use after ${JSON.stringify(separator.value)} in ${prefixName}. Try moving the separator before the choice in ${name} and keeping the call optional. Compare parser actions, total and large states, estimated Wasm memory, and valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest moving a separator into a hidden choice with one optional use");
