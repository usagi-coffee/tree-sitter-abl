import { rule } from "../helpers.js";
import { singleUsePrecedenceClauseVisitor } from "../helpers/single-use-precedence-clause-visitor.js";

export const singleUsePrecedenceValue = rule(
  (context) => singleUsePrecedenceClauseVisitor(context, true),
  "Suggest inlining single-use private field-led items with static precedence wrappers",
);
