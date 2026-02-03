// References: DATASET references in expression/statement contexts.
module.exports = ($) => [
  // Purpose: prefer function call over DATASET reference when '(' follows.
  // Example: ACCUMULATE DATASET myFunc().
  [$.function_call, $.dataset_reference],
];
