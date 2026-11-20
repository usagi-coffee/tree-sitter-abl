import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { usedOutsideFile } from "../helpers/project-metadata.js";

const ruleId = "class-end-alternative";
const bodyName = "__class_body";
const compoundName = "__class_definition_compound_body";
const membersName = "__class_definition_items";
const openerName = "__class_body_opener";
const endName = "_kw_end";
const className = "_kw_class";
const excludedMembers = new Set([
  "class_definition",
  bodyName,
  compoundName,
  membersName,
  openerName,
  endName,
  className,
]);

const isCall = (node, name, count) => callName(node) === name && node.arguments.length === count;
const optionalValue = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);

function memberSource(node) {
  if (isCall(node, "alias", 2) && memberName(node.arguments[1])) {
    return memberName(node.arguments[0]);
  }
  return memberName(node);
}

export const classEndAlternative = rule((context) => {
  const owners = [];
  const references = new Map();
  let computedReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  const onlyUses = (name, ...nodes) => {
    const uses = references.get(name);
    return uses?.length === nodes.length && nodes.every((node) => uses.includes(node));
  };

  return {
    Property(node) {
      if (isRuleProperty(node) && ruleName(node) === compoundName) owners.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        computedReference = true;
        return;
      }
      if (name !== compoundName && name !== membersName) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (computedReference || owners.length !== 1) return;

      const [owner] = owners;
      const compound = owner.value.body;
      if (!isCall(compound, "seq", 4)) return;
      const [opener, members, end, closeClass] = compound.arguments;
      const membersUse = optionalValue(members);
      if (
        memberName(opener) !== openerName ||
        memberName(membersUse) !== membersName ||
        memberName(end) !== endName ||
        memberName(optionalValue(closeClass)) !== className
      )
        return;

      const map = owner.parent;
      if (
        map.parent?.type !== "ArrowFunctionExpression" ||
        map.parent.parent?.type !== "ExportDefaultDeclaration" ||
        map.properties.some(
          (entry) =>
            !isRuleProperty(entry) ||
            entry.computed ||
            entry.value.async ||
            entry.value.params.length !== 1,
        )
      )
        return;
      const local = new Map(map.properties.map((entry) => [ruleName(entry), entry]));
      if (local.size !== map.properties.length || !local.has(openerName)) return;
      const bodyRule = local.get(bodyName);
      const body = bodyRule?.value.body;
      if (!isCall(body, "seq", 3)) return;
      const compoundUse = body.arguments[2];
      if (memberName(compoundUse) !== compoundName || !onlyUses(compoundName, compoundUse)) return;

      const listRule = local.get(membersName);
      const precedence = listRule?.value.body;
      if (!isCall(precedence, "prec.right", 1) || !isCall(precedence.arguments[0], "seq", 2))
        return;
      const [items, continuation] = precedence.arguments[0].arguments;
      const recursiveUse = optionalValue(continuation);
      if (
        memberName(recursiveUse) !== membersName ||
        !onlyUses(membersName, membersUse, recursiveUse) ||
        callName(items) !== "choice" ||
        items.arguments.length < 2
      )
        return;

      const sources = items.arguments.map(memberSource);
      if (
        sources.includes(null) ||
        new Set(sources).size !== sources.length ||
        referencedSymbols(items).some((symbol) => excludedMembers.has(symbol)) ||
        [bodyRule, owner, compound, listRule, precedence].some(suppressed) ||
        [compoundName, membersName].some((name) =>
          usedOutsideFile(context, name, { wholeName: true }),
        )
      )
        return;

      report(
        context,
        end,
        ruleId,
        "Try moving required END into the terminal alternative of the right-recursive class member list. Keep member alternatives and aliases in order, retain right precedence for member recursion, and leave optional CLASS in the compound body. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  };
}, "Suggest using END as the terminal alternative of the class member list");
