import { rule } from "../helpers.js";
import { singleUseChoiceSequenceVisitor } from "../helpers/single-use-choice-sequence-visitor.js";

export const singleUseChoiceAliasSequence = rule(
  (context) => singleUseChoiceSequenceVisitor(context, false, true),
  "Suggest inlining single-use private sequences combining a small choice and symbol alias",
);
