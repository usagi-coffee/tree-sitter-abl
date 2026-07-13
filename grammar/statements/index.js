import grammar_aggregate from "./aggregate.js";
import grammar_assign from "./assign.js";
import grammar_annotation from "./annotation.js";
import grammar_accumulate from "./accumulate.js";
import grammar_apply from "./apply.js";
import grammar_bell from "./bell.js";
import grammar_browse from "./browse.js";
import grammar_buffer_compare from "./buffer-compare.js";
import grammar_buffer_copy from "./buffer-copy.js";
import grammar_buffer from "./buffer.js";
import grammar_button from "./button.js";
import grammar_call from "./call.js";
import grammar_case from "./case.js";
import grammar_catch from "./catch.js";
import grammar_choose from "./choose.js";
import grammar_class from "./class.js";
import grammar_clear from "./clear.js";
import grammar_close_query from "./close-query.js";
import grammar_close_stored_procedure from "./close-stored-procedure.js";
import grammar_color from "./color.js";
import grammar_compile from "./compile.js";
import grammar_connect from "./connect.js";
import grammar_copy_lob from "./copy-lob.js";
import grammar_create from "./create.js";
import grammar_create_socket from "./create-socket.js";
import grammar_convert from "./convert.js";
import grammar_data_source from "./data-source.js";
import grammar_dataset from "./dataset.js";
import grammar_dde from "./dde.js";
import grammar_delete_alias from "./delete-alias.js";
import grammar_delete from "./delete.js";
import grammar_delete_widget_pool from "./delete-widget-pool.js";
import grammar_dictionary from "./dictionary.js";
import grammar_disable from "./disable.js";
import grammar_disable_triggers from "./disable-triggers.js";
import grammar_disconnect from "./disconnect.js";
import grammar_display from "./display.js";
import grammar_do from "./do.js";
import grammar_dos from "./dos.js";
import grammar_down from "./down.js";
import grammar_enable from "./enable.js";
import grammar_enum from "./enum.js";
import grammar_empty from "./empty.js";
import grammar_empty_statement from "./empty-statement.js";
import grammar_error_scope from "./error-scope.js";
import grammar_event from "./event.js";
import grammar_export from "./export.js";
import grammar_finally from "./finally.js";
import grammar_find from "./find.js";
import grammar_fix_codepage from "./fix-codepage.js";
import grammar_for from "./for.js";
import grammar_form from "./form.js";
import grammar_frame from "./frame.js";
import grammar_function from "./function.js";
import grammar_get from "./get.js";
import grammar_get_key_value from "./get-key-value.js";
import grammar_hide from "./hide.js";
import grammar_if from "./if.js";
import grammar_image from "./image.js";
import grammar_input from "./input.js";
import grammar_input_clear from "./input-clear.js";
import grammar_input_output from "./input-output.js";
import grammar_input_through from "./input-through.js";
import grammar_import from "./import.js";
import grammar_insert from "./insert.js";
import grammar_interface from "./interface.js";
import grammar_leave from "./leave.js";
import grammar_load from "./load.js";
import grammar_load_picture from "./load-picture.js";
import grammar_menu from "./menu.js";
import grammar_message from "./message.js";
import grammar_object_constructors from "./object-constructors.js";
import grammar_next from "./next.js";
import grammar_next_prompt from "./next-prompt.js";
import grammar_on from "./on.js";
import grammar_open_query from "./open-query.js";
import grammar_os_append from "./os-append.js";
import grammar_os_command from "./os-command.js";
import grammar_os_copy from "./os-copy.js";
import grammar_os_create_dir from "./os-create-dir.js";
import grammar_os_delete from "./os-delete.js";
import grammar_os_rename from "./os-rename.js";
import grammar_output from "./output.js";
import grammar_overlay from "./overlay.js";
import grammar_page from "./page.js";
import grammar_parameter from "./parameter.js";
import grammar_pause from "./pause.js";
import grammar_procedure from "./procedure.js";
import grammar_propath from "./propath.js";
import grammar_promsgs from "./promsgs.js";
import grammar_preselect from "./preselect.js";
import grammar_process_events from "./process-events.js";
import grammar_prompt_for from "./prompt-for.js";
import grammar_publish from "./publish.js";
import grammar_put_assign from "./put-assign.js";
import grammar_put from "./put.js";
import grammar_put_cursor from "./put-cursor.js";
import grammar_put_key_value from "./put-key-value.js";
import grammar_put_screen from "./put-screen.js";
import grammar_query from "./query.js";
import grammar_quit from "./quit.js";
import grammar_raw_transfer from "./raw-transfer.js";
import grammar_readkey from "./readkey.js";
import grammar_rectangle from "./rectangle.js";
import grammar_release from "./release.js";
import grammar_release_external from "./release-external.js";
import grammar_release_object from "./release-object.js";
import grammar_repeat from "./repeat.js";
import grammar_reposition from "./reposition.js";
import grammar_run from "./run.js";
import grammar_run_stored_procedure from "./run-stored-procedure.js";
import grammar_return from "./return.js";
import grammar_save_cache from "./save-cache.js";
import grammar_scroll from "./scroll.js";
import grammar_set_size from "./set-size.js";
import grammar_set_byte_order from "./set-byte-order.js";
import grammar_set_pointer_value from "./set-pointer-value.js";
import grammar_set from "./set.js";
import grammar_seek from "./seek.js";
import grammar_show_stats from "./show-stats.js";
import grammar_status from "./status.js";
import grammar_stop from "./stop.js";
import grammar_stream from "./stream.js";
import grammar_submenu from "./submenu.js";
import grammar_subscribe from "./subscribe.js";
import grammar_system_help from "./system-help.js";
import grammar_system_dialog from "./system-dialog.js";
import grammar_temp_table from "./temp-table.js";
import grammar_trigger_procedure from "./trigger-procedure.js";
import grammar_workfile from "./workfile.js";
import grammar_work_table from "./work-table.js";
import grammar_terminal from "./terminal.js";
import grammar_transaction_mode from "./transaction-mode.js";
import grammar_underline from "./underline.js";
import grammar_unix from "./unix.js";
import grammar_unload from "./unload.js";
import grammar_unsubscribe from "./unsubscribe.js";
import grammar_up from "./up.js";
import grammar_update from "./update.js";
import grammar_use from "./use.js";
import grammar_using from "./using.js";
import grammar_undo from "./undo.js";
import grammar_validate from "./validate.js";
import grammar_variable from "./variable.js";
import grammar_var from "./var.js";
import grammar_view from "./view.js";
import grammar_wait_for from "./wait-for.js";
import grammar_value_assignments from "./value-assignments.js";
import grammar_expression from "./expression.js";
import grammar_create_widget from "./create-widget.js";
import grammar_create_temp_table from "./create-temp-table.js";

export default (ctx) => ({
  ...grammar_aggregate(ctx),
  ...grammar_assign(ctx),
  ...grammar_annotation(ctx),
  ...grammar_accumulate(ctx),
  ...grammar_apply(ctx),
  ...grammar_bell(ctx),
  ...grammar_browse(ctx),
  ...grammar_buffer_compare(ctx),
  ...grammar_buffer_copy(ctx),
  ...grammar_buffer(ctx),
  ...grammar_button(ctx),
  ...grammar_call(ctx),
  ...grammar_case(ctx),
  ...grammar_catch(ctx),
  ...grammar_choose(ctx),
  ...grammar_class(ctx),
  ...grammar_clear(ctx),
  ...grammar_close_query(ctx),
  ...grammar_close_stored_procedure(ctx),
  ...grammar_color(ctx),
  ...grammar_compile(ctx),
  ...grammar_connect(ctx),
  ...grammar_copy_lob(ctx),
  ...grammar_create(ctx),
  ...grammar_create_socket(ctx),
  ...grammar_convert(ctx),
  ...grammar_data_source(ctx),
  ...grammar_dataset(ctx),
  ...grammar_dde(ctx),
  ...grammar_delete_alias(ctx),
  ...grammar_delete(ctx),
  ...grammar_delete_widget_pool(ctx),
  ...grammar_dictionary(ctx),
  ...grammar_disable(ctx),
  ...grammar_disable_triggers(ctx),
  ...grammar_disconnect(ctx),
  ...grammar_display(ctx),
  ...grammar_do(ctx),
  ...grammar_dos(ctx),
  ...grammar_down(ctx),
  ...grammar_enable(ctx),
  ...grammar_enum(ctx),
  ...grammar_empty(ctx),
  ...grammar_empty_statement(ctx),
  ...grammar_error_scope(ctx),
  ...grammar_event(ctx),
  ...grammar_export(ctx),
  ...grammar_finally(ctx),
  ...grammar_find(ctx),
  ...grammar_fix_codepage(ctx),
  ...grammar_for(ctx),
  ...grammar_form(ctx),
  ...grammar_frame(ctx),
  ...grammar_function(ctx),
  ...grammar_get(ctx),
  ...grammar_get_key_value(ctx),
  ...grammar_hide(ctx),
  ...grammar_if(ctx),
  ...grammar_image(ctx),
  ...grammar_input(ctx),
  ...grammar_input_clear(ctx),
  ...grammar_input_output(ctx),
  ...grammar_input_through(ctx),
  ...grammar_import(ctx),
  ...grammar_insert(ctx),
  ...grammar_interface(ctx),
  ...grammar_leave(ctx),
  ...grammar_load(ctx),
  ...grammar_load_picture(ctx),
  ...grammar_menu(ctx),
  ...grammar_message(ctx),
  ...grammar_object_constructors(ctx),
  ...grammar_next(ctx),
  ...grammar_next_prompt(ctx),
  ...grammar_on(ctx),
  ...grammar_open_query(ctx),
  ...grammar_os_append(ctx),
  ...grammar_os_command(ctx),
  ...grammar_os_copy(ctx),
  ...grammar_os_create_dir(ctx),
  ...grammar_os_delete(ctx),
  ...grammar_os_rename(ctx),
  ...grammar_output(ctx),
  ...grammar_overlay(ctx),
  ...grammar_page(ctx),
  ...grammar_parameter(ctx),
  ...grammar_pause(ctx),
  ...grammar_procedure(ctx),
  ...grammar_propath(ctx),
  ...grammar_promsgs(ctx),
  ...grammar_preselect(ctx),
  ...grammar_process_events(ctx),
  ...grammar_prompt_for(ctx),
  ...grammar_publish(ctx),
  ...grammar_put_assign(ctx),
  ...grammar_put(ctx),
  ...grammar_put_cursor(ctx),
  ...grammar_put_key_value(ctx),
  ...grammar_put_screen(ctx),
  ...grammar_query(ctx),
  ...grammar_quit(ctx),
  ...grammar_raw_transfer(ctx),
  ...grammar_readkey(ctx),
  ...grammar_rectangle(ctx),
  ...grammar_release(ctx),
  ...grammar_release_external(ctx),
  ...grammar_release_object(ctx),
  ...grammar_repeat(ctx),
  ...grammar_reposition(ctx),
  ...grammar_run(ctx),
  ...grammar_run_stored_procedure(ctx),
  ...grammar_return(ctx),
  ...grammar_save_cache(ctx),
  ...grammar_scroll(ctx),
  ...grammar_set_size(ctx),
  ...grammar_set_byte_order(ctx),
  ...grammar_set_pointer_value(ctx),
  ...grammar_set(ctx),
  ...grammar_seek(ctx),
  ...grammar_show_stats(ctx),
  ...grammar_status(ctx),
  ...grammar_stop(ctx),
  ...grammar_stream(ctx),
  ...grammar_submenu(ctx),
  ...grammar_subscribe(ctx),
  ...grammar_system_help(ctx),
  ...grammar_system_dialog(ctx),
  ...grammar_temp_table(ctx),
  ...grammar_trigger_procedure(ctx),
  ...grammar_workfile(ctx),
  ...grammar_work_table(ctx),
  ...grammar_terminal(ctx),
  ...grammar_transaction_mode(ctx),
  ...grammar_underline(ctx),
  ...grammar_unix(ctx),
  ...grammar_unload(ctx),
  ...grammar_unsubscribe(ctx),
  ...grammar_up(ctx),
  ...grammar_update(ctx),
  ...grammar_use(ctx),
  ...grammar_using(ctx),
  ...grammar_undo(ctx),
  ...grammar_validate(ctx),
  ...grammar_variable(ctx),
  ...grammar_var(ctx),
  ...grammar_view(ctx),
  ...grammar_wait_for(ctx),
  ...grammar_value_assignments(ctx),
  ...grammar_expression(ctx),
  ...grammar_create_widget(ctx),
  ...grammar_create_temp_table(ctx),
});
