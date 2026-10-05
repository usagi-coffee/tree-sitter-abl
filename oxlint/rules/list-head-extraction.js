import { rule } from "../helpers.js";
import { listHeadExtractionVisitor } from "../helpers/list-head-extraction-visitor.js";

export const listHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context),
  "Suggest extracting embedded list heads shared with recursive comma tails",
);
