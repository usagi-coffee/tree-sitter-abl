import {
  callName,
  dslSignature,
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
import { contextualValuedChoiceSites } from "../sharing-state.js";

export const contextualValuedChoiceInline = rule((context) => {
  const properties = [],
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const requiredField = (node) =>
    callName(node) === "field" &&
    node.arguments.length === 2 &&
    node.arguments[0].type === "Literal" &&
    typeof node.arguments[0].value === "string" &&
    memberName(node.arguments[1]) !== null;
  const directClause = (node) =>
    callName(node) === "seq" &&
    node.arguments.length === 2 &&
    keyword(node.arguments[0]) &&
    requiredField(node.arguments[1]);
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
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      // Replace this file's entries when a lint host visits it again.
      for (let index = contextualValuedChoiceSites.length - 1; index >= 0; index--) {
        const site = contextualValuedChoiceSites[index];
        if (site.cwd === context.cwd && site.filename === context.filename)
          contextualValuedChoiceSites.splice(index, 1);
      }
      if (dynamicReference) return;
      const definitions = new Map(properties.map((property) => [ruleName(property), property]));
      const sites = [];
      const payloadField = (node) => {
        const name = memberName(node),
          definition = definitions.get(name);
        if (
          !name?.startsWith("_") ||
          name.startsWith("__") ||
          !definition ||
          isRuleDisabled(context, definition)
        )
          return null;
        const body = definition.value.body;
        if (isRuleDisabled(context, body)) return null;
        if (requiredField(body)) return body;
        if (callName(body) !== "seq" || body.arguments.length !== 2) return null;
        const [modifier, value] = body.arguments;
        return callName(modifier) === "optional" &&
          modifier.arguments.length === 1 &&
          keyword(modifier.arguments[0]) &&
          requiredField(value)
          ? value
          : null;
      };
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          !isStaticDsl(body)
        )
          continue;
        if (
          !name.startsWith("__") &&
          callName(body) === "choice" &&
          body.arguments.length >= 2 &&
          body.arguments.length <= 4
        ) {
          const fields = [],
            keywords = new Set();
          let direct = false,
            indirect = false;
          const matches = body.arguments.every((branch) => {
            if (
              callName(branch) !== "seq" ||
              branch.arguments.length !== 2 ||
              !keyword(branch.arguments[0]) ||
              isRuleDisabled(context, branch)
            )
              return false;
            const signature = dslSignature(branch.arguments[0]);
            if (keywords.has(signature)) return false;
            keywords.add(signature);
            const value = branch.arguments[1],
              field = requiredField(value) ? value : payloadField(value);
            if (!field || referencedSymbols(field).includes(name) || isRuleDisabled(context, value))
              return false;
            direct ||= field === value;
            indirect ||= field !== value;
            fields.push(field.arguments[0].value);
            return true;
          });
          if (matches && direct && indirect && new Set(fields).size > 1)
            sites.push({ node: property, selector: name, definition: true });
        }
        let choice = body;
        while (["prec", "prec.left", "prec.right"].includes(callName(choice)))
          choice = choice.arguments.at(-1);
        if (
          callName(choice) !== "choice" ||
          choice.arguments.length < 4 ||
          choice.arguments.filter(directClause).length < 2 ||
          isRuleDisabled(context, choice)
        )
          continue;
        for (const use of choice.arguments) {
          const selector = memberName(use);
          if (
            selector?.startsWith("_") &&
            !selector.startsWith("__") &&
            selector !== name &&
            !restricted.has(selector) &&
            !isRuleDisabled(context, use)
          )
            sites.push({ node: use, selector, definition: false, owner: name });
        }
      }
      const reported = new Set();
      for (const site of sites) {
        const candidate = { ...site, cwd: context.cwd, filename: context.filename };
        for (const previous of contextualValuedChoiceSites) {
          if (
            previous.cwd !== candidate.cwd ||
            previous.selector !== candidate.selector ||
            previous.definition === candidate.definition
          )
            continue;
          const use = candidate.definition ? previous : candidate,
            key = `${use.filename}:${use.owner}:${use.selector}`;
          if (reported.has(key)) continue;
          report(
            context,
            site.node,
            "contextual-valued-choice-inline",
            `${site.selector} groups required keyword/value clauses inside the larger valued-option choice ${use.owner} (${use.filename}); try expanding its exact choice only at this caller, retaining the shared helper at other callers and every nested value boundary. Preserve fields, keyword options, order and precedence, check all references and metadata, then prioritize LARGE_STATE_COUNT before ACTION_COUNT and compare complete valid and recovery trees.`,
          );
          reported.add(key);
        }
        contextualValuedChoiceSites.push(candidate);
      }
    },
  };
}, "Suggest caller-specific expansion of retained valued choices inside larger option choices");
