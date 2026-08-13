// References: DATASET references in expression/statement contexts.
export default ($) => [
  // Purpose: prefer function call over DATASET reference when '(' follows.
  // Example: ACCUMULATE DATASET myFunc().
  [$.function_call, $.dataset_reference],
];
