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

const terminators = new Set(["_terminator", "_no_error_terminator"]);
const metadata = ["inline", "conflicts", "supertypes", "externals", "extras", "word"];

const isCall = (node, name, length) => callName(node) === name && node.arguments.length === length;

function hasKeywordPrefix(node) {
  if (callName(node) !== "seq" || node.arguments.length < 2 || !isStaticDsl(node)) return false;
  const [keyword] = node.arguments;
  return isStaticKeywordCall(keyword) || memberName(keyword)?.startsWith("_kw_");
}

function hasLocalDependencyBackToWrapper(local, prefixName, bodyName, wrapperName, ownerName) {
  const visited = new Set();
  const reachesWrapper = (name) => {
    if (name === wrapperName || name === ownerName) return true;
    if (visited.has(name)) return false;
    visited.add(name);
    const dependency = local.get(name)?.value.body;
    return (
      dependency && (!isStaticDsl(dependency) || referencedSymbols(dependency).some(reachesWrapper))
    );
  };
  return [prefixName, bodyName].some(reachesWrapper);
}

export const statementPrefixBodyInline = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;

  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node) ?? (node.computed ? node.property.value : null);
      if (typeof name !== "string") {
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
      for (const owner of properties) {
        const ownerName = ruleName(owner);
        const statement = owner.value.body;
        if (
          ownerName.startsWith("_") ||
          !ownerName.endsWith("_statement") ||
          !isCall(statement, "seq", 2)
        )
          continue;

        const [use, terminator] = statement.arguments;
        const wrapperName = memberName(use);
        if (
          wrapperName !== `__${ownerName}_body` ||
          !terminators.has(memberName(terminator)) ||
          references.get(wrapperName)?.length !== 1
        )
          continue;

        const entries = owner.parent.properties;
        if (entries.some((entry) => !isRuleProperty(entry) || entry.computed)) continue;
        const local = new Map(entries.map((entry) => [ruleName(entry), entry]));
        if (local.size !== entries.length) continue;

        const wrapper = local.get(wrapperName);
        const sequence = wrapper?.value.body;
        if (!isCall(sequence, "seq", 2)) continue;
        const [prefix, body] = sequence.arguments;
        const stem = ownerName.slice(0, -"_statement".length);
        const prefixName = memberName(prefix);
        const bodyName = memberName(body);
        if (
          prefixName !== `__${stem}_prefix` ||
          bodyName !== `__${stem}_body` ||
          !hasKeywordPrefix(local.get(prefixName)?.value.body)
        )
          continue;
        const choice = local.get(bodyName)?.value.body;
        if (
          !isCall(choice, "choice", 2) ||
          !choice.arguments.every((branch) => memberName(branch)?.startsWith("_"))
        )
          continue;

        if (
          [owner, statement, use, wrapper, sequence, prefix, body].some((node) =>
            isRuleDisabled(context, node),
          ) ||
          (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference))
        )
          continue;

        restricted ??= new Set([
          ...rootMetadataSymbols(context, metadata),
          ...projectPrecedenceSymbols(context),
        ]);
        if (
          restricted.has(wrapperName) ||
          restricted.has(ownerName) ||
          usedOutsideFile(context, wrapperName, { wholeName: true }) ||
          hasLocalDependencyBackToWrapper(local, prefixName, bodyName, wrapperName, ownerName)
        )
          continue;

        report(
          context,
          use,
          "statement-prefix-body-inline",
          `Try inlining ${wrapperName} into ${ownerName} before its terminator. Preserve the prefix and body rules, option order, and precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest inlining the private statement sequence joining a keyword prefix and body choice");
