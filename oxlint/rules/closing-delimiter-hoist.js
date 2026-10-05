import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const closingDelimiterHoist = rule((context) => {
  const properties = [],
    references = new Map();
  const payload = (node, allowAlias = false) => {
    if (memberName(node)) return true;
    const call = callName(node);
    if (call === "optional")
      return node.arguments.length === 1 && payload(node.arguments[0], allowAlias);
    if (call === "choice")
      return (
        node.arguments.length >= 2 && node.arguments.every((part) => payload(part, allowAlias))
      );
    if (call === "alias" && allowAlias)
      return (
        node.arguments.length === 2 &&
        !!memberName(node.arguments[0]) &&
        !!memberName(node.arguments[1])
      );
    if (call === "field")
      return (
        node.arguments.length === 2 &&
        node.arguments[0].type === "Literal" &&
        typeof node.arguments[0].value === "string" &&
        payload(node.arguments[1], allowAlias)
      );
    return false;
  };
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
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (
          callName(body) !== "seq" ||
          body.arguments.length < 3 ||
          body.arguments.length > 6 ||
          !isStaticDsl(body)
        )
          continue;
        const open = body.arguments[0],
          close = body.arguments.at(-1),
          pairs = { "(": ")", "[": "]", "{": "}" };
        if (
          open.type !== "Literal" ||
          close.type !== "Literal" ||
          !Object.hasOwn(pairs, open.value) ||
          pairs[open.value] !== close.value
        )
          continue;
        const uses = references.get(name) ?? [];
        const use = uses[0],
          aliasCall = use?.parent;
        const singleAliased =
          uses.length === 1 &&
          callName(aliasCall) === "alias" &&
          aliasCall.arguments.length === 2 &&
          aliasCall.arguments[0] === use &&
          !!memberName(aliasCall.arguments[1]);
        if (!singleAliased && (uses.length < 2 || uses.length > 4)) continue;
        if (
          !body.arguments
            .slice(1, -1)
            .every(
              (part) =>
                payload(part, singleAliased) ||
                (singleAliased && part.type === "Literal" && part.value === ","),
            )
        )
          continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              memberName(use) !== name ||
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
              return false;
            for (let parent = use.parent; parent !== owner; parent = parent.parent) {
              if (singleAliased && parent === aliasCall) continue;
              if (
                parent.type === "CallExpression" &&
                ![
                  "seq",
                  "choice",
                  "optional",
                  "repeat",
                  "repeat1",
                  "field",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(parent))
              )
                return false;
            }
            return true;
          })
        )
          continue;
        report(
          context,
          property,
          "closing-delimiter-hoist",
          singleAliased
            ? `${name} has one aliased local use; try extracting its opening delimiter and contents into a hidden prefix helper, keeping the closing delimiter in ${name} and the alias at its caller. Preserve fields, token identity and tree shape, check external references and metadata, then measure parser bytes and counts.`
            : `${name} repeats a complete delimited value at ${uses.length} local uses; try retaining its opening delimiter and contents in a prefix helper and appending the closing delimiter at each caller, inside the original fields and optional wrappers. Check external references and metadata, preserve token identity and tree shape, then measure parser bytes and counts.`,
        );
      }
    },
  };
}, "Suggest separating closing delimiters from reused or single-use aliased value helpers");
