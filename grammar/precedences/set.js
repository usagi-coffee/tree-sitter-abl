// References: SET statement.
// Purpose: resolve record vs field ambiguity.
// Example: SET foo WITH FRAME f.
export default ($) => [[$.__set_field, $._set_update_record_body]];
