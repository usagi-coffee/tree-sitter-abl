// References: RAW-TRANSFER statement.
export default ($) => [
  // Purpose: consume RAW-TRANSFER BUFFER markers before considering a handle prefix.
  // Example: RAW-TRANSFER FIELD source TO BUFFER target.
  [$.__raw_transfer_prefix, $.__object_access_handle_type],
];
