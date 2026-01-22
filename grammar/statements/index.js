const assignStatement = require("./assign");
const annotationStatement = require("./annotation");
const accumulateStatement = require("./accumulate");
const applyStatement = require("./apply");
const bellStatement = require("./bell");
const bufferCopyStatement = require("./buffer-copy");
const caseStatement = require("./case");
const catchStatement = require("./catch");
const chooseStatement = require("./choose");
const clearStatement = require("./clear");
const closeQueryStatement = require("./close-query");
const colorStatement = require("./color");
const compileStatement = require("./compile");
const connectStatement = require("./connect");
const copyLobStatement = require("./copy-lob");
const createStatement = require("./create");
const createSocketStatement = require("./create-socket");
const convertStatement = require("./convert");
const deleteStatement = require("./delete");
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
const exportStatement = require("./export");
const findStatement = require("./find");
const forStatement = require("./for");
const formStatement = require("./form");
const getStatement = require("./get");
const hideStatement = require("./hide");
const ifStatement = require("./if");
const inputStatement = require("./input");
const inputClearStatement = require("./input-clear");
const inputThroughStatement = require("./input-through");
const importStatement = require("./import");
const insertStatement = require("./insert");
const leaveStatement = require("./leave");
const loadStatement = require("./load");
const messageStatement = require("./message");
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
const pageStatement = require("./page");
const pauseStatement = require("./pause");
const preselectRules = require("./preselect");
const processEventsStatement = require("./process-events");
const promptForStatement = require("./prompt-for");
const publishStatement = require("./publish");
const putStatement = require("./put");
const quitStatement = require("./quit");
const rawTransferStatement = require("./raw-transfer");
const readkeyStatement = require("./readkey");
const releaseStatement = require("./release");
const repeatStatement = require("./repeat");
const repositionStatement = require("./reposition");
const runStatement = require("./run");
const returnStatement = require("./return");
const scrollStatement = require("./scroll");
const setSizeStatement = require("./set-size");
const setByteOrderStatement = require("./set-byte-order");
const setStatement = require("./set");
const seekStatement = require("./seek");
const statusStatement = require("./status");
const stopStatement = require("./stop");
const subscribeStatement = require("./subscribe");
const superStatement = require("./super");
const systemDialogStatement = require("./system-dialog");
const terminalStatement = require("./terminal");
const underlineStatement = require("./underline");
const unixStatement = require("./unix");
const unloadStatement = require("./unload");
const unsubscribeStatement = require("./unsubscribe");
const upStatement = require("./up");
const updateStatement = require("./update");
const usingStatement = require("./using");
const undoStatement = require("./undo");
const validateStatement = require("./validate");
const varStatement = require("./var");
const viewStatement = require("./view");
const waitForStatement = require("./wait-for");

module.exports = (ctx) => {
  return {
    ...assignStatement(ctx),
    ...annotationStatement(ctx),
    ...accumulateStatement(ctx),
    ...applyStatement(ctx),
    ...bellStatement(ctx),
    ...bufferCopyStatement(ctx),
    ...caseStatement(ctx),
    ...catchStatement(ctx),
    ...chooseStatement(ctx),
    ...clearStatement(ctx),
    ...closeQueryStatement(ctx),
    ...colorStatement(ctx),
    ...compileStatement(ctx),
    ...connectStatement(ctx),
    ...copyLobStatement(ctx),
    ...createStatement(ctx),
    ...createSocketStatement(ctx),
    ...convertStatement(ctx),
    ...deleteStatement(ctx),
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
    ...exportStatement(ctx),
    ...findStatement(ctx),
    ...forStatement(ctx),
    ...formStatement(ctx),
    ...getStatement(ctx),
    ...hideStatement(ctx),
    ...ifStatement(ctx),
    ...inputStatement(ctx),
    ...inputClearStatement(ctx),
    ...inputThroughStatement(ctx),
    ...importStatement(ctx),
    ...insertStatement(ctx),
    ...leaveStatement(ctx),
    ...loadStatement(ctx),
    ...messageStatement(ctx),
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
    ...pageStatement(ctx),
    ...pauseStatement(ctx),
    ...preselectRules(ctx),
    ...processEventsStatement(ctx),
    ...promptForStatement(ctx),
    ...publishStatement(ctx),
    ...putStatement(ctx),
    ...quitStatement(ctx),
    ...rawTransferStatement(ctx),
    ...readkeyStatement(ctx),
    ...releaseStatement(ctx),
    ...repeatStatement(ctx),
    ...repositionStatement(ctx),
    ...runStatement(ctx),
    ...returnStatement(ctx),
    ...scrollStatement(ctx),
    ...setSizeStatement(ctx),
    ...setByteOrderStatement(ctx),
    ...setStatement(ctx),
    ...seekStatement(ctx),
    ...statusStatement(ctx),
    ...stopStatement(ctx),
    ...subscribeStatement(ctx),
    ...superStatement(ctx),
    ...systemDialogStatement(ctx),
    ...terminalStatement(ctx),
    ...underlineStatement(ctx),
    ...unixStatement(ctx),
    ...unloadStatement(ctx),
    ...unsubscribeStatement(ctx),
    ...upStatement(ctx),
    ...updateStatement(ctx),
    ...usingStatement(ctx),
    ...undoStatement(ctx),
    ...validateStatement(ctx),
    ...varStatement(ctx),
    ...viewStatement(ctx),
    ...waitForStatement(ctx),
  };
};
