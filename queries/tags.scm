; Definitions use the enclosing construct as the symbol range.
(class_definition name: (_) @name) @definition.class
(interface_definition name: (_) @name) @definition.interface
(enum_statement name: (_) @name) @definition.type
(function_definition name: (_) @name) @definition.function
(function_forward_definition name: (_) @name) @definition.function
(procedure_definition name: (_) @name) @definition.function
(method_definition name: (identifier) @name) @definition.method
(constructor_definition name: (identifier) @name) @definition.method
(destructor_definition name: (identifier) @name) @definition.method
(property_definition name: (identifier) @name) @definition.property
(event_definition name: (identifier) @name) @definition.event
(temp_table_definition name: (identifier) @name) @definition.type
(work_table_definition name: (identifier) @name) @definition.type
(workfile_definition name: (identifier) @name) @definition.type
(dataset_definition name: (identifier) @name) @definition.type

; Static calls only: VALUE(...) and dynamic string targets are runtime values.
(function_call function: (identifier) @name) @reference.call
(function_call function: (qualified_name right: (identifier) @name .)) @reference.call
(function_call function: (scoped_name right: (identifier) @name .)) @reference.call
(function_call function: (object_access right: (identifier) @name .)) @reference.call
(function_call function: (object_access member: (identifier) @name .)) @reference.call
(run_statement procedure: [(identifier) (procedure_name)] @name) @reference.call
(run_statement procedure: (qualified_name right: (identifier) @name .)) @reference.call
(class_definition super: (_) @name) @reference.class
(class_definition interface: (_) @name) @reference.implementation
(interface_definition super: (_) @name) @reference.implementation
(new_expression type: (_) @name) @reference.class
