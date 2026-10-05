import { rule } from "../helpers.js";
import { sharedNamedAliasVisitor } from "../helpers/shared-named-alias-visitor.js";

export const sharedStatementAlias = rule(
  (context) => sharedNamedAliasVisitor(context),
  "Suggest sharing identical named aliases of public statement rules",
);
