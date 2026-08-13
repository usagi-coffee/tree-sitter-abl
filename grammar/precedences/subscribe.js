// References: SUBSCRIBE statement.
export default ($) => [
  // Purpose: prefer function call when subscribe expression uses '('.
  // Example: SUBSCRIBE TO myFunc() IN publisher.
  [$.function_call, $.__subscribe_expression],
  // Purpose: when SUBSCRIBE starts with PROCEDURE/PROC-like token, prefer subscribe body parse.
  // Example: SUBSCRIBE PROCEDURE hProc TO "evt" IN src.
  [$.__subscribe_prefix, $._identifier_or_qualified_name],
  // Purpose: when UNSUBSCRIBE starts with PROCEDURE/PROC-like token, prefer unsubscribe body parse.
  // Example: UNSUBSCRIBE PROCEDURE hProc TO "evt" IN src.
  // Reference: UNSUBSCRIBE statement PROCEDURE phrase.
  [$.__unsubscribe_prefix, $._identifier_or_qualified_name],
];
