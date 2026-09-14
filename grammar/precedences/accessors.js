// References: BUFFER/TABLE-HANDLE as a plain identifier (not reserved words).
export default ($) => [
  // Purpose: BUFFER is usable as a plain identifier (not reserved), but keep
  // the handle-type qualifier reading first wherever both are still live.
  // Example: BUFFER hbuf:HANDLE vs. VALID-OBJECT(Buffer).
  [$.__object_access_handle_type, $._bare_marker_identifier],
];
