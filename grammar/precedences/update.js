// References: UPDATE statement.
// Purpose: treat bare identifiers as fields unless record form is explicit (EXCEPT).
// Example: UPDATE Customer WITH FRAME f.
module.exports = ($) => [[$.__update_field_target, $.__update_record]];
