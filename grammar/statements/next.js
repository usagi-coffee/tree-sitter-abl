module.exports = ({ tkw }) => ({
  next_statement: ($) =>
    prec.right(
      seq(
        tkw("NEXT"),
        optional(field("label", $.identifier)),
        $._terminator,
      ),
    ),
});
