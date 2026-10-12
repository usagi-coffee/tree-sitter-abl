; nvim-treesitter indentation captures. Indent owning constructs rather than
; body nodes: body includes END for routines but excludes it for DO/FOR/REPEAT.
[
  (class_definition)
  (interface_definition)
  (enum_statement)
  (function_definition)
  (procedure_definition)
  (constructor_definition)
  (destructor_definition)
  (do_statement)
  (for_statement)
  (repeat_statement)
  (case_statement)
  (catch_statement)
  (finally_statement)
  (editing_phrase)
  (trigger_body)
] @indent.begin

(method_definition (body)) @indent.begin
(trigger_phrase "TRIGGERS") @indent.begin

; A single statement after THEN/ELSE needs the same indentation as a DO block.
; nvim-treesitter applies only one increment to constructs starting on one line.
[(if_statement) (case_when_phrase) (case_otherwise_phrase)] @indent.begin
"ELSE" @indent.branch
(if_statement else: [(do_statement) (if_statement)] @indent.dedent)
; An ELSE IF and its THEN DO can start on the same row. Dedent the inner
; block too because the engine processes a row only once.
(if_statement else: (if_statement then: (do_statement) @indent.dedent))

; GET/SET bodies are flattened directly into property_definition. Accessor
; headers and END align with DEFINE PROPERTY; their statements indent once.
(property_definition ":") @indent.begin
(property_definition ["GET" "SET"] @indent.branch)

; Multiline declarations, assignments, calls, and expressions.
[
  (variable_definition)
  (var_statement)
  (temp_table_definition)
  (work_table_definition)
  (workfile_definition)
  (dataset_definition)
  (assign_statement)
  (assignment_statement)
  (arguments)
  (parameters)
  (property_set_parameter_list)
  (parenthesized_expression)
  (array_initializer)
  (array_access)
  (include_file_reference)
] @indent.begin

["END" ")" "]" "}"] @indent.branch
["END" ")" "]" "}"] @indent.end

; Scanner-owned text must retain its internal whitespace.
[(string_literal) (block_comment) (preprocessor_value)] @indent.auto
