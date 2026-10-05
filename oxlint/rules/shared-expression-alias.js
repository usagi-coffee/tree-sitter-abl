import { rule } from "../helpers.js";
import { sharedNamedAliasVisitor } from "../helpers/shared-named-alias-visitor.js";

export const sharedExpressionAlias = rule(
  (context) => sharedNamedAliasVisitor(context, "expression"),
  "Suggest sharing identical named aliases of shared or public expression rules",
);
