// References: SET statement.
// Purpose: resolve record vs field ambiguity.
// Example: SET foo WITH FRAME f.
export default ($) => [[$.__set_field, $.__set_record]];
