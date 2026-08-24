// References: Parameter passing syntax.
export default ($) => [
  // Purpose: treat BUFFER in argument position as a parameter marker before a handle prefix.
  // Example: RUN p (BUFFER b:HANDLE).
  [$.__argument_body, $.__object_access_handle_type],
];
