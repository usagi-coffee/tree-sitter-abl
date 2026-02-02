const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  stream_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      ...definitionModifiers($, kw, {
        new: true,
        scope: ["GLOBAL", "SHARED"],
        access: ["PRIVATE"],
      }),
      kw("STREAM"),
      field("name", $.identifier),
      $._terminator,
    ),
});
