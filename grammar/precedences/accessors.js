export default ($) => [
  // Prefer the handle qualifier in BUFFER hbuf:HANDLE; allow a bare
  // identifier in VALID-OBJECT(Buffer).
  [$.__object_access_handle_type, $._bare_marker_identifier],
  // Preserve the same qualifier preference before standalone assignment widgets.
  // Example: x = BUFFER hbuf:HANDLE.
  [$.__object_access_handle_type, "assignment_marker_value"],
];
