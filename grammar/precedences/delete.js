// References: DELETE ALIAS / DELETE WIDGET-POOL statements.
module.exports = ($) => [
  // Purpose: prefer specific DELETE forms over generic DELETE record.
  // Example: DELETE ALIAS myalias.
  [$.delete_alias_statement, $.delete_statement],
  // Example: DELETE WIDGET-POOL wp.
  [$.delete_widget_pool_statement, $.delete_statement],
];
