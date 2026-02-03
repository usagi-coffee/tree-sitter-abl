// References: RUN STORED-PROCEDURE statement.
// Purpose: parse parentheses as a parameter list, not a standalone expression.
// Example: RUN STORED-PROCEDURE p (x).
module.exports = ($) => [
  // Purpose: parse parentheses as a parameter list, not a standalone expression.
  // Example: RUN STORED-PROCEDURE p (x).
  [$.__run_stored_procedure_param, $.parenthesized_expression],
  // Purpose: prefer function call when run context value is followed by '('.
  // Example: ON EVENT RUN ASYNCHRONOUS EVENT-PROCEDURE expr IN myFunc().
  [$.function_call, $.__run_context_value],
];
