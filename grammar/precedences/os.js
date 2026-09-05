// References: OS-APPEND, OS-COPY, OS-RENAME, OS-DELETE statements.
export default ($) => [
  // Purpose: prefer function call when filename starts with identifier + '('.
  // Example: OS-APPEND myFunc() target.
  [$.function_call, $._string_or_identifier_access_or_call],
];
