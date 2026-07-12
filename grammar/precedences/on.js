// References: ON statement database events.
module.exports = ($) => [
  // Purpose: prefer NEW buffer OLD buffer as an ON referencing phrase.
  // Example: ON CREATE OF Customer NEW newCustomer OLD oldCustomer.
  // Reference: ON statement REFERENCE-NEW/REFERENCE-OLD syntax.
  [$.__on_referencing_phrase, $.__new_prefix],
];
