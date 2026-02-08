// References: MESSAGE statement; widget keywords.
module.exports = ($) => [
  // Purpose: in `MESSAGE MENU.`, prefer `MENU` as message expression over widget tokenization.
  // Example: MESSAGE MENU.
  // Reference: MESSAGE statement value list.
  [$.__message_expression, $._widgets],
];
