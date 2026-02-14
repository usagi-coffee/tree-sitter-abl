// References: RUN STORED-PROCEDURE statement.
// Purpose: parse parentheses as a parameter list, not a standalone expression.
// Example: RUN STORED-PROCEDURE p (x).
module.exports = ($) => [
  // Purpose: parse parentheses as a parameter list, not a standalone expression.
  // Example: RUN STORED-PROCEDURE p (x).
  [$.__run_stored_procedure_param, $.parenthesized_expression],
  // Purpose: in RUN ... IN context, treat following '(' as RUN arguments, not a context function call.
  // Example: RUN p IN hProc (INPUT x).
  [$.__run_context_value, $.function_call],
];
