export default grammar({
  name: "fixture",
  rules: {
    global_define_preprocessor_directive: ($) =>
      seq(token(prec(1, /&GLOBAL-DEFINE/i)), $.__define_preprocessor_body),
    scoped_define_preprocessor_directive: ($) =>
      seq(token(prec(1, /&SCOPED-DEFINE/i)), $.__define_preprocessor_body),
    __define_preprocessor_body: ($) =>
      seq(field("name", $.identifier), field("value", $.preprocessor_value)),
    identifier: ($) => token(/[_A-Za-z][A-Za-z0-9_\-&#%$!]*/),
    preprocessor_value: ($) => token(/[^\n]+(?:~\s*\n[^\n]+)*/),
  },
});
