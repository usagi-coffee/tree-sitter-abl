export function callName(node) {
  if (node?.type !== "CallExpression") return null;
  if (node.callee.type === "Identifier") return node.callee.name;
  if (node.callee.type !== "MemberExpression" || node.callee.computed) return null;

  const object =
    node.callee.object.type === "Identifier"
      ? node.callee.object.name
      : callName({ type: "CallExpression", callee: node.callee.object });
  const property = node.callee.property.type === "Identifier" ? node.callee.property.name : null;
  return object && property ? `${object}.${property}` : null;
}

export function memberName(node) {
  if (node?.type !== "MemberExpression" || node.computed) return null;
  if (node.object.type !== "Identifier" || node.object.name !== "$") return null;
  return node.property.type === "Identifier" ? node.property.name : null;
}

export function ruleName(property) {
  if (property.key?.type === "Identifier") return property.key.name;
  if (property.key?.type === "Literal" && typeof property.key.value === "string") {
    return property.key.value;
  }
  return null;
}

export function isRuleProperty(node) {
  return (
    node.type === "Property" &&
    ruleName(node) !== null &&
    node.value?.type === "ArrowFunctionExpression" &&
    node.value.params.some(
      (parameter) => parameter.type === "Identifier" && parameter.name === "$",
    ) &&
    isRuleMap(node.parent)
  );
}

export function isRuleMap(node) {
  if (node?.type !== "ObjectExpression") return false;

  if (
    node.parent?.type === "ArrowFunctionExpression" &&
    node.parent.body === node &&
    node.parent.parent?.type === "ExportDefaultDeclaration"
  ) {
    return true;
  }

  let current = node.parent;
  while (current) {
    if (current.type === "Property" && ruleName(current) === "rules") return true;
    if (current.type === "ExportDefaultDeclaration" || current.type === "Program") break;
    current = current.parent;
  }
  return false;
}

export function enclosingRule(node) {
  let current = node;
  while (current) {
    if (isRuleProperty(current)) return current;
    current = current.parent;
  }
  return null;
}

export function unwrap(node) {
  let current = node;
  while (current?.type === "CallExpression") {
    const name = callName(current);
    if (!["prec", "prec.left", "prec.right", "prec.dynamic"].includes(name)) break;
    current = current.arguments.at(-1);
  }
  return current;
}

export function dslSignature(node) {
  if (!node) return "?";
  if (node.type === "Literal") return JSON.stringify(node.value);
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression")
    return memberName(node) ? `$.${memberName(node)}` : "member";
  if (node.type === "CallExpression") {
    return `${callName(node) ?? "call"}(${node.arguments.map(dslSignature).join(",")})`;
  }
  if (node.type === "ArrayExpression") return `[${node.elements.map(dslSignature).join(",")}]`;
  return node.type;
}

export function sequenceElements(node) {
  const body = unwrap(node);
  return callName(body) === "seq" ? body.arguments : null;
}

export function isNullable(node, nullableRules = new Set()) {
  const body = unwrap(node);
  const name = callName(body);
  if (name === "optional" || name === "repeat") return true;
  if (name === "repeat1") return isNullable(body.arguments[0], nullableRules);
  if (name === "seq")
    return body.arguments.every((argument) => isNullable(argument, nullableRules));
  if (name === "choice")
    return body.arguments.some((argument) => isNullable(argument, nullableRules));
  const reference = memberName(body);
  return reference !== null && nullableRules.has(reference);
}

export function complexity(node) {
  if (!node) return 0;
  if (node.type === "CallExpression") {
    const weight =
      callName(node) === "choice"
        ? 3
        : ["optional", "repeat", "repeat1"].includes(callName(node))
          ? 2
          : 1;
    return weight + node.arguments.reduce((total, argument) => total + complexity(argument), 0);
  }
  if (node.type === "ArrayExpression") {
    return node.elements.reduce((total, element) => total + complexity(element), 0);
  }
  return 1;
}

export function report(context, node, _optimization, message) {
  if (!enclosingRule(node)) return;
  context.report({ node, message });
}

export function directiveTargetsRule(directive, ruleId) {
  const rules = directive.value
    .split("--", 1)[0]
    .split(/[\s,]+/)
    .filter(Boolean);
  return rules.length === 0 || rules.includes("all") || rules.includes(ruleId);
}

export function isRuleDisabled(context, node) {
  const line = node.loc.start.line;
  let disabled = false;
  for (const directive of context.sourceCode.getDisableDirectives().directives) {
    if (!directiveTargetsRule(directive, context.id)) continue;
    const directiveLine = directive.node.loc.start.line;
    if (directive.type === "disable-next-line") {
      if (directiveLine + 1 === line) return true;
      continue;
    }
    if (directive.type === "disable-line") {
      if (directiveLine === line) return true;
      continue;
    }
    if (directiveLine > line) continue;
    if (directive.type === "disable") disabled = true;
    if (directive.type === "enable") disabled = false;
  }
  return disabled;
}

export function rule(create, description) {
  return {
    meta: { type: "suggestion", docs: { description }, schema: [] },
    create,
  };
}

export function collectRules(run) {
  return (context) => {
    const properties = [];
    return {
      Property(node) {
        if (isRuleProperty(node)) properties.push(node);
      },
      "Program:exit"() {
        run(context, properties);
      },
    };
  };
}

export function isSmallSequenceElement(node) {
  if (memberName(node)) return true;
  if (node?.type === "Literal") return typeof node.value === "string";
  if (callName(node) === "field") {
    return node.arguments.length === 2 && isSmallSequenceElement(node.arguments[1]);
  }
  if (callName(node) === "optional") {
    return node.arguments.length === 1 && isSmallSequenceElement(node.arguments[0]);
  }
  return false;
}

export function containsAlternatives(outer, inner) {
  return (
    outer.length > inner.length &&
    outer.some((_, index) =>
      inner.every((signature, offset) => outer[index + offset] === signature),
    )
  );
}

export function isStaticKeywordCall(node) {
  if (callName(node) !== "kw" || node.arguments.length < 1 || node.arguments.length > 2)
    return false;
  if (node.arguments[0].type !== "Literal" || typeof node.arguments[0].value !== "string")
    return false;
  const options = node.arguments[1];
  return (
    !options ||
    (options.type === "ObjectExpression" &&
      options.properties.every(
        (property) =>
          property.type === "Property" &&
          !property.computed &&
          !property.shorthand &&
          property.value.type === "Literal" &&
          ["string", "number"].includes(typeof property.value.value),
      ))
  );
}

export function isStaticDsl(node) {
  if (memberName(node)) return true;
  if (node?.type === "Literal") {
    return ["string", "number"].includes(typeof node.value) || Boolean(node.regex);
  }
  const name = callName(node);
  if (name === "kw") return isStaticKeywordCall(node);
  return (
    [
      "seq",
      "choice",
      "optional",
      "repeat",
      "repeat1",
      "field",
      "alias",
      "prec",
      "prec.left",
      "prec.right",
      "prec.dynamic",
      "token",
      "token.immediate",
    ].includes(name) && node.arguments.every(isStaticDsl)
  );
}

export function referencedSymbols(node) {
  const name = memberName(node);
  if (name) return [name];
  return node?.type === "CallExpression" ? node.arguments.flatMap(referencedSymbols) : [];
}

export function hasField(node) {
  return (
    callName(node) === "field" || (node?.type === "CallExpression" && node.arguments.some(hasField))
  );
}

export function isKeyword(node) {
  if (callName(node) === "kw") return Boolean(node.arguments[0]?.value);
  if (memberName(node)?.endsWith("_keyword")) return true;
  if (node?.type === "Literal")
    return typeof node.value === "string" && /^[A-Za-z]/.test(node.value);
  if (callName(node) === "choice")
    return node.arguments.length > 0 && node.arguments.every(isKeyword);
  if (callName(node) === "alias") return isKeyword(node.arguments[0]);
  return false;
}
