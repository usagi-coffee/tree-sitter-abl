// References: STREAM phrase.
export default ($) => [
  // Purpose: consume a statement STREAM phrase before considering a handle-prefixed expression.
  // Example: DOWN STREAM s.
  [$._stream_phrase, $.__object_access_handle_type],
];
