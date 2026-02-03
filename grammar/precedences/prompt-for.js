// References: PROMPT-FOR statement.
module.exports = ($) => [
  // Purpose: prefer field list over record form when ambiguous.
  // Example: PROMPT-FOR Customer.Name WITH FRAME f.
  [$.__prompt_for_field, $.__prompt_for_record_body],
  // Purpose: prefer field list when identifier collides with record form.
  // Example: PROMPT-FOR Customer WITH FRAME f.
  [$._identifier_or_qualified_name, $.__prompt_for_record_body],
];
