import grammar_conditional from "./conditional.js";
import grammar_available from "./available.js";
import grammar_can_find from "./can-find.js";
import grammar_locked from "./locked.js";
import grammar_new from "./new.js";
import grammar_entered from "./entered.js";
import grammar_dataset from "./dataset.js";
import grammar_current_changed from "./current-changed.js";
import grammar_ambiguous from "./ambiguous.js";
import grammar_accum from "./accum.js";
import grammar_input from "./input.js";

export default (ctx) => ({
  ...grammar_conditional(ctx),
  ...grammar_available(ctx),
  ...grammar_can_find(ctx),
  ...grammar_locked(ctx),
  ...grammar_new(ctx),
  ...grammar_entered(ctx),
  ...grammar_dataset(ctx),
  ...grammar_current_changed(ctx),
  ...grammar_ambiguous(ctx),
  ...grammar_accum(ctx),
  ...grammar_input(ctx),
});
