import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const isCall = (node, name, length) => callName(node) === name && node.arguments.length === length;
const isPrivate = (name) => name?.startsWith("__");

function fieldName(node) {
  if (!isCall(node, "field", 2)) return null;
  const [name] = node.arguments;
  return name.type === "Literal" && typeof name.value === "string" ? name.value : null;
}

function isSortItem(body) {
  if (!isCall(body, "seq", 2)) return false;
  const [key, option] = body.arguments;
  const keyName = fieldName(key);
  if (
    !keyName ||
    keyName === "sort_order" ||
    memberName(key.arguments[1]) !== "_qualified_identifier" ||
    !isCall(option, "optional", 1)
  )
    return false;
  const [sortOrder] = option.arguments;
  if (fieldName(sortOrder) !== "sort_order") return false;
  const choice = sortOrder.arguments[1];
  if (!isCall(choice, "choice", 2)) return false;
  const keywords = choice.arguments;
  return (
    keywords.every(
      (keyword) =>
        isStaticKeywordCall(keyword) && /^[A-Z][A-Z0-9-]*$/.test(keyword.arguments[0].value),
    ) && keywords[0].arguments[0].value !== keywords[1].arguments[0].value
  );
}

export const rightRecursiveSortItemInline = rule((context) => {
  const properties = [];
  const references = new Map();
  let computedReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        computedReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (computedReference) return;
      let restricted;
      for (const item of properties) {
        const name = ruleName(item);
        const body = item.value.body;
        const uses = references.get(name);
        if (!isPrivate(name) || uses?.length !== 1 || !isSortItem(body)) continue;

        const [use] = uses;
        const owner = enclosingRule(use);
        if (!owner || owner === item || owner.parent !== item.parent) continue;
        const ownerName = ruleName(owner);
        const recursive = owner.value.body;
        if (!isPrivate(ownerName) || !isCall(recursive, "prec.right", 1)) continue;
        const [sequence] = recursive.arguments;
        if (!isCall(sequence, "seq", 2) || sequence.arguments[0] !== use) continue;
        const continuation = sequence.arguments[1];
        if (
          !isCall(continuation, "optional", 1) ||
          memberName(continuation.arguments[0]) !== ownerName ||
          [item, body, owner, recursive].some(suppressed) ||
          references.get(ownerName).some((reference) => !enclosingRule(reference)) ||
          item.parent.properties.some(
            (entry) =>
              entry.type === "SpreadElement" ||
              entry.computed ||
              (entry !== item && entry !== owner && [name, ownerName].includes(ruleName(entry))),
          )
        )
          continue;

        restricted ??= new Set([
          ...rootMetadataSymbols(context, [
            "conflicts",
            "supertypes",
            "externals",
            "extras",
            "word",
          ]),
          ...keywordInlineSymbols(context),
          ...projectPrecedenceSymbols(context),
        ]);
        if (
          restricted.has(name) ||
          restricted.has(ownerName) ||
          usedOutsideFile(context, name, { wholeName: true })
        )
          continue;

        report(
          context,
          item,
          "right-recursive-sort-item-inline",
          `${name} is used only as the item of right-recursive ${ownerName}. Try inlining the qualified-name field and optional sort order there. Preserve the field names, keyword options, right associativity and recursive continuation, then compare parser metrics, speed and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest inlining a single-use qualified-name item with optional sort order into its right-recursive rule");
