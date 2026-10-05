import { rule } from "../helpers.js";
import { sharedNamedAliasVisitor } from "../helpers/shared-named-alias-visitor.js";

export const sharedItemAlias = rule(
  (context) => sharedNamedAliasVisitor(context, "item"),
  "Suggest sharing identical named item aliases of shared nonterminal rules",
);
