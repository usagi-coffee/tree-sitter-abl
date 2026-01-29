module.exports = ({ kw, tkw }) => ({
  input_expression: ($) =>
    prec.dynamic(
      -1,
      seq(
        tkw("INPUT"),
        optional(seq(tkw("FRAME"), field("frame", $.identifier))),
        field(
          "field",
          choice(
            $.identifier,
            $.qualified_name,
            $.object_access,
            $.array_access,
            $.scoped_name,
          ),
        ),
      ),
    ),
});
