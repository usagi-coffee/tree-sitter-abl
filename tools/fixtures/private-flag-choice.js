export default grammar({
  name: "fixture",
  rules: {
    __var_modifier: ($) =>
      choice(
        seq($._member_access_modifier, optional($.__var_storage_modifier)),
        $.__var_storage_modifier,
      ),
    __var_storage_modifier: ($) =>
      choice(
        alias(kw("STATIC"), $.static_modifier),
        alias(kw("SERIALIZABLE"), $.serialization_modifier),
        alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
      ),
  },
});
