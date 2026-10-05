import { rule } from "../helpers.js";
import { listHeadExtractionVisitor } from "../helpers/list-head-extraction-visitor.js";

export const choiceListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "choice"),
  "Suggest extracting choice-branch list heads duplicated in recursive comma tails",
);
