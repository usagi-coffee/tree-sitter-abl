import { sharedEdgeRule } from "../helpers/shared-edge-rule.js";
import { callName } from "../helpers.js";

export const localPrefixHelper = sharedEdgeRule({
  optimization: "local-prefix-helper",
  fromEnd: false,
  minimum: 2,
  message: "Try extracting a local prefix-family helper",
  filter(elements, count) {
    return elements.slice(0, count).every((element) => callName(element) === "kw");
  },
});
