import { rule } from "../helpers.js";
import { singleUseChoiceSequenceVisitor } from "../helpers/single-use-choice-sequence-visitor.js";

export const singleUseChoiceSequence = rule(
  (context) => singleUseChoiceSequenceVisitor(context),
  "Suggest inlining single-use private sequences containing small direct choices",
);
