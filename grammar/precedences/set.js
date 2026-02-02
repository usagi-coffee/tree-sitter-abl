// References: SET statement.
// Purpose: resolve record vs field ambiguity.
// Example: SET foo WITH FRAME f.
module.exports = ($) => [[$.__set_field, $.__set_record]];
