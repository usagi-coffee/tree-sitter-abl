// References: OS-APPEND, OS-COPY, OS-RENAME, OS-DELETE statements.
module.exports = ($) => [
  // Purpose: prefer function call when filename starts with identifier + '('.
  // Example: OS-APPEND myFunc() target.
  [$.function_call, $._os_filename],
  // Purpose: prefer function call over the identifier/access wrapper when '(' follows.
  // Example: OS-APPEND myFunc() target.
  // Reference: OS-APPEND statement filename expression.
  [$.function_call, $._identifier_or_access],
];
