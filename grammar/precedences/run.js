// References: RUN STORED-PROCEDURE statement.
// Purpose: parse parentheses as a parameter list, not a standalone expression.
// Example: RUN STORED-PROCEDURE p (x).
module.exports = ($) => [[$.__run_stored_procedure_param, $.parenthesized_expression]];
