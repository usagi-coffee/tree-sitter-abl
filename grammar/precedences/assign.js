// References: ASSIGN phrase.
module.exports = ($) => [
  // Purpose: treat FRAME as identifier in ASSIGN, not widget keyword.
  // Example: ASSIGN FRAME = FRAME foo:HANDLE.
  [$.__assign_keyword_identifier, $._widgets],
  // Purpose: if a widget keyword is followed by an identifier, prefer object access.
  // Example: ASSIGN FRAME foo:HANDLE = ... .
  [$.object_access, $.__assign_keyword_identifier],
  // Purpose: prefer record form in ASSIGN when EXCEPT is present.
  // Example: ASSIGN Customer EXCEPT Name.
  [$.__assign_record_body, $._assignable],
  // Purpose: treat identifier + '(' as a function call assignable.
  // Example: ASSIGN SomeFunc() = 1.
  [$.function_call, $._assignable],
  // Purpose: prefer ASSIGN statement over generic assignment.
  // Example: ASSIGN Customer EXCEPT Name.
  [$.assign_statement, $.assignment_statement],
];
