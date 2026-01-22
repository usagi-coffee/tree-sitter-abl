const assignStatement = require("./assign");
const annotationStatement = require("./annotation");
const accumulateStatement = require("./accumulate");
const bufferCopyStatement = require("./buffer-copy");
const caseStatement = require("./case");
const catchStatement = require("./catch");
const copyLobStatement = require("./copy-lob");
const createStatement = require("./create");
const createSocketStatement = require("./create-socket");
const convertStatement = require("./convert");
const deleteStatement = require("./delete");
const disableTriggersStatement = require("./disable-triggers");
const displayStatement = require("./display");
const doStatement = require("./do");
const enumStatement = require("./enum");
const emptyStatement = require("./empty");
const emptyStatementStatement = require("./empty-statement");
const errorScopeStatement = require("./error-scope");
const exportStatement = require("./export");
const findStatement = require("./find");
const forStatement = require("./for");
const ifStatement = require("./if");
const inputStatement = require("./input");
const inputClearStatement = require("./input-clear");
const inputThroughStatement = require("./input-through");
const importStatement = require("./import");
const leaveStatement = require("./leave");
const messageStatement = require("./message");
const nextStatement = require("./next");
const onStatement = require("./on");
const osCommandStatement = require("./os-command");
const osDeleteStatement = require("./os-delete");
const outputStatement = require("./output");
const pauseStatement = require("./pause");
const preselectRules = require("./preselect");
const putStatement = require("./put");
const releaseStatement = require("./release");
const repeatStatement = require("./repeat");
const runStatement = require("./run");
const returnStatement = require("./return");
const setSizeStatement = require("./set-size");
const setByteOrderStatement = require("./set-byte-order");
const seekStatement = require("./seek");
const usingStatement = require("./using");
const undoStatement = require("./undo");
const varStatement = require("./var");
const waitForStatement = require("./wait-for");

module.exports = (ctx) => {
  return {
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
  };
};
