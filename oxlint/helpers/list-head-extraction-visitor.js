import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  ruleName,
  unwrap,
} from "../helpers.js";

export function listHeadExtractionVisitor(context, mode = "embedded") {
  const precedenceHead = mode === "precedence";
  const optionalHead = mode === "optional";
  const choiceHead = mode === "choice";
  const fieldHead = mode === "field";
  const properties = [];
  const sequences = [];
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, node)) return;
      if (
        fieldHead &&
        (callName(node.parent) !== "field" ||
          node.parent.arguments.length !== 2 ||
          node.parent.arguments[1] !== node)
      )
        return;
      if (
        precedenceHead &&
        (!["prec", "prec.left", "prec.right"].includes(callName(node.parent)) ||
          node.parent.arguments.at(-1) !== node ||
          !isStaticDsl(node.parent))
      )
        return;
      if (choiceHead && (callName(node.parent) !== "choice" || node.parent.arguments.length < 2))
        return;
      if (
        optionalHead &&
        (callName(node.parent) !== "optional" || node.parent.arguments.length !== 1)
      )
        return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          [
            "alias",
            "token",
            "token.immediate",
            "prec",
            "prec.left",
            "prec.right",
            "prec.dynamic",
          ].includes(callName(parent)) &&
          !(
            precedenceHead &&
            ["prec", "prec.left", "prec.right"].includes(callName(parent)) &&
            isStaticDsl(parent)
          )
        )
          return;
      }
      sequences.push({ node, owner, signatures: node.arguments.map(signature) });
    },
    "Program:exit"() {
      const nullable = (node) => {
        const body = unwrap(node);
        const name = callName(body);
        if (name === "field") return nullable(body.arguments[1]);
        if (name === "alias" || name === "repeat1") return nullable(body.arguments[0]);
        if (name === "seq") return body.arguments.every(nullable);
        if (name === "choice") return body.arguments.some(nullable);
        return isNullable(body);
      };
      const tails = [];
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("_") || callName(body) !== "seq" || body.arguments.length < 3)
          continue;
        if (!isStaticDsl(body) || isRuleDisabled(context, property)) continue;
        let separator = body.arguments[0];
        if (callName(separator) === "optional" && separator.arguments.length === 1)
          separator = separator.arguments[0];
        if (separator.type !== "Literal" || separator.value !== ",") continue;
        const last = body.arguments.at(-1);
        if (
          callName(last) !== "optional" ||
          last.arguments.length !== 1 ||
          memberName(last.arguments[0]) !== name
        )
          continue;
        const items = body.arguments.slice(1, -1);
        if (items.every(nullable) || items.some((item) => referencedSymbols(item).includes(name)))
          continue;
        tails.push({ property, name, suffix: body.arguments.slice(1).map(signature) });
      }
      for (const sequence of sequences) {
        for (const tail of tails) {
          if (sequence.owner === tail.property || sequence.owner.parent !== tail.property.parent)
            continue;
          if (
            optionalHead || choiceHead || fieldHead || precedenceHead
              ? sequence.signatures.length !== tail.suffix.length
              : sequence.signatures.length <= tail.suffix.length
          )
            continue;
          const matches = sequence.signatures.some((_, index) =>
            tail.suffix.every((part, offset) => sequence.signatures[index + offset] === part),
          );
          if (!matches) continue;
          report(
            context,
            sequence.node,
            precedenceHead
              ? "precedence-list-head-extraction"
              : fieldHead
                ? "field-list-head-extraction"
                : choiceHead
                  ? "choice-list-head-extraction"
                  : optionalHead
                    ? "optional-list-head-extraction"
                    : "list-head-extraction",
            precedenceHead
              ? `This precedence-wrapped list repeats the item and continuation in ${tail.name}; try extracting a hidden non-empty recursive list and inlining its comma continuation when the tail has no other uses. Keep the complete precedence chain and outer fields at this call site, preserve separators, item fields and aliases, check external references and metadata, then measure parser size and validate trees.`
              : fieldHead
                ? `This field contains the item and continuation repeated by ${tail.name}; try extracting or reusing a hidden non-empty list head here and after the comma in ${tail.name}. Keep the outer field at this call site, preserve nested fields, aliases and separator optionality, check precedence relationships, then measure parser size and validate trees.`
                : choiceHead
                  ? `This choice branch repeats the item and continuation in ${tail.name}; try extracting a hidden non-empty list head and reusing it in this branch and after the comma in ${tail.name}. Preserve choice order, separator optionality, fields and aliases; check helper-specific conflicts and precedence, then measure parser size and validate trees.`
                  : optionalHead
                    ? `This optional list head repeats the item and continuation in ${tail.name}; try extracting a hidden non-empty head and reusing it inside this optional and after the comma in ${tail.name}. Preserve separator optionality, fields, aliases and order; check helper-specific conflicts and precedence, then measure parser size and validate trees.`
                    : `This sequence embeds the item and optional continuation repeated by ${tail.name}; try extracting that non-empty list head and reusing it here and after the comma in ${tail.name}. Preserve separator optionality, fields, aliases and order; measure parser size and validate trees.`,
          );
          break;
        }
      }
    },
  };
}
