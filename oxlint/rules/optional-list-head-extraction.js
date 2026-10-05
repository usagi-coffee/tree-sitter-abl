import { rule } from "../helpers.js";
import { listHeadExtractionVisitor } from "../helpers/list-head-extraction-visitor.js";

export const optionalListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "optional"),
  "Suggest extracting optional list heads duplicated in recursive comma tails",
);
