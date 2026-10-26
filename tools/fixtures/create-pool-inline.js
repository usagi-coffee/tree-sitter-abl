export default grammar({
  rules: {
    _handle_in_widget_pool: ($) =>
      seq(field("handle", $._identifier_or_array_access), optional($._in_widget_pool)),
    __create_handle_with_pool_no_error_body: ($) =>
      seq(
        choice($._kw_call, $._kw_query, kw("SAX-READER"), kw("SAX-WRITER"), kw("SAX-ATTRIBUTES")),
        $._handle_in_widget_pool,
      ),
    __create_handle_with_pool_body: ($) =>
      seq(
        choice(
          kw("CLIENT-PRINCIPAL"),
          $._kw_data_source,
          $._kw_dataset,
          kw("X-DOCUMENT"),
          kw("X-NODEREF"),
          kw("SOAP-HEADER"),
          kw("SOAP-HEADER-ENTRYREF"),
        ),
        $._handle_in_widget_pool,
      ),
  },
});
