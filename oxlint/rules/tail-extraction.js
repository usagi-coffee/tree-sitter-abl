import { sharedEdgeRule } from "../helpers/shared-edge-rule.js";

export const tailExtraction = sharedEdgeRule({
  optimization: "tail-extraction",
  fromEnd: true,
  minimum: 2,
  message: "Try extracting the shared rule tail",
});
