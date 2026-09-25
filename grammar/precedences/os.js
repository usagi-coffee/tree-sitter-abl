// References: OS-APPEND, OS-COPY, OS-RENAME, OS-DELETE statements.
export default ($) => [
  // Purpose: prefer function call when filename starts with identifier + '('.
  // Example: OS-APPEND myFunc() target.
  [$.function_call, $._text_operand],
];
