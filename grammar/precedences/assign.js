// References: ASSIGN phrase.
module.exports = ($) => [
  // Purpose: treat FRAME as identifier in ASSIGN, not widget keyword.
  // Example: ASSIGN FRAME = FRAME foo:HANDLE.
  [$.__assign_keyword_identifier, $._widgets],
  // Purpose: if a widget keyword is followed by an identifier, prefer object access.
  // Example: ASSIGN FRAME foo:HANDLE = ... .
  [$.object_access, $.__assign_keyword_identifier],
];
