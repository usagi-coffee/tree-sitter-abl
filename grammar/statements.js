const assignStatement = require("./statements/assign");
const annotationStatement = require("./statements/annotation");
const accumulateStatement = require("./statements/accumulate");
const bufferCopyStatement = require("./statements/buffer-copy");
const caseStatement = require("./statements/case");
const catchStatement = require("./statements/catch");
const copyLobStatement = require("./statements/copy-lob");
const createStatement = require("./statements/create");
const createSocketStatement = require("./statements/create-socket");
const convertStatement = require("./statements/convert");
const deleteStatement = require("./statements/delete");
const disableTriggersStatement = require("./statements/disable-triggers");
const displayStatement = require("./statements/display");
const doStatement = require("./statements/do");
const enumStatement = require("./statements/enum");
const emptyStatement = require("./statements/empty");
const emptyStatementStatement = require("./statements/empty-statement");
const errorScopeStatement = require("./statements/error-scope");
const exportStatement = require("./statements/export");
const findStatement = require("./statements/find");
const forStatement = require("./statements/for");
const ifStatement = require("./statements/if");
const inputStatement = require("./statements/input");
const inputClearStatement = require("./statements/input-clear");
const inputThroughStatement = require("./statements/input-through");
const importStatement = require("./statements/import");
const leaveStatement = require("./statements/leave");
const messageStatement = require("./statements/message");
const nextStatement = require("./statements/next");
const onStatement = require("./statements/on");
const osCommandStatement = require("./statements/os-command");
const osDeleteStatement = require("./statements/os-delete");
const outputStatement = require("./statements/output");
const pauseStatement = require("./statements/pause");
const preselectRules = require("./statements/preselect");
const putStatement = require("./statements/put");
const releaseStatement = require("./statements/release");
const repeatStatement = require("./statements/repeat");
const runStatement = require("./statements/run");
const returnStatement = require("./statements/return");
const setSizeStatement = require("./statements/set-size");
const setByteOrderStatement = require("./statements/set-byte-order");
const seekStatement = require("./statements/seek");
const usingStatement = require("./statements/using");
const undoStatement = require("./statements/undo");
const varStatement = require("./statements/var");
const waitForStatement = require("./statements/wait-for");

module.exports = (ctx) => ({
    _statement: ($) =>
      choice(
        $.preprocessor_directive,
        $.include,
        $._definition,
        $._statement_no_def,
      ),

    _statement_no_def: ($) =>
      choice(
        $.enum_statement,
        $.var_statement,
        $.if_statement,
        $.do_block,
        $.for_each_statement,
        $.find_statement,
        $.repeat_statement,
        $.display_statement,
        $.accumulate_statement,
        $.empty_temp_table_statement,
        $.empty_statement,
        $.block_level_on_error_statement,
        $.routine_level_on_error_statement,
        $.export_statement,
        $.assign_statement,
        $.annotation_statement,
        $.run_statement,
        $.create_statement,
        $.create_socket_statement,
        $.delete_statement,
        $.delete_object_statement,
        $.buffer_copy_statement,
        $.copy_lob_statement,
        $.convert_statement,
        $.disable_triggers_statement,
        $.input_statement,
        $.input_clear_statement,
        $.input_through_statement,
        $.import_statement,
        $.message_statement,
        $.put_statement,
        $.on_statement,
        $.using_statement,
        $.output_statement,
        $.os_delete_statement,
        $.os_command_statement,
        $.pause_statement,
        $.next_statement,
        $.leave_statement,
        $.release_statement,
        $.case_statement,
        $.catch_statement,
        $.return_statement,
        $.set_byte_order_statement,
        $.set_size_statement,
        $.seek_statement,
        $.undo_statement,
        $.wait_for_statement,
        $.assignment_statement,
        $.expression_statement,
      ),

    ...assignStatement(ctx),
    ...annotationStatement(ctx),
    ...accumulateStatement(ctx),
    ...displayStatement(ctx),
    ...createStatement(ctx),
    ...createSocketStatement(ctx),
    ...deleteStatement(ctx),
    ...bufferCopyStatement(ctx),
    ...caseStatement(ctx),
    ...catchStatement(ctx),
    ...copyLobStatement(ctx),
    ...putStatement(ctx),
    ...outputStatement(ctx),
    ...convertStatement(ctx),
    ...disableTriggersStatement(ctx),
    ...inputStatement(ctx),
    ...inputClearStatement(ctx),
    ...inputThroughStatement(ctx),
    ...importStatement(ctx),
    ...messageStatement(ctx),
    ...onStatement(ctx),
    ...osDeleteStatement(ctx),
    ...osCommandStatement(ctx),
    ...pauseStatement(ctx),
    ...preselectRules(ctx),
    ...nextStatement(ctx),
    ...leaveStatement(ctx),
    ...releaseStatement(ctx),
    ...doStatement(ctx),
    ...enumStatement(ctx),
    ...emptyStatement(ctx),
    ...emptyStatementStatement(ctx),
    ...errorScopeStatement(ctx),
    ...exportStatement(ctx),
    ...findStatement(ctx),
    ...forStatement(ctx),
    ...ifStatement(ctx),
    ...repeatStatement(ctx),
    ...runStatement(ctx),
    ...returnStatement(ctx),
    ...setByteOrderStatement(ctx),
    ...setSizeStatement(ctx),
    ...seekStatement(ctx),
    ...usingStatement(ctx),
    ...undoStatement(ctx),
    ...varStatement(ctx),
    ...waitForStatement(ctx),
  });
