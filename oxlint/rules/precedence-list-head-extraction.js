import { rule } from "../helpers.js";
import { listHeadExtractionVisitor } from "../helpers/list-head-extraction-visitor.js";

export const precedenceListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "precedence"),
  "Suggest extracting recursive list heads while retaining call-site static precedence",
);
