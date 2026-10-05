import { sharedEdgeRule } from "../helpers/shared-edge-rule.js";

export const prefixExtraction = sharedEdgeRule({
  optimization: "prefix-extraction",
  fromEnd: false,
  minimum: 3,
  message: "Try extracting the shared rule prefix",
});
