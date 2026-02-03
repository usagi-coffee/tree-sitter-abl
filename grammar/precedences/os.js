// References: OS-APPEND, OS-COPY, OS-RENAME, OS-DELETE statements.
module.exports = ($) => [
  // Purpose: prefer function call when filename starts with identifier + '('.
  // Example: OS-APPEND myFunc() target.
  [
    $.function_call,
    $.__os_append_filename,
    $.__os_copy_filename,
    $.__os_create_dir_name,
    $.__os_rename_filename,
    $.__os_delete_filename,
  ],
];
