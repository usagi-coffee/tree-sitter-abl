// References: OS-APPEND, OS-COPY, OS-RENAME, OS-DELETE statements.
export default ($) => [
  // Purpose: prefer function call when filename starts with identifier + '('.
  // Example: OS-APPEND myFunc() target.
  [$.function_call, $._string_or_identifier_access_or_call],
  // Purpose: prefer function call over the identifier/access wrapper when '(' follows.
  // Example: OS-APPEND myFunc() target.
  // Reference: OS-APPEND statement filename expression.
  [$.function_call, $._identifier_or_access],
];
