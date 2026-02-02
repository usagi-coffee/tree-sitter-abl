// References: ASSIGN phrase.
module.exports = ($) => [
  // Purpose: treat FRAME as identifier in ASSIGN, not widget keyword.
  // Example: ASSIGN FRAME = FRAME foo:HANDLE.
  [$.__assign_keyword_identifier, $._widgets],
];
