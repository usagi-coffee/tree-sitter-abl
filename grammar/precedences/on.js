// References: ON statement database events.
export default ($) => [
  // Purpose: prefer NEW buffer OLD buffer as an ON referencing phrase.
  // Example: ON CREATE OF Customer NEW newCustomer OLD oldCustomer.
  // Reference: ON statement REFERENCE-NEW/REFERENCE-OLD syntax.
  [$.__on_referencing_phrase, $.__new_prefix],
  // Purpose: keep overlapping key labels on the UI-event path until the following token resolves it.
  // Example: ON TAB OF field DO: END.
  // Reference: ON statement event-list and key-label forms.
  [$.__on_ui_event, $.__on_key_label, $._events],
];
