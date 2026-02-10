// References: RECORD phrase and AGGREGATE statement.
module.exports = ($) => [
  // Purpose: after `FOR <name> WHERE`, prefer reducing as a record phrase option
  // in ambiguous `FOR EACH ... WHERE BY ...` style loops.
  // Example: FOR EACH customer WHERE BY customer.cust-num:
  [$.__aggregate_where_phrase, $.record_phrase],
];
