// References: SUBSCRIBE statement.
module.exports = ($) => [
  // Purpose: prefer function call when subscribe expression uses '('.
  // Example: SUBSCRIBE TO myFunc() IN publisher.
  [$.function_call, $.__subscribe_expression],
  // Purpose: when SUBSCRIBE starts with PROCEDURE/PROC-like token, prefer subscribe body parse.
  // Example: SUBSCRIBE PROCEDURE hProc TO "evt" IN src.
  [ $.__subscribe_body, $._identifier_or_qualified_name],
];
