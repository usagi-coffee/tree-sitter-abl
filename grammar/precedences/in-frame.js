// References: IN FRAME expression (grammar/expressions/in-frame.js; no standalone TOC entry).
// Purpose: make IN FRAME bind as an expression only when explicitly present.
// Example: DISPLAY foo IN WINDOW w.
module.exports = ($) => [[$._in_frame_target, $._primary_expression]];
