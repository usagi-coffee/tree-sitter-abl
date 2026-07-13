// References: DEFINE FRAME statement.
export default ($) => [
  // Purpose: prefer function call when frame form item is followed by '('.
  // Example: DEFINE FRAME f myFunc().
  [$.function_call, $.__frame_form_item],
];
