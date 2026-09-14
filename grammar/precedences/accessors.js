export default ($) => [
  // Prefer the handle qualifier in BUFFER hbuf:HANDLE; allow a bare
  // identifier in VALID-OBJECT(Buffer).
  [$.__object_access_handle_type, $._bare_marker_identifier],
];
