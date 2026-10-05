import { rule } from "../helpers.js";
import { singleUseChoiceSequenceVisitor } from "../helpers/single-use-choice-sequence-visitor.js";

export const singleUseFieldChoiceSequence = rule(
  (context) => singleUseChoiceSequenceVisitor(context, true),
  "Suggest inlining single-use private sequences containing small field-wrapped choices",
);
