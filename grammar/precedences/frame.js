// References: DEFINE FRAME statement.
module.exports = ($) => [
  // Purpose: prefer function call when frame form item is followed by '('.
  // Example: DEFINE FRAME f myFunc().
  [$.function_call, $.__frame_form_item],
];
