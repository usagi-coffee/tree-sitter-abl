import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const recursiveContinuationInline = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal"
          ? node.property.value
          : null);
      if (typeof name !== "string") return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        let separator = body.arguments[0];
        if (callName(separator) === "optional" && separator.arguments.length === 1)
          separator = separator.arguments[0];
        if (separator.type !== "Literal" || separator.value !== ",") continue;
        const headName = memberName(body.arguments[1]);
        const head = properties.find(
          (candidate) => candidate.parent === property.parent && ruleName(candidate) === headName,
        );
        if (
          !head ||
          head === property ||
          !headName.startsWith("_") ||
          isRuleDisabled(context, head)
        )
          continue;
        const sequence = head.value.body;
        if (callName(sequence) !== "seq" || sequence.arguments.length < 2 || !isStaticDsl(sequence))
          continue;
        const continuation = sequence.arguments.at(-1);
        if (
          callName(continuation) !== "optional" ||
          continuation.arguments.length !== 1 ||
          memberName(continuation.arguments[0]) !== name
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1 || uses[0] !== continuation.arguments[0]) continue;
        if (isRuleDisabled(context, continuation)) continue;
        report(
          context,
          property,
          "recursive-continuation-inline",
          `${name} only adds a separator before recursing into ${headName}; try inlining this continuation inside the head's optional tail. Keep separator optionality, fields and list order intact, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use separator helpers in mutually recursive hidden lists");
