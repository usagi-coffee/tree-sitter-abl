// References: PUT statement.
// Purpose: attach TO to the PUT item rather than formatting.
// Example: PUT a TO b.
module.exports = ($) => [[$.__put_expression_item, $.__format_colon_to]];
