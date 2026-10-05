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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";
import { sharedScopedDeclarationHeads } from "../sharing-state.js";

export const sharedScopedDeclarationHead = rule((context) => {
  const properties = [],
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "supertypes",
      "externals",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const signature = (nodes) =>
    JSON.stringify(
      nodes.map((node) =>
        context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
      ),
    );
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      const owner = enclosingRule(node);
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          restricted.add(name);
        if (!owner) restricted.add(name);
      }
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "seq" ||
          body.arguments.length !== 4 ||
          !isStaticDsl(body)
        )
          continue;
        const [head, scope, noun, payload] = body.arguments;
        const modifier =
          callName(scope) === "optional" && scope.arguments.length === 1
            ? memberName(scope.arguments[0])
            : null;
        if (
          !keyword(head) ||
          !keyword(noun) ||
          !modifier?.startsWith("_") ||
          modifier.startsWith("__") ||
          modifier.startsWith("_kw_") ||
          !memberName(payload)?.startsWith("_") ||
          referencedSymbols(body).includes(name) ||
          [head, scope, noun, payload].some((node) => isRuleDisabled(context, node))
        )
          continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: name,
          prefix: signature([head, scope]),
          noun: signature([noun]),
        };
        const previous = sharedScopedDeclarationHeads.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.filename !== candidate.filename &&
            other.prefix === candidate.prefix &&
            other.noun !== candidate.noun,
        );
        if (previous)
          report(
            context,
            property,
            "shared-scoped-declaration-head",
            `${name} repeats the keyword and optional shared modifier head of ${previous.owner} (${previous.filename}); try sharing that exact non-empty head across these declaration files. Keep each declaration keyword and body at its caller, preserve modifier aliases, fields and ordering, check metadata, then compare parser counts and byte costs and validate complete trees.`,
          );
        else sharedScopedDeclarationHeads.push(candidate);
      }
    },
  };
}, "Suggest sharing exact keyword and optional scope heads across declaration files");
