import grammar_assign from "./assign.js";
import grammar_go_on from "./go-on.js";
import grammar_aggregate from "./aggregate.js";
import grammar_trigger from "./trigger.js";
import grammar_in_window from "./in-window.js";
import grammar_at from "./at.js";
import grammar_color from "./color.js";
import grammar_combo_box from "./combo-box.js";
import grammar_editing from "./editing.js";
import grammar_editor from "./editor.js";
import grammar_format from "./format.js";
import grammar_frame from "./frame.js";
import grammar_image from "./image.js";
import grammar_preselect from "./preselect.js";
import grammar_query_tuning from "./query-tuning.js";
import grammar_radio_set from "./radio-set.js";
import grammar_record from "./record.js";
import grammar_selection_list from "./selection-list.js";
import grammar_slider from "./slider.js";
import grammar_size from "./size.js";
import grammar_on_endkey from "./on-endkey.js";
import grammar_on_error from "./on-error.js";
import grammar_on_quit from "./on-quit.js";
import grammar_on_stop from "./on-stop.js";
import grammar_stop_after from "./stop-after.js";
import grammar_view_as from "./view-as.js";
import grammar_widget from "./widget.js";

export default (ctx) => ({
  ...grammar_assign(ctx),
  ...grammar_go_on(ctx),
  ...grammar_aggregate(ctx),
  ...grammar_trigger(ctx),
  ...grammar_in_window(ctx),
  ...grammar_at(ctx),
  ...grammar_color(ctx),
  ...grammar_combo_box(ctx),
  ...grammar_editing(ctx),
  ...grammar_editor(ctx),
  ...grammar_format(ctx),
  ...grammar_frame(ctx),
  ...grammar_image(ctx),
  ...grammar_preselect(ctx),
  ...grammar_query_tuning(ctx),
  ...grammar_radio_set(ctx),
  ...grammar_record(ctx),
  ...grammar_selection_list(ctx),
  ...grammar_slider(ctx),
  ...grammar_size(ctx),
  ...grammar_on_endkey(ctx),
  ...grammar_on_error(ctx),
  ...grammar_on_quit(ctx),
  ...grammar_on_stop(ctx),
  ...grammar_stop_after(ctx),
  ...grammar_view_as(ctx),
  ...grammar_widget(ctx),
});
