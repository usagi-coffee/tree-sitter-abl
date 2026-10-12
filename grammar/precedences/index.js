import grammar_binary from "./binary.js";
import grammar_arguments from "./arguments.js";
import grammar_os from "./os.js";
import grammar_dataset from "./dataset.js";
import grammar_browse from "./browse.js";
import grammar_include from "./include.js";
import grammar_create from "./create.js";
import grammar_delete from "./delete.js";
import grammar_case from "./case.js";
import grammar_assign from "./assign.js";
import grammar_set from "./set.js";
import grammar_enable from "./enable.js";
import grammar_display from "./display.js";
import grammar_widget from "./widget.js";
import grammar_on from "./on.js";
import grammar_message from "./message.js";
import grammar_record from "./record.js";
import grammar_frame from "./frame.js";
import grammar_form from "./form.js";
import grammar_format from "./format.js";
import grammar_put from "./put.js";
import grammar_prompt_for from "./prompt-for.js";
import grammar_export from "./export.js";
import grammar_input from "./input.js";
import grammar_entered from "./entered.js";
import grammar_run from "./run.js";
import grammar_raw_transfer from "./raw-transfer.js";
import grammar_stream from "./stream.js";
import grammar_subscribe from "./subscribe.js";
import grammar_update from "./update.js";
import grammar_accessors from "./accessors.js";
import grammar_new from "./new.js";

// References: N/A (barrel for precedence groups).
// Purpose: compose all precedence groups in a stable, readable order.

export default ($) => [
  // Keep an optional extent size attached to the method parameter.
  // Example: METHOD VOID M(INPUT values AS INTEGER EXTENT 5).
  ["class_method_extent"],
  // Completed macro references bind before fallback preprocessor expressions.
  // Example: DISPLAY {&value} + 1.
  ["macro_reference", "macro", "preprocessor"],
  // Slash colors consume foreground/background before arithmetic division.
  // Example: DISPLAY value COLOR white/red.
  ["color_slash", "multiplication"],
  // TITLE keeps concatenated text together instead of finishing at the first operand.
  // Example: MESSAGE "x" VIEW-AS ALERT-BOX TITLE "a" + "b".
  ["alert_title", $._alert_box_title, $._alert_box_title_value, $._text_operand],
  // Preserve the explicitly ordered ENTERED operator against ordinary field operands.
  // Example: IF field NOT ENTERED THEN RETURN.
  ["entered", $._qualified_identifier],
  ["unary", "multiplication", "add", "compare", "not", "logical"],
  ...grammar_accessors($),
  ...grammar_new($),
  ...grammar_arguments($),
  ...grammar_binary($),
  ...grammar_os($),
  ...grammar_dataset($),
  ...grammar_browse($),
  ...grammar_include($),
  ...grammar_create($),
  ...grammar_delete($),
  ...grammar_case($),
  ...grammar_assign($),
  ...grammar_set($),
  ...grammar_enable($),
  ...grammar_display($),
  ...grammar_widget($),
  ...grammar_on($),
  ...grammar_message($),
  ...grammar_record($),
  ...grammar_frame($),
  ...grammar_form($),
  ...grammar_format($),
  ...grammar_put($),
  ...grammar_prompt_for($),
  ...grammar_export($),
  ...grammar_input($),
  ...grammar_entered($),
  ...grammar_run($),
  ...grammar_raw_transfer($),
  ...grammar_stream($),
  ...grammar_subscribe($),
  ...grammar_update($),
];
