// References: PROMPT-FOR statement.
// Purpose: prefer field list over record form when ambiguous.
// Example: PROMPT-FOR Customer.Name WITH FRAME f.
module.exports = ($) => [[$.__prompt_for_field, $.__prompt_for_record_body]];
