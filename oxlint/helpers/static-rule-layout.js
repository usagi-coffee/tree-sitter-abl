import {
  dslSignature,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  referencedSymbols,
  ruleName,
} from "../helpers.js";
import { usedOutsideFile } from "./project-metadata.js";

export function matchStaticRuleLayout(context, program, measuredRules, expectedUses) {
  const [declaration] = program.body;
  const factory = declaration?.declaration;
  if (
    program.body.length !== 1 ||
    declaration.type !== "ExportDefaultDeclaration" ||
    factory?.type !== "ArrowFunctionExpression" ||
    factory.async ||
    factory.params.length !== 1 ||
    factory.params[0].type !== "ObjectPattern" ||
    factory.body.type !== "ObjectExpression"
  )
    return null;

  const bindings = factory.params[0].properties;
  if (bindings.length !== 1 || !bindings[0].shorthand || bindings[0].value.name !== "kw")
    return null;

  const properties = factory.body.properties;
  if (properties.length < measuredRules.size) return null;

  const local = new Map(properties.map((entry) => [ruleName(entry), entry]));
  if (local.size !== properties.length) return null;
  for (const name of measuredRules.keys()) {
    if (!local.has(name)) return null;
  }

  if (
    properties.some(
      (entry) =>
        !isRuleProperty(entry) ||
        entry.computed ||
        entry.value.async ||
        entry.value.params.length !== 1 ||
        !isStaticDsl(entry.value.body),
    )
  )
    return null;

  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  for (const [name, signature] of measuredRules) {
    const entry = local.get(name);
    const body = entry.value.body;
    const matches =
      typeof signature === "function" ? signature(body) : dslSignature(body) === signature;
    if (!matches || suppressed(entry) || suppressed(body)) return null;
  }

  const counts = new Map();
  for (const entry of properties) {
    for (const name of referencedSymbols(entry.value.body)) {
      if (expectedUses.has(name)) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  for (const [name, expected] of expectedUses) {
    if (
      (expected === 0 && local.has(name)) ||
      (counts.get(name) ?? 0) !== expected ||
      usedOutsideFile(context, name, { wholeName: true })
    )
      return null;
  }

  return local;
}
