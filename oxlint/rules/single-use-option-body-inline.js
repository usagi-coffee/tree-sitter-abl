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

const isCall = (node, name, arity) => callName(node) === name && node.arguments.length === arity;
const isString = (node) =>
  node?.type === "Literal" && typeof node.value === "string" && node.value.length > 0;
const isSimplePart = (node) => memberName(node) || isString(node) || isStaticKeywordCall(node);
const isChoice = (node) => callName(node) === "choice" && node.arguments.length >= 2;

function isOptionBody(body) {
  if (!isCall(body, "seq", 2)) return false;
  const [field, options] = body.arguments;
  return (
    isCall(field, "field", 2) &&
    isString(field.arguments[0]) &&
    memberName(field.arguments[1]) &&
    isCall(options, "repeat", 1) &&
    isChoice(options.arguments[0]) &&
    isStaticDsl(body)
  );
}

function hasUnsafeLocalDependency(local, boundaries, dependencies) {
  const visited = new Set();
  function reachesBoundary(name) {
    if (boundaries.includes(name)) return true;
    if (visited.has(name)) return false;
    visited.add(name);
    const dependency = local.get(name);
    if (!dependency) return false;
    const body = dependency.value?.body;
    return !isStaticDsl(body) || referencedSymbols(body).some(reachesBoundary);
  }
  return dependencies.flatMap(referencedSymbols).some(reachesBoundary);
}

export const singleUseOptionBodyInline = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
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
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("_") || !isOptionBody(body)) continue;

        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const [use] = uses;
        const prefix = enclosingRule(use);
        const sequence = prefix?.value.body;
        if (
          !prefix ||
          prefix.parent !== property.parent ||
          !isCall(sequence, "seq", 3) ||
          sequence.arguments[2] !== use ||
          memberName(use) !== name
        )
          continue;
        const prefixName = ruleName(prefix);
        const [opener, selector] = sequence.arguments;
        if (
          !prefixName.startsWith("_") ||
          !isSimplePart(opener) ||
          !isChoice(selector) ||
          !selector.arguments.every(isSimplePart)
        )
          continue;

        const prefixUses = references.get(prefixName) ?? [];
        if (prefixUses.length !== 1) continue;
        const [prefixUse] = prefixUses;
        const owner = enclosingRule(prefixUse);
        const outer = owner?.value.body;
        if (
          !owner ||
          owner.parent !== property.parent ||
          ruleName(owner).startsWith("_") ||
          !isCall(outer, "seq", 2) ||
          outer.arguments[0] !== prefixUse ||
          memberName(prefixUse) !== prefixName ||
          !isSimplePart(outer.arguments[1])
        )
          continue;

        const entries = property.parent.properties;
        if (
          entries.some(
            (entry) => entry.type !== "Property" || entry.computed || ruleName(entry) === null,
          )
        )
          continue;
        const local = new Map(entries.map((entry) => [ruleName(entry), entry]));
        if (
          local.size !== entries.length ||
          [property, prefix, owner].some(
            (entry) => entry.value.async || entry.value.params.length !== 1,
          ) ||
          [property, prefix, owner, body, sequence, outer].some(suppressed)
        )
          continue;

        const ownerName = ruleName(owner);
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
        const boundaries = [name, prefixName, ownerName];
        if (
          boundaries.some((symbol) => restricted.has(symbol)) ||
          (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference)) ||
          hasUnsafeLocalDependency(local, boundaries, [body, opener, selector, outer.arguments[1]])
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
          property,
          "single-use-option-body-inline",
          `${name} has one direct trailing use in ${prefixName}. Try inlining the required field and repeated options there, keeping the selector, ${prefixName} boundary and ${ownerName} suffix intact. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining a single-use hidden field and option sequence behind a retained selector");
