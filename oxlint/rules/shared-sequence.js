import {
  callName,
  enclosingRule,
  hasField,
  isKeyword,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { sharedSequences } from "../sharing-state.js";

export const sharedSequence = rule((context) => {
  const sequences = [];
  const aliases = new Map();
  const unaliasedReferences = new Set();
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 2) return;
      if (!isKeyword(node.arguments[0]) || !hasField(node)) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      let subject = node;
      while (
        ["prec", "prec.left", "prec.right", "prec.dynamic"].includes(callName(subject.parent)) &&
        subject.parent.arguments.at(-1) === subject
      )
        subject = subject.parent;
      sequences.push({ subject, property });
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name?.startsWith("_") || !enclosingRule(node)) return;
      const parent = node.parent;
      const target =
        callName(parent) === "alias" && parent.arguments[0] === node
          ? memberName(parent.arguments[1])
          : null;
      if (target === null || target.startsWith("_")) {
        unaliasedReferences.add(name);
        return;
      }
      if (!aliases.has(name)) aliases.set(name, new Set());
      aliases.get(name).add(target);
    },
    "Program:exit"() {
      for (const { subject, property } of sequences) {
        const reportNode = subject === property.value.body ? property : subject;
        if (isRuleDisabled(context, reportNode)) continue;
        const name = ruleName(property);
        const targets = aliases.get(name);
        const publicAlias =
          subject === property.value.body &&
          name.startsWith("_") &&
          targets?.size === 1 &&
          !unaliasedReferences.has(name)
            ? [...targets][0]
            : null;
        // Keep token identities, keyword options, fields, aliases, and precedence
        // in the comparison; comments and whitespace have no effect.
        const signature = JSON.stringify([
          context.cwd,
          context.sourceCode.getTokens(subject).map(({ type, value }) => [type, value]),
        ]);
        const candidate = {
          filename: context.filename,
          rule: name,
          start: context.sourceCode.getRange(subject)[0],
          line: subject.loc.start.line,
          publicAlias,
        };
        const previous = sharedSequences.get(signature);
        if (!previous) {
          sharedSequences.set(signature, candidate);
          continue;
        }
        if (previous.filename === candidate.filename && previous.start === candidate.start)
          continue;
        const previousFile = `${previous.filename.split(/[\\/]/).at(-1)}:${previous.line}`;
        const message =
          publicAlias && publicAlias === previous.publicAlias
            ? `This hidden rule and ${previous.rule} in ${previousFile} have identical bodies and alias to ${publicAlias}; try sharing the public rule while preserving its tree shape.`
            : `This keyword/value sequence duplicates ${previous.rule} in ${previousFile}; try sharing a hidden helper while preserving fields, aliases, and precedence.`;
        report(context, reportNode, "shared-sequence", message);
      }
    },
  };
}, "Suggest sharing repeated keyword/value sequences, including nested clauses and aliased rules");
