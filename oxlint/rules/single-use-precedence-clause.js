import { rule } from "../helpers.js";
import { singleUsePrecedenceClauseVisitor } from "../helpers/single-use-precedence-clause-visitor.js";

export const singleUsePrecedenceClause = rule(
  (context) => singleUsePrecedenceClauseVisitor(context),
  "Suggest inlining single-use private valued clauses with static precedence wrappers",
);
