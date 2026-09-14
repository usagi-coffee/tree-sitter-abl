// References: NEW expression with a .NET generic type argument.
export default ($) => [
  // Purpose: keep NEW ClassName<T>(args) reading as a generic type ahead of
  // a bare qualified name, so the '<' after the name is not orphaned.
  // Example: NEW Progress.Collections.List<SomeType> ().
  [$.__new_generic_type_prefix, $._identifier_or_qualified_name],
];
