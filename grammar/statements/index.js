const aggregateStatement = require("./aggregate");
const assignStatement = require("./assign");
const annotationStatement = require("./annotation");
const accumulateStatement = require("./accumulate");
const applyStatement = require("./apply");
const bellStatement = require("./bell");
const browseDefinition = require("./browse");
const bufferCompareStatement = require("./buffer-compare");
const bufferCopyStatement = require("./buffer-copy");
const bufferDefinition = require("./buffer");
const buttonDefinition = require("./button");
const callStatement = require("./call");
const caseStatement = require("./case");
const catchStatement = require("./catch");
const chooseStatement = require("./choose");
const classDefinition = require("./class");
const clearStatement = require("./clear");
const closeQueryStatement = require("./close-query");
const closeStoredProcedureStatement = require("./close-stored-procedure");
const colorStatement = require("./color");
const compileStatement = require("./compile");
const connectStatement = require("./connect");
const copyLobStatement = require("./copy-lob");
const createStatement = require("./create");
const createSocketStatement = require("./create-socket");
const convertStatement = require("./convert");
const dataSourceDefinition = require("./data-source");
const datasetDefinition = require("./dataset");
const ddeStatement = require("./dde");
const deleteAliasStatement = require("./delete-alias");
const deleteStatement = require("./delete");
const deleteWidgetPoolStatement = require("./delete-widget-pool");
const dictionaryStatement = require("./dictionary");
const disableStatement = require("./disable");
const disableTriggersStatement = require("./disable-triggers");
const disconnectStatement = require("./disconnect");
const displayStatement = require("./display");
const doStatement = require("./do");
const dosStatement = require("./dos");
const downStatement = require("./down");
const enableStatement = require("./enable");
const enumStatement = require("./enum");
const emptyStatement = require("./empty");
const emptyStatementStatement = require("./empty-statement");
const errorScopeStatement = require("./error-scope");
const eventDefinition = require("./event");
const exportStatement = require("./export");
const finallyStatement = require("./finally");
const findStatement = require("./find");
const fixCodepageStatement = require("./fix-codepage");
const forStatement = require("./for");
const formStatement = require("./form");
const frameDefinition = require("./frame");
const functionDefinition = require("./function");
const getStatement = require("./get");
const getKeyValueStatement = require("./get-key-value");
const hideStatement = require("./hide");
const ifStatement = require("./if");
const imageDefinition = require("./image");
const inputStatement = require("./input");
const inputClearStatement = require("./input-clear");
const inputOutputStatement = require("./input-output");
const inputThroughStatement = require("./input-through");
const importStatement = require("./import");
const insertStatement = require("./insert");
const interfaceDefinition = require("./interface");
const leaveStatement = require("./leave");
const loadStatement = require("./load");
const loadPictureStatement = require("./load-picture");
const menuDefinition = require("./menu");
const messageStatement = require("./message");
const objectConstructorsStatement = require("./object-constructors");
const nextStatement = require("./next");
const nextPromptStatement = require("./next-prompt");
const onStatement = require("./on");
const openQueryStatement = require("./open-query");
const osAppendStatement = require("./os-append");
const osCommandStatement = require("./os-command");
const osCopyStatement = require("./os-copy");
const osCreateDirStatement = require("./os-create-dir");
const osDeleteStatement = require("./os-delete");
const osRenameStatement = require("./os-rename");
const outputStatement = require("./output");
const overlayStatement = require("./overlay");
const pageStatement = require("./page");
const parameterDefinition = require("./parameter");
const pauseStatement = require("./pause");
const procedureDefinition = require("./procedure");
const propathStatement = require("./propath");
const promsgsStatement = require("./promsgs");
const preselectRules = require("./preselect");
const processEventsStatement = require("./process-events");
const promptForStatement = require("./prompt-for");
const publishStatement = require("./publish");
const putAssignStatement = require("./put-assign");
const putStatement = require("./put");
const putCursorStatement = require("./put-cursor");
const putKeyValueStatement = require("./put-key-value");
const putScreenStatement = require("./put-screen");
const queryDefinition = require("./query");
const quitStatement = require("./quit");
const rawTransferStatement = require("./raw-transfer");
const readkeyStatement = require("./readkey");
const rectangleDefinition = require("./rectangle");
const releaseStatement = require("./release");
const releaseExternalStatement = require("./release-external");
const releaseObjectStatement = require("./release-object");
const repeatStatement = require("./repeat");
const repositionStatement = require("./reposition");
const runStatement = require("./run");
const runStoredProcedureStatement = require("./run-stored-procedure");
const returnStatement = require("./return");
const saveCacheStatement = require("./save-cache");
const scrollStatement = require("./scroll");
const setSizeStatement = require("./set-size");
const setByteOrderStatement = require("./set-byte-order");
const setPointerValueStatement = require("./set-pointer-value");
const setStatement = require("./set");
const seekStatement = require("./seek");
const showStatsStatement = require("./show-stats");
const statusStatement = require("./status");
const stopStatement = require("./stop");
const streamDefinition = require("./stream");
const submenuDefinition = require("./submenu");
const subscribeStatement = require("./subscribe");
const systemHelpStatement = require("./system-help");
const systemDialogStatement = require("./system-dialog");
const tempTableDefinition = require("./temp-table");
const triggerProcedureStatement = require("./trigger-procedure");
const workTableDefinition = require("./work-table");
const workfileDefinition = require("./workfile");
const terminalStatement = require("./terminal");
const transactionModeStatement = require("./transaction-mode");
const underlineStatement = require("./underline");
const unixStatement = require("./unix");
const unloadStatement = require("./unload");
const unsubscribeStatement = require("./unsubscribe");
const upStatement = require("./up");
const updateStatement = require("./update");
const useStatement = require("./use");
const usingStatement = require("./using");
const undoStatement = require("./undo");
const validateStatement = require("./validate");
const variableDefinition = require("./variable");
const varStatement = require("./var");
const viewStatement = require("./view");
const waitForStatement = require("./wait-for");
const valueAssignmentsStatement = require("./value-assignments");
const expressionStatement = require("./expression");
const createWidgetStatement = require("./create-widget");
const createTempTableStatement = require("./create-temp-table");
const sqlStatement = require("./sql");

module.exports = (ctx) => ({
  ...aggregateStatement(ctx),
  ...assignStatement(ctx),
  ...annotationStatement(ctx),
  ...accumulateStatement(ctx),
  ...applyStatement(ctx),
  ...bellStatement(ctx),
  ...browseDefinition(ctx),
  ...bufferCompareStatement(ctx),
  ...bufferCopyStatement(ctx),
  ...bufferDefinition(ctx),
  ...buttonDefinition(ctx),
  ...callStatement(ctx),
  ...caseStatement(ctx),
  ...catchStatement(ctx),
  ...chooseStatement(ctx),
  ...classDefinition(ctx),
  ...clearStatement(ctx),
  ...closeQueryStatement(ctx),
  ...closeStoredProcedureStatement(ctx),
  ...colorStatement(ctx),
  ...compileStatement(ctx),
  ...connectStatement(ctx),
  ...copyLobStatement(ctx),
  ...createStatement(ctx),
  ...createSocketStatement(ctx),
  ...convertStatement(ctx),
  ...dataSourceDefinition(ctx),
  ...datasetDefinition(ctx),
  ...ddeStatement(ctx),
  ...deleteAliasStatement(ctx),
  ...deleteStatement(ctx),
  ...deleteWidgetPoolStatement(ctx),
  ...dictionaryStatement(ctx),
  ...disableStatement(ctx),
  ...disableTriggersStatement(ctx),
  ...disconnectStatement(ctx),
  ...displayStatement(ctx),
  ...doStatement(ctx),
  ...dosStatement(ctx),
  ...downStatement(ctx),
  ...enableStatement(ctx),
  ...enumStatement(ctx),
  ...emptyStatement(ctx),
  ...emptyStatementStatement(ctx),
  ...errorScopeStatement(ctx),
  ...eventDefinition(ctx),
  ...exportStatement(ctx),
  ...finallyStatement(ctx),
  ...findStatement(ctx),
  ...fixCodepageStatement(ctx),
  ...forStatement(ctx),
  ...formStatement(ctx),
  ...frameDefinition(ctx),
  ...functionDefinition(ctx),
  ...getStatement(ctx),
  ...getKeyValueStatement(ctx),
  ...hideStatement(ctx),
  ...ifStatement(ctx),
  ...imageDefinition(ctx),
  ...inputStatement(ctx),
  ...inputClearStatement(ctx),
  ...inputOutputStatement(ctx),
  ...inputThroughStatement(ctx),
  ...importStatement(ctx),
  ...insertStatement(ctx),
  ...interfaceDefinition(ctx),
  ...leaveStatement(ctx),
  ...loadStatement(ctx),
  ...loadPictureStatement(ctx),
  ...menuDefinition(ctx),
  ...messageStatement(ctx),
  ...objectConstructorsStatement(ctx),
  ...nextStatement(ctx),
  ...nextPromptStatement(ctx),
  ...onStatement(ctx),
  ...openQueryStatement(ctx),
  ...osAppendStatement(ctx),
  ...osCommandStatement(ctx),
  ...osCopyStatement(ctx),
  ...osCreateDirStatement(ctx),
  ...osDeleteStatement(ctx),
  ...osRenameStatement(ctx),
  ...outputStatement(ctx),
  ...overlayStatement(ctx),
  ...pageStatement(ctx),
  ...parameterDefinition(ctx),
  ...pauseStatement(ctx),
  ...procedureDefinition(ctx),
  ...propathStatement(ctx),
  ...promsgsStatement(ctx),
  ...preselectRules(ctx),
  ...processEventsStatement(ctx),
  ...promptForStatement(ctx),
  ...publishStatement(ctx),
  ...putAssignStatement(ctx),
  ...putStatement(ctx),
  ...putCursorStatement(ctx),
  ...putKeyValueStatement(ctx),
  ...putScreenStatement(ctx),
  ...queryDefinition(ctx),
  ...quitStatement(ctx),
  ...rawTransferStatement(ctx),
  ...readkeyStatement(ctx),
  ...rectangleDefinition(ctx),
  ...releaseStatement(ctx),
  ...releaseExternalStatement(ctx),
  ...releaseObjectStatement(ctx),
  ...repeatStatement(ctx),
  ...repositionStatement(ctx),
  ...runStatement(ctx),
  ...runStoredProcedureStatement(ctx),
  ...returnStatement(ctx),
  ...saveCacheStatement(ctx),
  ...scrollStatement(ctx),
  ...setSizeStatement(ctx),
  ...setByteOrderStatement(ctx),
  ...setPointerValueStatement(ctx),
  ...setStatement(ctx),
  ...seekStatement(ctx),
  ...showStatsStatement(ctx),
  ...statusStatement(ctx),
  ...stopStatement(ctx),
  ...streamDefinition(ctx),
  ...submenuDefinition(ctx),
  ...subscribeStatement(ctx),
  ...systemHelpStatement(ctx),
  ...systemDialogStatement(ctx),
  ...tempTableDefinition(ctx),
  ...triggerProcedureStatement(ctx),
  ...workfileDefinition(ctx),
  ...workTableDefinition(ctx),
  ...terminalStatement(ctx),
  ...transactionModeStatement(ctx),
  ...underlineStatement(ctx),
  ...unixStatement(ctx),
  ...unloadStatement(ctx),
  ...unsubscribeStatement(ctx),
  ...upStatement(ctx),
  ...updateStatement(ctx),
  ...useStatement(ctx),
  ...usingStatement(ctx),
  ...undoStatement(ctx),
  ...validateStatement(ctx),
  ...variableDefinition(ctx),
  ...varStatement(ctx),
  ...viewStatement(ctx),
  ...waitForStatement(ctx),
  ...valueAssignmentsStatement(ctx),
  ...expressionStatement(ctx),
  ...createWidgetStatement(ctx),
  ...createTempTableStatement(ctx),
  ...sqlStatement(ctx),
});
