import { rule } from "../helpers.js";
import { listHeadExtractionVisitor } from "../helpers/list-head-extraction-visitor.js";

export const fieldListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "field"),
  "Suggest extracting field-wrapped list heads duplicated in recursive comma tails",
);
