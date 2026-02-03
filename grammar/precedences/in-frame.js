// References: IN FRAME expression (grammar/expressions/in-frame.js; no standalone TOC entry).
// Purpose: make IN FRAME bind as an expression only when explicitly present.
// Example: DISPLAY foo IN WINDOW w.
// Purpose: when IN FRAME follows object access, prefer IN FRAME binding.
// Example: foo:BAR IN FRAME f.
module.exports = ($) => [
  [$._in_frame_target, $._primary_expression],
  [$._in_frame_target, $.object_access],
];
