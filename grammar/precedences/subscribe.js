// References: SUBSCRIBE statement.
module.exports = ($) => [
  // Purpose: prefer function call when subscribe expression uses '('.
  // Example: SUBSCRIBE TO myFunc() IN publisher.
  [$.function_call, $.__subscribe_expression],
];
