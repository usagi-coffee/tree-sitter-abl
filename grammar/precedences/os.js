// References: OS-APPEND, OS-COPY, OS-RENAME, OS-DELETE statements.
module.exports = ($) => [
  // Purpose: prefer function call when filename starts with identifier + '('.
  // Example: OS-APPEND myFunc() target.
  [$.function_call, $.__os_filename],
];
