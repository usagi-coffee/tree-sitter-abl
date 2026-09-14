export default ($) => [
  // Parse NEW List<T>() as a generic constructor; keep the name attached
  // to its type arguments instead of reducing it as a plain identifier.
  [$.__new_generic_type, $._identifier_or_qualified_name],
];
