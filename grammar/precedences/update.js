// References: UPDATE statement.
export default ($) => [
  // Purpose: prefer UPDATE fields over function-call reduction and bare records.
  // Example: UPDATE Customer WITH FRAME f.
  // Reference: UPDATE statement field and record forms.
  [$.__update_field_target, $.function_call, $.__update_record],
];
