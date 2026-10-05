import {
  collectRules,
  dslSignature,
  report,
  rule,
  ruleName,
  sequenceElements,
} from "../helpers.js";

export function commonEdge(left, right, fromEnd = false) {
  const limit = Math.min(left.length, right.length);
  let count = 0;
  while (count < limit) {
    const leftNode = left[fromEnd ? left.length - count - 1 : count];
    const rightNode = right[fromEnd ? right.length - count - 1 : count];
    if (dslSignature(leftNode) !== dslSignature(rightNode)) break;
    count += 1;
  }
  return count;
}

export function sharedEdgeRule({ optimization, fromEnd, minimum, message, filter = () => true }) {
  return rule(
    collectRules((context, properties) => {
      const sequences = properties
        .map((property) => ({ property, elements: sequenceElements(property.value.body) }))
        .filter(({ elements }) => elements?.length > minimum);
      const reported = new Set();
      for (let right = 1; right < sequences.length; right += 1) {
        for (let left = 0; left < right; left += 1) {
          const count = commonEdge(sequences[left].elements, sequences[right].elements, fromEnd);
          if (count < minimum || !filter(sequences[right].elements, count)) continue;
          if (!reported.has(sequences[right].property)) {
            report(
              context,
              sequences[right].property,
              optimization,
              `${message} It shares ${count} elements with ${ruleName(sequences[left].property)}.`,
            );
            reported.add(sequences[right].property);
          }
        }
      }
    }),
    message,
  );
}
